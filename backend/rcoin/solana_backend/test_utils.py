import os
import json
from time import sleep

from solana.rpc.commitment import Confirmed
from solana.rpc.types import TokenAccountOpts, TxOpts
from solana.transaction import Transaction
from solders.transaction import Transaction as SoldersTransaction
from solana.publickey import PublicKey
from solana.keypair import Keypair

from rcoin.solana_backend.api import construct_token_transfer_transaction
from rcoin.solana_backend import api
from rcoin.solana_backend.response import Failure, CustomResponse, Success
from rcoin.solana_backend.transaction import get_associated_token_account

TEST_USERS_FILE = "rcoin/solana_backend/users.txt"
TEST_USERS_NUMBER = 10

from rcoin.solana_backend.common import (
    SOLANA_CLIENT,
    MINT_ACCOUNT,
)


class Wallet:
    def __init__(self, public_key, secret_key):
        self.public_key: str = public_key
        self.secret_key: bytes = secret_key

    @staticmethod
    def from_json(json_wallet):
        return Wallet(
            json_wallet["public_key"], json_wallet["secret_key"].encode("latin-1")
        )

    def get_public_key(self):
        return PublicKey(self.public_key)

    def get_secret_key(self):
        return Keypair.from_secret_key(self.secret_key)


def create_account(username):
    """Create a test solana account (on the actual blockchain)

    This function creates a solana account by calling Keypair.generate(),
    it initialises an empty account on the network and returns the Keypair
    object associated with that account. That newly created account can
    then be funded with SOL by using the fund function.

    """

    kp = Keypair.generate()

    save_user_credentials(username, kp.public_key, kp.secret_key)

    return kp.public_key


def save_user_credentials(username, public_key, secret_key):
    """Save user credentials by writing them to a text file (UNSAFE)

    This funciton saves user name and a public/secret keys associated with the
    user. It should be used by the testsuite to create new test user accounts.

    """

    if os.path.exists(TEST_USERS_FILE):
        with open(TEST_USERS_FILE, "r") as users_file:
            users = json.loads(users_file.read())
    else:
        users = {}

    # the public and private keys have different formats and hence we need to
    # convert the public one into a string
    data = {
        "public_key": str(public_key),
        "secret_key": secret_key.decode("latin-1"),
    }

    users[username] = data

    with open(TEST_USERS_FILE, "wt") as outfile:
        json.dump(users, outfile, indent=2)


def fund_user(username, amount):
    """Fund the user acount with the requested number of SOL.

    Args:
        username: A string representing the name of the user.
        amount: An integer number of SOL to be transferred to the account
    """
    wallet = load_wallet(username)

    if wallet is None:
        print("Wallet for user: {} not found".format(username))
        return

    resp = fund_account(wallet.public_key, amount)

    assert resp is not None

    if isinstance(resp, Failure):
        print("Failed to fund user account: {}".format(resp.to_json()["exception"]))


def fund_account(public_key, amount):
    public_key = PublicKey(public_key)
    try:
        if amount > 2:
            print("The maximum amount allowed is 2 SOL")
            return

        print("Requesting {} SOL to the Solana account: {}".format(amount, public_key))

        resp = SOLANA_CLIENT.request_airdrop(public_key, amount)
        print(resp)
        transaction_id = str(resp.value)

        if transaction_id is None:
            print("Failed to fund your Solana account")
            return

        print(resp)

        print("The transaction: {} was executed.".format(transaction_id))
        print("You requested funding your account with {} SOL.".format(amount))
        return Success("message", "Transaction successfully created")

    except Exception as e:
        print(e)
        return Failure(e)


def load_wallet(sender_username):
    """Loads the test user wallet stored in the file system."""

    with open(TEST_USERS_FILE) as users_file:
        users = json.load(users_file)
        return Wallet.from_json(users[sender_username])


def provision_test_users():
    """Creates and funds TEST_USERS_NUMBER test user accounts."""

    for i in range(TEST_USERS_NUMBER):
        user = "test_user_{}".format(i)
        create_account(user)
        fund_user(user, 1)
        # Waits a minute so that the airdrop doesn't reject requests.
        sleep(60)


def get_user_balance(username):
    """Given the username returns the balance of the TOKEN account owned
    by the specified user.
    """
    try:
        wallet = load_wallet(username)

        if wallet is None:
            print("Wallet for user: {} not found".format(username))
            return

        key_str = wallet.public_key

        balance = str(SOLANA_CLIENT.get_balance(PublicKey(key_str)))
        print("Your Solana account {} balance is {} SOL".format(key_str, balance))
        return balance

    except Exception as e:
        print("error:", e)


def unwrap_transaction_from_response(response: CustomResponse) -> Transaction:
    assert isinstance(response, Success)
    transaction_bytes = response.contents
    return Transaction.from_solders(
        SoldersTransaction.from_bytes(bytes(transaction_bytes))
    )


def issue_stablecoins_to(username, amount):
    """Issue stablecoins to a given user, assuming they have provided
    the equivalent collateral into the reserve account.

    This function is a wrapper for issue_stablecoins and should be used
    for development and debugging. The acutal backend should send a request
    to issue new stablecoins using the public key of the recipient account.
    """
    user_wallet = load_wallet(username)
    if user_wallet is None:
        print("Wallet for user: {} not found".format(username))
        return

    api.construct_issue_transaction(str(user_wallet.public_key), amount)


def transfer_stablecoins(sender, amount, recipient):
    """It is a wrapper for the construct_stablecoin_transaction and
        should only be used for debugging.

    Args:
        sender: String representing the username of the transaction sender.
        amount: The amount of stablecoins to transfer
        recipient: String representing the username of the transaction recipient.
    """
    sender_wallet = load_wallet(sender)
    recipient_wallet = load_wallet(recipient)

    resp = construct_token_transfer_transaction(
        sender_wallet.public_key, amount, recipient_wallet.public_key
    )

    transaction = unwrap_transaction_from_response(resp)

    owner = Keypair.from_secret_key(sender_wallet.secret_key)
    # TODO: fix this by replacing with proper multisig.
    # token_owner = Keypair.from_secret_key(SECRET_KEY)
    token_owner = None

    resp = SOLANA_CLIENT.send_transaction(
        transaction,
        token_owner,
        owner,
        opts=TxOpts(skip_confirmation=False, preflight_commitment=Confirmed),
    )

    print("Transaction finished with response: {}".format(resp))


def inspect_token_accounts_for(username):
    """Executes a query to the Solana network to find all Stablecoin token
    accounts which are associated with the account of the user
    """
    try:
        wallet = load_wallet(username)

        if wallet is None:
            print("Wallet for user: {} not found".format(username))
            return

        public_key = PublicKey(wallet.public_key)
        print(
            SOLANA_CLIENT.get_token_accounts_by_owner(
                public_key, TokenAccountOpts(mint=MINT_ACCOUNT)
            )
        )

    except Exception as e:
        print(e)


def get_token_account_for(username):
    """Return the account able to send/receive stablecoin tokens owned by
        the specified user.

    This function is a wrapper for get_token_account_owned_by and should
    only be used for debugging. The actual backend should make a request
    by specifying the wallet address (PublicKey) of the account that owns
    the associated token account.

    """
    try:
        wallet = load_wallet(username)

        if wallet is None:
            print("Wallet for user: {} not found".format(username))
            return

        public_key = PublicKey(wallet.public_key)
        return get_associated_token_account(public_key)

    except Exception as e:
        print(e)
