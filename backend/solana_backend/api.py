# Solana dependencies
from solana.rpc.commitment import Confirmed
from solana.rpc.types import TxOpts
from solana.keypair import Keypair
from solana.publickey import PublicKey
from solana.transaction import Transaction


# Spl-token dependencies
from spl.token.instructions import (
    create_associated_token_account,
)

# Module dependencies
from solana_backend.common import (
    SOLANA_CLIENT,
    MINT_ACCOUNT,
    TOKEN_OWNER,
    TOTAL_SUPPLY,
    SECRET_KEY,
)

from solana_backend.transaction import (
    construct_stablecoin_transfer,
    transaction_to_bytes,
)

from solana_backend.query import (
    get_processed_transactions_for_account,
    get_token_balance,
    has_token_account,
)


def request_create_token_account(public_key: str) -> list[bytes]:
    """Request creation of a new token account for a Solana account with the
       address equal to public_key.

    This function should be used by the backend to get the transaction bytes,
    which can then be sent to phantom for signing and received back at the
    backend and sent to the blockchain.

    Args:
        public_key: The string representing the public key of the account that
        will be the owner of the new token account.

    Returns:
        byte array which can then be reconstructed into a solders transaction
        on the frontend side and sent to phantom.

    """
    if has_token_account(PublicKey(public_key)):
        ## failure, TODO: handle appropriately.
        return []

    owner_key = PublicKey(public_key)
    transaction = Transaction()
    transaction.add(
        create_associated_token_account(
            # User is paying for the creation of their Stablecoin account.
            payer=owner_key,
            # User is the new owner of the new Stablecoin account.
            owner=owner_key,
            # Mint account is the one which defines our Stablecoin token.
            mint=MINT_ACCOUNT,
        )
    )

    return transaction_to_bytes(transaction)


### Issue ###
def issue_stablecoins(recipient_public_key: str, amount: int):
    """Constructs a transaction to issue stablecoins and sends it directly
    to the blockchain.

    Args:
        recipient_public_key: string identifying the wallet address of the
        recipient
        amount: number of stablecoins to be issues.
    """

    key = PublicKey(recipient_public_key)

    transaction = construct_stablecoin_transfer(TOKEN_OWNER, amount, key)

    token_owner = Keypair.from_secret_key(SECRET_KEY)

    print(
        "Sending request to issue stablecoins for account: {}".format(
            recipient_public_key
        )
    )

    resp = SOLANA_CLIENT.send_transaction(
        transaction,
        token_owner,
        opts=TxOpts(skip_confirmation=False, preflight_commitment=Confirmed),
    )

    print("Transaction finished with response: {}".format(resp))
    ## TODO[szymon] add check for transaction success.
    if resp.value.__str__() is not None:
        return {"success": True}


### Trade ###
def new_stablecoin_transfer(sender: str, amount: float, recipient: str) -> list[bytes]:
    sender_key = PublicKey(sender)
    recipient_key = PublicKey(recipient)
    transaction = construct_stablecoin_transfer(sender_key, amount, recipient_key)
    return transaction_to_bytes(transaction)


### Redeem ###
def burn_stablecoins(public_key: str, amount: float) -> list[bytes]:
    key = PublicKey(public_key)
    transaction = construct_stablecoin_transfer(key, amount, TOKEN_OWNER)
    return transaction_to_bytes(transaction)


### Query the Blockchain ###


def get_total_tokens_issued() -> float:
    return TOTAL_SUPPLY - get_token_balance(TOKEN_OWNER)


def get_user_balance(public_key: str) -> float:
    return get_token_balance(PublicKey(public_key))


# Takes in a public key, and returns a list of tuples (source, target, amount)
# The amounts can be negative or positive, and the source is always the public key
def get_stablecoin_transactions(public_key: str, limit: int):
    return get_processed_transactions_for_account(PublicKey(public_key), limit)
