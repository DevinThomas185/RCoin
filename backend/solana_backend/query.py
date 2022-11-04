import os
from requests import post

from solana.publickey import PublicKey
from solana.rpc.types import TokenAccountOpts

from solders.signature import Signature
from solders.rpc.responses import (
    GetTransactionResp,
    GetSignaturesForAddressResp,
    RpcKeyedAccount,
)
from solders.transaction_status import (
    EncodedTransactionWithStatusMeta,
)

from spl.token.constants import TOKEN_PROGRAM_ID

from solana_backend.common import (
    SOLANA_CLIENT,
    LAMPORTS_PER_SOL,
    MINT_ACCOUNT,
    TOKEN_DECIMALS,
)

from solana_backend.exceptions import BlockchainQueryFailedException


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
        amount = float(j["result"]["value"][0]["account"]["data"]["parsed"]["info"]["tokenAmount"][
                "amount"
            ]) / (10**TOKEN_DECIMALS)

    except Exception:
        raise BlockchainQueryFailedException

    return amount

def get_processed_transactions_for_account(public_key: PublicKey, limit: int):
    resp = get_raw_transactions_for_account(public_key, limit)

    transactions: list[GetTransactionResp] = [
        (str(status.signature), get_transaction_details(status.signature)) for status in resp.value
    ]

    confirmed_transactions: list[EncodedTransactionWithStatusMeta] = [
        (signature, transaction.value.transaction)
        for signature, transaction in transactions
        if transaction.value
    ]

    processed_transactions = []
    for signature, confirmed_transaction in confirmed_transactions:
        # Skip the transaction if it doesn't have the metadata for some reason.
        if confirmed_transaction.meta is None:
            continue

        pre_token_balances = confirmed_transaction.meta.pre_token_balances
        post_token_balances = confirmed_transaction.meta.post_token_balances

        if pre_token_balances is None or post_token_balances is None:
            continue

        # We are looking for transactions involving the transfer of tokens,
        # hence we expect that there are precisely 2 accounts involved
        # in the transaction and hence we expect that the list indicating
        # the balances of the accounts involved after the transaction has the
        # length of 2. We don't consider the list of pre_token_balances,
        # because there is an edge case when we send to an account which doesn't
        # have an associated token account and then the token account is created
        # but not included in pre_token_balances as it doesn't exist at that
        # point.
        if len(post_token_balances) != 2:
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

        if (
            pre_token_balances[0].account_index == post_token_balances[0].account_index
            and len(pre_token_balances) == 2
        ):
            # Both sender's and recipient's token accounts existed before
            # the transaction (usual scenario)
            sender = str(post_token_balances[0].owner)
            recipient = str(post_token_balances[1].owner)
            amount = int(pre_token_balances[0].ui_token_amount.amount) - int(
                post_token_balances[0].ui_token_amount.amount
            )
        else:
            # Edge case when the recipient didn't have a token account before
            # transaction and it was created on request.
            sender = str(pre_token_balances[0].owner)
            recipient = str(post_token_balances[0].owner)
            amount = int(pre_token_balances[0].ui_token_amount.amount) - int(
                post_token_balances[1].ui_token_amount.amount
            )

        # processed_transactions.append((signature, sender, recipient, amount))
        processed_transactions.append({
            "signature": signature,
            "sender": sender,
            "recipient": recipient,
            "amount": amount
        })

    return processed_transactions


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
