# Solana dependencies
from solana.rpc.commitment import Confirmed
from solana.rpc.types import TxOpts
from solana.keypair import Keypair
from solana.publickey import PublicKey
from solana.transaction import Transaction

from time import sleep

from solders.rpc.responses import (
    GetTransactionResp,
)

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
from solana_backend.exceptions import (
    BlockchainQueryFailedException,
    TokenAccountAlreadyExists,
    TransactionCreationFailedException,
    TransactionTimeoutException,
)

from solana_backend.transaction import (
    construct_stablecoin_transfer,
    transaction_to_bytes,
)

from solana_backend.query import (
    get_processed_transactions_for_account,
    get_token_balance,
    get_transaction_details,
    has_token_account,
    get_sol_balance,
)

from solana_backend.response import (
    Response,
    Success,
    Failure,
    TransactionFailure,
    TransactionSuccess,
)

ISSUE_RESPONSE_TIMEOUT = 30


def request_create_token_account(public_key: str) -> Response:
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
        return TransactionFailure(TokenAccountAlreadyExists(public_key))

    owner_key = PublicKey(public_key)
    transaction = Transaction()
    transaction.add(
        create_associated_token_account(
            # Token_owner is paying for the creation of the new Stablecoin account.
            # It is done to ensure that a user can create an account even if they
            # don't have any sol at the moment.
            payer=TOKEN_OWNER,
            # User is the new owner of the new Stablecoin account.
            owner=owner_key,
            # Mint account is the one which defines our Stablecoin token.
            mint=MINT_ACCOUNT,
        )
    )

    return TransactionSuccess(transaction_to_bytes(transaction))


### Issue ###
def issue_stablecoins(recipient_public_key: str, amount: int) -> Response:
    """Constructs a transaction to issue stablecoins and sends it directly
    to the blockchain.

    Args:
        recipient_public_key: string identifying the wallet address of the
        recipient
        amount: number of stablecoins to be issues.
    """

    key = PublicKey(recipient_public_key)

    try:
        transaction = construct_stablecoin_transfer(TOKEN_OWNER, amount, key)
    except TransactionCreationFailedException as exception:
        print(exception)
        return TransactionFailure(exception)

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

    signature = resp.value

    print("Transaction finished with response: {}".format(resp))
    count = 0
    while (
        get_transaction_details(signature) == GetTransactionResp(None)
        and count < ISSUE_RESPONSE_TIMEOUT
    ):
        count += 1
        sleep(1)

    # Fail f the transaction is still not on the blockchain after over 30 seconds
    if get_transaction_details(resp.value) == GetTransactionResp(None):
        return TransactionFailure(TransactionTimeoutException())

    return Success("transaction_signature", str(signature))

### Trade ###
def new_stablecoin_transfer(sender: str, amount: float, recipient: str) -> Response:
    sender_key = PublicKey(sender)
    recipient_key = PublicKey(recipient)

    try:
        transaction = construct_stablecoin_transfer(sender_key, amount, recipient_key)
    except TransactionCreationFailedException as exception:
        print(exception)
        return TransactionFailure(exception)

    return TransactionSuccess(transaction_to_bytes(transaction))


### Redeem ###
def burn_stablecoins(public_key: str, amount: float) -> Response:
    key = PublicKey(public_key)

    try:
        transaction = construct_stablecoin_transfer(key, amount, TOKEN_OWNER)
    except TransactionCreationFailedException as exception:
        print(exception)
        return TransactionFailure(exception)

    return TransactionSuccess(transaction_to_bytes(transaction))


### Query the Blockchain ###


def get_total_tokens_issued() -> Response:
    try:

        return Success("amount", TOTAL_SUPPLY - get_token_balance(TOKEN_OWNER))

    except BlockchainQueryFailedException as exception:
        return Failure("exception", exception)


def get_user_balance(public_key: str) -> Response:
    try:

        return Success("account_balance", get_token_balance(PublicKey(public_key)))

    except BlockchainQueryFailedException as exception:
        return Failure("exception", exception)


# Takes in a public key, and returns a list of tuples (source, target, amount)
# The amounts can be negative or positive, and the source is always the public key
def get_stablecoin_transactions(public_key: str, limit: int):
    try:

        return Success(
            "transaction_history",
            get_processed_transactions_for_account(PublicKey(public_key), limit),
        )

    except BlockchainQueryFailedException as exception:
        return Failure("exception", exception)
