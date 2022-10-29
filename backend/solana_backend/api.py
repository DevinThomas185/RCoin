# Standard imports
import os
from requests import post

# Solana dependencies
from solana.rpc.commitment import Confirmed
from solana.rpc.types import TokenAccountOpts, TxOpts
from solana.keypair import Keypair
from solana.publickey import PublicKey
from solana.transaction import Transaction

from solders.signature import Signature

from solders.rpc.responses import GetTransactionResp, GetSignaturesForAddressResp

from solders.transaction_status import (
    EncodedTransactionWithStatusMeta,
)

# Spl-token dependencies
from spl.token.instructions import (
    create_associated_token_account,
)

from solana_backend.common import (
    SOLANA_CLIENT,
    MINT_ACCOUNT,
    TOKEN_DECIMALS,
    TOKEN_OWNER,
    TOTAL_SUPPLY,
    SECRET_KEY,
    LAMPORTS_PER_SOL,
)

from solana_backend.transaction import (
    construct_stablecoin_transfer,
    transaction_to_bytes,
)


def request_create_token_account(public_key):
    """Request creation of a new token account for a Solana account with the
       address equal to public_key.

    This function should be used by the backend to get the transaction bytes,
    which can then be sent to phantom for signing and received back at the
    backend and sent to the blockchain.

    Args:
        public_key: The public key of the account that will be the owner
        of the new token account.

    Returns:
        byte array which can then be reconstructed into a solders transaction
        on the frontend side and sent to phantom.

    """
    if has_token_account(public_key):
        ## failure, TODO: handle appropriately.
        return []

    public_key = PublicKey(public_key)
    transaction = Transaction()
    transaction.add(
        create_associated_token_account(
            # User is paying for the creation of their Stablecoin account.
            payer=public_key,
            # User is the new owner of the new Stablecoin account.
            owner=public_key,
            # Mint account is the one which defines our Stablecoin token.
            mint=MINT_ACCOUNT,
        )
    )

    return transaction_to_bytes(transaction)


def burn_stablecoins(pubkey_str, amount):
    transaction = construct_stablecoin_transfer(pubkey_str, amount, str(TOKEN_OWNER))
    return transaction_to_bytes(transaction)


def new_stablecoin_transaction(sender, amount, recipient):
    transaction = construct_stablecoin_transfer(sender, amount, recipient)
    return transaction_to_bytes(transaction)


def issue_stablecoins(recipient_public_key, amount):
    """Constructs a transaction to issue stablecoins and sends it directly
    to the blockchain.

    Args:
        recipient_public_key: string identifying the wallet address of the
        recipient
        amount: number of stablecoins to be issues.
    """

    transaction = construct_stablecoin_transfer(
        str(TOKEN_OWNER), amount, recipient_public_key
    )

    owner = Keypair.from_secret_key(SECRET_KEY)

    print(
        "Sending request to issue stablecoins for account: {}".format(
            recipient_public_key
        )
    )

    resp = SOLANA_CLIENT.send_transaction(
        transaction,
        owner,
        opts=TxOpts(skip_confirmation=False, preflight_commitment=Confirmed),
    )

    print("Transaction finished with response: {}".format(resp))
    ## TODO[szymon] add check for transaction success.
    if resp.value.__str__() is not None:
        return {"success": True}


def get_balance(public_key):
    return SOLANA_CLIENT.get_balance(public_key).value


def get_sol_balance(pubkey_str):
    return get_balance(PublicKey(pubkey_str)) / LAMPORTS_PER_SOL


def has_token_account(public_key) -> bool:
    resp = SOLANA_CLIENT.get_token_accounts_by_owner(
        public_key, TokenAccountOpts(mint=MINT_ACCOUNT)
    )

    return resp.value != []


def get_token_balance(pubkey: str) -> float:
    solana_client = os.getenv("SOLANA_CLIENT")
    token_program_id = "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"
    assert solana_client is not None
    payload = {
        "jsonrpc": "2.0",
        "id": 1,
        "method": "getTokenAccountsByOwner",
        "params": [
            f"{pubkey}",
            {"programId": f"{token_program_id}"},
            {"encoding": "jsonParsed"},
        ],
    }
    r = post(solana_client, json=payload)
    j = r.json()
    return float(
        j["result"]["value"][0]["account"]["data"]["parsed"]["info"]["tokenAmount"][
            "amount"
        ]
    ) / (10**TOKEN_DECIMALS)


def get_total_tokens_issued() -> float:
    token_owner_key = os.getenv("TOKEN_OWNER")
    assert token_owner_key is not None
    return TOTAL_SUPPLY - get_token_balance(token_owner_key)


def get_transaction_details(transaction_signature: Signature) -> GetTransactionResp:
    return SOLANA_CLIENT.get_transaction(transaction_signature)


def get_raw_transactions_for_account(
    pubkey: str, number_of_transactions: int
) -> GetSignaturesForAddressResp:

    return SOLANA_CLIENT.get_signatures_for_address(
        PublicKey(pubkey), limit=number_of_transactions
    )


# Takes in a public key, and returns a list of tuples (source, target, amount)
# The amounts can be negative or positive, and the source is always the public key
def get_processed_transactions_for_account(pubkey: str, limit: int):
    resp = get_raw_transactions_for_account(pubkey, limit)

    transactions = list(
        map(lambda status: get_transaction_details(status.signature), resp.value)
    )

    transactions: list[GetTransactionResp] = [
        get_transaction_details(status.signature) for status in resp.value
    ]

    confirmed_transactions: list[EncodedTransactionWithStatusMeta] = [
        transaction.value.transaction
        for transaction in transactions
        if transaction.value
    ]

    processed_transactions = []
    for confirmed_transaction in confirmed_transactions:
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

        processed_transactions.append((sender, recipient, amount))

    return processed_transactions
