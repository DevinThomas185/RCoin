from solana.keypair import Keypair
from solana.transaction import Transaction

from rcoin.solana_backend import api
from rcoin.solana_backend.common import MULTISIG_ACCOUNT, SIGNER_1, SIGNER_2
from rcoin.solana_backend.response import CustomResponse, Success
from rcoin.solana_backend.test_utils import load_wallet


def test_create_token_account(username):
    """Create a new token account for an existing test user.

    It is important that the user already exists.
    That is because the creation of a token account for our Stablecoin token
    works by adding a new token account to an existing Solana wallet. That
    token account is then able to send and receive Stablecoint tokens.

    """

    wallet = load_wallet(username)

    resp: CustomResponse = api.construct_create_account_transaction(wallet.public_key)

    assert isinstance(resp, Success)

    transaction: Transaction = resp.unwrap()

    # We only require the first signer to sign as creation of token accounts
    # only costs us the small solana fee and so the risk of attack here is low.
    api.sign_transaction(transaction, SIGNER_1)

    result: CustomResponse = api.send_and_confirm_transaction(transaction)

    assert isinstance(result, Success)


def test_issue_tokens(username: str, amount: int):
    """Test issuing stablecoins to a given user, assuming they have provided
    the equivalent collateral into the reserve account.

    This function is a wrapper for issue_stablecoins and should be used
    for development and debugging. The acutal backend should send a request
    to issue new stablecoins using the public key of the recipient account.

    It simulates all stages of the workflow that should happen on our two
    servers i.e. :
        - creates the transaction object
        - signs it using the first multisig key (impersonating the first backend)
        - signs it using the second multisig key (as if it was the 'signer' backend)
        - sends the transaction to solana using the solana backend function for that.

    """
    user_wallet = load_wallet(username)
    if user_wallet is None:
        print("Wallet for user: {} not found".format(username))
        return

    response: CustomResponse = api.construct_issue_transaction(
        str(user_wallet.public_key), amount
    )

    assert isinstance(response, Success)

    transaction: Transaction = response.unwrap()

    # First step: the main backend signs.
    api.sign_transaction(transaction, SIGNER_1)

    # Simulate serialising the transaction and sending it to the other backend.
    transaction_bytes: bytes = bytes(api.transaction_to_bytes(transaction))
    transaction: Transaction = api.transaction_from_bytes(transaction_bytes)

    # Second step: the 'signer' backend signs.
    api.sign_transaction(transaction, SIGNER_2)

    # Third step: we send the transaction an wait to see it on the blockchain.
    result: CustomResponse = api.send_and_confirm_transaction(transaction)

    assert isinstance(result, Success)


def test_transfer_tokens(username1: str, amount: float, username2: str):

    user1 = load_wallet(username1)
    user2 = load_wallet(username2)

    resp: CustomResponse = api.construct_token_transfer_transaction(
        user1.public_key, amount, user2.public_key
    )

    assert isinstance(resp, Success)

    transaction: Transaction = resp.unwrap()

    finalise_trisig_transaction(transaction, user1.secret_key)

def test_withdraw_tokens(username1: str, amount: float):

    user1 = load_wallet(username1)

    resp: CustomResponse = api.construct_token_transfer_transaction(
        user1.public_key, amount, str(MULTISIG_ACCOUNT)
    )

    assert isinstance(resp, Success)

    transaction: Transaction = resp.unwrap()

    finalise_trisig_transaction(transaction, user1.secret_key)


def finalise_trisig_transaction(transaction: Transaction, secret_key: bytes):
    # Sign the transaction on the 'signer' backend to account for the fee.
    api.sign_transaction(transaction, SIGNER_1)

    # Simulate serialising the transaction and sending it to the other backend.
    transaction_bytes: bytes = bytes(api.transaction_to_bytes(transaction))
    transaction = api.transaction_from_bytes(transaction_bytes)

    api.sign_transaction(transaction, SIGNER_2)

    # Simulate serialising the transaction and sending it to the app frontend.
    transaction_bytes: bytes = bytes(api.transaction_to_bytes(transaction))
    transaction = api.transaction_from_bytes(transaction_bytes)

    api.sign_transaction(transaction, secret_key)

    result: CustomResponse = api.send_and_confirm_transaction(transaction)

    assert isinstance(result, Success)
