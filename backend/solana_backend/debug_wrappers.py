import json

from solana.publickey import PublicKey
from solana.rpc.types import TokenAccountOpts
from solana.keypair import Keypair
from solana.transaction import Transaction
from solana.rpc.types import TxOpts
from solana.rpc.commitment import Confirmed

from spl.token.instructions import create_associated_token_account

from api import fund_account, get_balance, issue_stablecoins, get_associated_token_account, construct_stablecoin_transaction
from api import SOLANA_CLIENT, MINT_ACCOUNT

def fund_user(username, amount):
    ''' Fund the user acount with the requested number of SOL.

    Args:
        username: A string representing the name of the user.
        amount: An integer number of SOL to be transferred to the account
    '''
    try:
        wallet = load_wallet(username)

        if wallet is None:
            print("Wallet for user: {} not found".format(username))
            return

        public_key = PublicKey(wallet['public_key'])

        fund_account(public_key, amount)

    except Exception as e:
        print('error:',e)
        print('Failed to fund account')

def load_wallet(sender_username):
    ''' Loads the user wallet stored in the file system.

    It is only used inside debugging functions. All of the other functions which
    are invoked by the backend accept public keys as arguments and don't check
    any files in the file system.

    '''
    try:
        file_name = '{}.txt'.format(sender_username)
        with open(file_name) as json_file:
            account = json.load(json_file)
            account['secret_key'] = account['secret_key'].encode("latin-1")
            return account

    except Exception as e:
        print(e)

def get_user_balance(username):
    ''' Given the username returns the balance of the TOKEN account owned
        by the specified user.
    '''
    try:
        wallet = load_wallet(username)

        if wallet is None:
            print("Wallet for user: {} not found".format(username))
            return

        key_str = wallet['public_key']

        balance = str(get_balance(PublicKey(key_str))),
        print("Your Solana account {} balance is {} SOL".format(key_str, balance))
        return balance

    except Exception as e:
        print('error:', e)

def new_token_account_for(username):
    ''' Create a new token account for an existing user.

    It is important that the user already exists.
    That is because the creation of a token account for our Stablecoin token
    works by adding a new token account to an existing Solana wallet. That
    token account is then able to send and receive Stablecoint tokens.

    '''
    try:
        print("Creating a new token account for user: {}".format(username))

        user_wallet = load_wallet(username)
        if user_wallet is None:
            print("Wallet for user: {} not found".format(username))
            return

        public_key = PublicKey(user_wallet['public_key'])
        transaction = Transaction()
        transaction.add(
            create_associated_token_account(
                # User is paying for the creation of their Stablecoin account.
                payer=public_key,
                # User is the new owner of the new Stablecoin account.
                owner=public_key,
                # Mint account is the one which defines our Stablecoin token.
                mint=MINT_ACCOUNT
            )
        )

        # In order to create the account we need to pay for the transaction so
        # we request an airdrop into the user account to get required SOL.
        # In production environment we should remove it as the user should be
        # responsible for ensuring that he/she has enough SOL to pay for the
        # transaction fees.
        SOLANA_CLIENT.request_airdrop(public_key, 1)

        # This code is unsave and should only be used for debugging.
        signers = Keypair.from_secret_key(user_wallet['secret_key'])

        print("Sending transaction...")
        resp = SOLANA_CLIENT.send_transaction(transaction, signers)

        print("Transaction finished with response: {}".format(resp))
        print("The id of the transaction is: {}".format(str(resp.value)))

    except Exception as e:
        print(e)

def issue_stablecoins_to(username, amount):
    ''' Issue stablecoins to a given user, assuming they have provided
        the equivalent collateral into the reserve account.

        This function is a wrapper for issue_stablecoins and should be used
        for development and debugging. The acutal backend should send a request
        to issue new stablecoins using the public key of the recipient account.
    '''
    user_wallet = load_wallet(username)
    if user_wallet is None:
        print("Wallet for user: {} not found".format(username))
        return

    user_public_key = user_wallet['public_key']

    issue_stablecoins(user_public_key, amount)

