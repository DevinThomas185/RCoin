import os
from requests import post

from typing import Any

from solana.publickey import PublicKey
from solana.rpc.types import TokenAccountOpts
from typing import Callable

from solders.signature import Signature
from solders.rpc.responses import (
    GetTransactionResp,
    GetSignaturesForAddressResp,
    RpcKeyedAccount,
)
from solders.transaction_status import (
    EncodedTransactionWithStatusMeta,
    EncodedConfirmedTransactionWithStatusMeta,
)

from spl.token.constants import TOKEN_PROGRAM_ID

from rcoin.solana_backend.common import (
    FEE_ACCOUNT,
    RESERVE_ACCOUNT,
    SOLANA_CLIENT,
    LAMPORTS_PER_SOL,
    MINT_ACCOUNT,
    TOKEN_DECIMALS,
    TOKEN_OWNER,
)

from rcoin.solana_backend.response import CustomResponse, Failure

from rcoin.solana_backend.exceptions import BlockchainQueryFailedException


def execute_query(query_function: Callable[[], CustomResponse]) -> CustomResponse:
    try:
        return query_function()

    except BlockchainQueryFailedException as exception:
        return Failure("exception", exception)


def get_balance(public_key: PublicKey) -> int:
    try:
        return SOLANA_CLIENT.get_balance(public_key).value
    except Exception:
        raise BlockchainQueryFailedException


def get_sol_balance(public_key: PublicKey) -> float:
    return get_balance(public_key) / LAMPORTS_PER_SOL


def has_token_account(public_key: PublicKey) -> bool:
    try:
        accounts: list[RpcKeyedAccount] = SOLANA_CLIENT.get_token_accounts_by_owner(
            public_key, TokenAccountOpts(mint=MINT_ACCOUNT)
        ).value
    except Exception:
        raise BlockchainQueryFailedException

    return accounts != []


def get_token_balance(public_key: PublicKey) -> float:
    solana_client = os.getenv("SOLANA_CLIENT")
    assert solana_client is not None

    payload = {
        "jsonrpc": "2.0",
        "id": 1,
        "method": "getTokenAccountsByOwner",
        "params": [
            f"{public_key}",
            {"programId": f"{TOKEN_PROGRAM_ID}"},
            {"encoding": "jsonParsed"},
        ],
    }

    try:

        r = post(solana_client, json=payload)
        j = r.json()
        amount = float(
            j["result"]["value"][0]["account"]["data"]["parsed"]["info"]["tokenAmount"][
                "amount"
            ]
        ) / (10**TOKEN_DECIMALS)

    except Exception:
        raise BlockchainQueryFailedException

    return amount


def get_reserve_balance() -> float:
    solana_client = os.getenv("SOLANA_CLIENT")
    assert solana_client is not None

    payload = {
        "jsonrpc": "2.0",
        "id": 1,
        "method": "getTokenAccountsByOwner",
        "params": [
            f"{str(TOKEN_OWNER)}",
            {"programId": f"{TOKEN_PROGRAM_ID}"},
            {"encoding": "jsonParsed"},
        ],
    }

    try:

        r = post(solana_client, json=payload)
        j = r.json()
        accounts = j["result"]["value"]
        amount = None
        for account in accounts:
            if account["pubkey"] == str(RESERVE_ACCOUNT):
                amount = float(
                    account["account"]["data"]["parsed"]["info"]["tokenAmount"][
                        "amount"
                    ]
                ) / (10**TOKEN_DECIMALS)

                break

        if amount is None:
            raise BlockchainQueryFailedException

    except Exception:
        raise BlockchainQueryFailedException

    return amount


