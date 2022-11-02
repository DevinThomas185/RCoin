from time import sleep

# Solana dependencies
from solana.rpc.commitment import Confirmed
from solana.rpc.types import TxOpts
from solana.keypair import Keypair
from solana.publickey import PublicKey
from solana.transaction import Transaction

from solders.rpc.responses import GetTokenSupplyResp, GetTransactionResp
from solders.signature import Signature
from solders.transaction_status import EncodedTransactionWithStatusMeta

# Spl-token dependencies
from spl.token.instructions import create_associated_token_account

from spl.token.instructions import (
    create_associated_token_account,
)

# Module dependencies
from solana_backend.common import (
    SOLANA_CLIENT,
    MINT_ACCOUNT,
    TOKEN_DECIMALS,
    TOKEN_OWNER,
    TOTAL_SUPPLY,
    SECRET_KEY,
)

from solana_backend.exceptions import (
    BlockchainQueryFailedException,
    InvalidGetTransactionRespException,
    InvalidUserInputException,
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
    CreateTransactionFailure,
    CreateTransactionSuccess,
)

BLOCKCHAIN_RESPONSE_TIMEOUT = 30


def send_transaction_from_bytes(txn: bytes):
    resp = SOLANA_CLIENT.send_raw_transaction(txn)
    return Success("response", resp)


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
        return CreateTransactionFailure(TokenAccountAlreadyExists(public_key))

    owner_key = PublicKey(public_key)
    transaction = Transaction()
    transaction.add(
        create_associated_token_account(
            # Token_owner is paying for the creation of the new Stablecoin account.
            # It is done to ensure that a user can create an account even if they
            # don't have any sol at the moment.
            # payer=TOKEN_OWNER,
            payer=owner_key,
            # User is the new owner of the new Stablecoin account.
            owner=owner_key,
            # Mint account is the one which defines our Stablecoin token.
            mint=MINT_ACCOUNT,
        )
    )

    return CreateTransactionSuccess(transaction_to_bytes(transaction))


### Issue ###
def issue_stablecoins(recipient_public_key: str, amount: float) -> Response:
    """Constructs a transaction to issue stablecoins and sends it directly
    to the blockchain.

    Args:
        recipient_public_key: string identifying the wallet address of the
        recipient
        amount: number of stablecoins to be issues.
    """
    key = PublicKey(recipient_public_key)

    if amount < 0:
        return CreateTransactionFailure(
            InvalidUserInputException("The amount to issue has to be positive.")
        )

    try:
        transaction = construct_stablecoin_transfer(TOKEN_OWNER, amount, key)
    except TransactionCreationFailedException as exception:
        print(exception)
        return CreateTransactionFailure(exception)

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

    print(
        "Transaction submitted to the blockchain with signature: {}".format(signature)
    )

    print("Waiting for it to appear on the blockchain...")
    count = 0
    while (
        get_transaction_details(signature) == GetTransactionResp(None)
        and count < BLOCKCHAIN_RESPONSE_TIMEOUT
    ):
        count += 1
        sleep(1)

    # Fail f the transaction is still not on the blockchain after over 30 seconds
    if get_transaction_details(resp.value) == GetTransactionResp(None):
        return CreateTransactionFailure(TransactionTimeoutException())

    return Success("transaction_signature", str(signature))


### Trade ###
def new_stablecoin_transfer(sender: str, amount: float, recipient: str) -> Response:
    sender_key = PublicKey(sender)

    try:
        recipient_key = PublicKey(recipient)
    except ValueError as exception:
        return CreateTransactionFailure(
            InvalidUserInputException("Invalid receiver public key")
        )

    if amount < 0:
        return CreateTransactionFailure(
            InvalidUserInputException("The amount to send has to be positive.")
        )

    try:
        transaction = construct_stablecoin_transfer(sender_key, amount, recipient_key)
    except TransactionCreationFailedException as exception:
        print(exception)
        return CreateTransactionFailure(exception)

    return CreateTransactionSuccess(transaction_to_bytes(transaction))


### Redeem ###
def burn_stablecoins(public_key: str, amount: float) -> Response:
    key = PublicKey(public_key)

    if amount < 0:
        return CreateTransactionFailure(
            InvalidUserInputException("The amount to redeem has to be positive.")
        )

    try:
        transaction = construct_stablecoin_transfer(key, amount, TOKEN_OWNER)
    except TransactionCreationFailedException as exception:
        print(exception)
        return CreateTransactionFailure(exception)

    return CreateTransactionSuccess(transaction_to_bytes(transaction))


### Query the Blockchain ###


def get_total_tokens_issued() -> Response:
    try:

        return Success("amount", TOTAL_SUPPLY - get_token_balance(TOKEN_OWNER))

    except BlockchainQueryFailedException as exception:
        return Failure("exception", exception)


def get_user_token_balance(public_key: str) -> Response:
    try:

        return Success("account_balance", get_token_balance(PublicKey(public_key)))

    except BlockchainQueryFailedException as exception:
        return Failure("exception", exception)


def get_user_sol_balance(public_key: str) -> Response:
    try:

        return Success("account_balance", get_sol_balance(PublicKey(public_key)))

    except BlockchainQueryFailedException as exception:
        return Failure("exception", exception)


def get_stablecoin_transactions(public_key: str, limit: int) -> Response:
    try:

        return Success(
            "transaction_history",
            get_processed_transactions_for_account(PublicKey(public_key), limit),
        )

    except BlockchainQueryFailedException as exception:
        return Failure("exception", exception)


def get_transfer_amount_for_transaction(signature: str) -> Response:
    resp = GetTransactionResp(None)
    counter = 0
    try:

        while (
            resp == GetTransactionResp(None) and counter < BLOCKCHAIN_RESPONSE_TIMEOUT
        ):
            resp = get_transaction_details(Signature.from_string(signature))
            counter += 1
            sleep(1)

    except BlockchainQueryFailedException as exception:
        return Failure("exception", exception)

    if resp == GetTransactionResp(None):
        return Failure("exception", TransactionTimeoutException())

    if resp.value is None:
        return Failure("exception", InvalidGetTransactionRespException())

    confirmed_transaction: EncodedTransactionWithStatusMeta = resp.value.transaction

    if confirmed_transaction.meta is None:
        return Failure("exception", InvalidGetTransactionRespException())

    pre_token_balances = confirmed_transaction.meta.pre_token_balances
    post_token_balances = confirmed_transaction.meta.post_token_balances

    if (
        pre_token_balances is None
        or post_token_balances is None
        or len(post_token_balances) != 2
    ):
        return Failure("exception", InvalidGetTransactionRespException())

    if (
        pre_token_balances[0].account_index == post_token_balances[0].account_index
        and len(pre_token_balances) == 2
    ):
        # Both sender's and recipient's token accounts existed before
        # the transaction (usual scenario)
        amount = int(pre_token_balances[0].ui_token_amount.amount) - int(
            post_token_balances[0].ui_token_amount.amount
        )
    else:
        # Edge case when the recipient didn't have a token account before
        # transaction and it was created on request.
        amount = int(pre_token_balances[0].ui_token_amount.amount) - int(
            post_token_balances[1].ui_token_amount.amount
        )

    return Success("amount", amount / 10**TOKEN_DECIMALS)