def transfer_stablecoins(sender, amount, recipient):
    ''' It is a wrapper for the construct_stablecoin_transaction and
        should only be used for debugging.

    Args:
        sender: String representing the username of the transaction sender.
        amount: The amount of stablecoins to transfer
        recipient: String representing the username of the transaction recipient.
    '''
    sender_wallet = load_wallet(sender)
    recipient_wallet = load_wallet(recipient)

    assert(sender_wallet is not None)
    assert(recipient_wallet is not None)

    sender_public_key = PublicKey(sender_wallet['public_key'])
    recipient_public_key = PublicKey(recipient_wallet['public_key'])

    transaction = construct_stablecoin_transaction(
            sender_public_key,
            amount,
            recipient_public_key)

    owner = Keypair.from_secret_key(sender_wallet['secret_key'])

    resp = SOLANA_CLIENT.send_transaction(
        transaction,
        owner,
        opts=TxOpts(skip_confirmation=False, preflight_commitment=Confirmed))

    print("Transaction finished with response: {}".format(resp))

def inspect_token_accounts_for(username):
    ''' Executes a query to the Solana network to find all Stablecoin token
        accounts which are associated with the account of the user
    '''
    try:
        wallet = load_wallet(username)

        if wallet is None:
            print("Wallet for user: {} not found".format(username))
            return

        public_key = PublicKey(wallet['public_key'])
        print(SOLANA_CLIENT.get_token_accounts_by_owner(public_key, TokenAccountOpts(mint=MINT_ACCOUNT)))

    except Exception as e:
        print(e)

def get_token_account_for(username):
    ''' Return the account able to send/receive stablecoin tokens owned by
        the specified user.

    This function is a wrapper for get_token_account_owned_by and should
    only be used for debugging. The actual backend should make a request
    by specifying the wallet address (PublicKey) of the account that owns
    the associated token account.

    '''
    try:
        wallet = load_wallet(username)

        if wallet is None:
            print("Wallet for user: {} not found".format(username))
            return

        public_key = PublicKey(wallet['public_key'])
        return get_associated_token_account(public_key)

    except Exception as e:
        print(e)


### The functions below should only be used for creation of debug accounts.
def create(username):
    ''' Create a new solana account

    This function is used to create a new account on the solana network.
    It is only supposed to use for development. In the final product we'll
    not create new solana accounts for the users. We'll only append new token
    accounts to already existing wallets.

    '''

    print("Creating a new solana account for user {}".format(username))
    try:
        public_key = create_account(username)

        if public_key is None:
            print("Failed to create account.")
            return

        print("Solana Account created successfully.")
        print("Your account public key is {}".format(public_key))

    except Exception as e:
        print('error:',e)
        print('Failed to create account')
        return

def create_account(username):
    ''' Create an actual solana account

    This function creates a solana account by calling Keypair.generate(),
    it initialises an empty account on the network and returns the Keypair
    object associated with that account. That newly created account can
    then be funded with SOL by using the fund function.

    '''

    kp = Keypair.generate()

    register_user_credentials(username, kp.public_key, kp.secret_key)

    return kp.public_key

def register_user_credentials(username, public_key, secret_key):
    ''' Save user credentials by writing them to a text file (UNSAFE)

    This function creates a text file in json format containing the username
    and public, secret keys associated with that account. The file is then
    stored in the filesystem. It should only be used to create mock accounts
    for debugging. The actual implemenation of the backend should always
    invoke functions that require public keys of already existing accounts.

    '''

    # the public and private keys have different formats and hence we need to
    # convert the public one into a string
    data = {
        'public_key': str(public_key),
        'secret_key': secret_key.decode("latin-1"),
    }

    file_name = '{}.txt'.format(username)
    with open(file_name, 'w') as outfile:
        json.dump(data, outfile)