def get_processed_transactions_for_account(public_key: PublicKey, limit: int):
    resp = get_raw_transactions_for_account(public_key, limit)

    transactions: list[GetTransactionResp] = [
        (str(status.signature), get_transaction_details(status.signature))
        for status in resp.value
    ]
    confirmed_transactions: list[EncodedConfirmedTransactionWithStatusMeta] = [
        (signature, transaction.value.transaction, transaction.value.block_time)
        for signature, transaction in transactions
        if transaction.value
    ]

    processed_transactions = []
    for signature, confirmed_transaction, block_time in confirmed_transactions:
        # Skip the transaction if it doesn't have the metadata for some reason.
        if confirmed_transaction.meta is None:
            continue

        pre_token_balances = confirmed_transaction.meta.pre_token_balances
        post_token_balances = confirmed_transaction.meta.post_token_balances

        if pre_token_balances is None or post_token_balances is None:
            continue

        # We are looking for transactions involving the transfer of tokens,
        # hence we expect that there are 2 or 3 accounts involved
        # (3 in case of a transfer when the fee account is involved)
        # in the transaction. When checking the length of the list ,
        # we don't consider the list of pre_token_balances,
        # because there is an edge case when we send to an account which doesn't
        # have an associated token account and then the token account is created
        # but not included in pre_token_balances as it doesn't exist at that
        # point.
        if len(post_token_balances) != 2 and len(post_token_balances) != 3:
            continue

        is_relevant = True

        # We are searching only for transactions which involved some transfer
        # of our stablecoin tokens. Hence, if the mint associated with either
        # of the two accounts is not equal to the address of our mint account,
        # we skip the transaction.

        for pre_token_balance in pre_token_balances:
            if str(pre_token_balance.mint) != str(MINT_ACCOUNT):
                is_relevant = False
                break

        for post_token_balance in post_token_balances:
            if str(post_token_balance.mint) != str(MINT_ACCOUNT):
                is_relevant = False
                break

        if not is_relevant:
            continue

        transaction_details = extract_transaction_details(pre_token_balances, post_token_balances)


        processed_transactions.append(
            {
                "signature": signature,
                "sender": transaction_details["sender"],
                "recipient": transaction_details["recipient"],
                "amount": transaction_details["amount"],
                "block_time": block_time,
            }
        )

    return processed_transactions

def extract_transaction_details(pre_token_balances, post_token_balances) -> Any:
    def get_balances_map(balances_list):
            balance_map = {}
            for token_balance in balances_list:
                owner: str = str(token_balance.owner)
                balance_map[owner] = int(token_balance.ui_token_amount.amount)

            return balance_map

    pre_balances_map = get_balances_map(pre_token_balances)
    post_balances_map = get_balances_map(post_token_balances)

    balance_deltas_map = {}
    for owner, post_balance in post_balances_map.items():
        # If the pre_balances_map doesn't have an entry for the owner
        # it means that he didn't have a token account before the transaction
        # and it was created for him as a part of the transfer. In which case
        # we set the pre_balance to 0.
        if owner not in pre_balances_map.keys():
            pre_balances_map[owner] = 0

        balance_deltas_map[owner] = post_balance - pre_balances_map[owner]

    sender = None
    recipient = None
    amount = None

    if len(balance_deltas_map) == 2:
        # If there are only two accounts involved, we are dealing with
        # issue/withdraw without the fee.
        for owner, delta in balance_deltas_map.items():
            if delta < 0:
                # Sender of money is the one whose amount decreases as a result
                # of the transaction i.e. has a negative delta.
                sender = owner
            else:
                recipient = owner
                amount = delta

    else:
        # If there are more than 2 accounts involved, we are making a on-chain
        # transfer and one of the accounts is the fee account owned by the
        # TOKEN_OWNER.
        for owner, delta in balance_deltas_map.items():
            print(owner, delta)
            if delta < 0:
                # Sender of money is the one whose amount decreases as a result
                # of the transaction i.e. has a negative delta.
                sender = owner
            elif owner != str(TOKEN_OWNER):
                # If the owner is not the owner of the fee account,
                # then he must be the recipient of the transaction as he has
                # a positive delta.
                recipient = owner
                amount = delta

    return {
        "sender": sender,
        "recipient": recipient,
        "amount": amount,
    }

def get_transaction_details(transaction_signature: Signature) -> GetTransactionResp:
    try:

        return SOLANA_CLIENT.get_transaction(transaction_signature)

    except Exception:
        raise BlockchainQueryFailedException


def get_raw_transactions_for_account(
    public_key: PublicKey, number_of_transactions: int
) -> GetSignaturesForAddressResp:
    try:

        return SOLANA_CLIENT.get_signatures_for_address(
            public_key, limit=number_of_transactions
        )

    except Exception:
        raise BlockchainQueryFailedException
