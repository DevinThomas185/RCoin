# Standard imports
import os
from requests import post
from dotenv import load_dotenv

# Solana dependencies
from solana.rpc.commitment import Confirmed
from solana.rpc.types import TokenAccountOpts, TxOpts
from solana.keypair import Keypair
from solana.publickey import PublicKey
from solana.rpc.api import Client
from solana.transaction import Transaction

# Spl-token dependencies
from spl.token.constants import TOKEN_PROGRAM_ID
from spl.token.instructions import create_associated_token_account, transfer_checked, TransferCheckedParams

load_dotenv()

SOLANA_CLIENT = Client(str(os.getenv("SOLANA_CLIENT")))
MINT_ACCOUNT = PublicKey(str(os.getenv("MINT_ACCOUNT")))
TOKEN_OWNER = PublicKey(str(os.getenv("TOKEN_OWNER")))
RESERVE_ACCOUNT_ADDRESS = PublicKey(str(os.getenv("RESERVE_ACCOUNT_ADDRESS")))

TOTAL_SUPPLY = 1000000000

# Secret key of the account of the token owner. Used for issuing new tokens
# for users who have provided equivalent collateral.
SECRET_KEY = bytes([201, 177, 177, 188, 30, 250, 36, 198, 219, 122, 244, 184, 157, 71, 143, 105, 203, 124, 174, 14, 68, 41, 225, 32, 187, 118, 101, 31, 0, 173,
                   89, 33, 4, 54, 216, 80, 246, 76, 169, 16, 88, 205, 213, 99, 67, 163, 133, 26, 174, 194, 62, 168, 113, 163, 244, 82, 57, 118, 41, 208, 25, 202, 218, 243])

# The precision that we support in transactions involving our stablecoin token
# is up to 9 decimal places.
TOKEN_DECIMALS = 9

# A fraction of Solana coin (SOL) is called a Lamport, there are 1000000000
# Lamports in one SOL
LAMPORTS_PER_SOL = 1000000000


def fund_account(public_key, amount):
    public_key = PublicKey(public_key)
    try:
        if amount > 2:
            print("The maximum amount allowed is 2 SOL")
            return

        print("Requesting {} SOL to the Solana account: {}".format(
            amount, public_key))

        resp = SOLANA_CLIENT.request_airdrop(public_key, amount)
        transaction_id = str(resp.value)

        if transaction_id is None:
            print("Failed to fund your Solana account")
            return

        print(resp)

        print("The transaction: {} was executed.".format(transaction_id))
        print("You requested funding your account with {} SOL.".format(amount))

    except Exception as e:
        print('error:', e)


def request_create_token_account(public_key):
    ''' Request creation of a new token account for a Solana account with the
        address equal to public_key.

    This function should be used by the backend to get the transaction json.
    It is not suitable for debugging and will not work.

    Args:
        public_key: The public key of the account that will be the owner
        of the new token account.
    Returns:
        json object representing a transaction which needs to be signed by
        phantom on the frontent side.
    '''
    public_key = PublicKey(public_key)
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

    bytes = transaction.to_solders().__bytes__()
    return transaction_bytes_to_array(bytes)


def transaction_bytes_to_array(transaction_bytes):
    return list(transaction_bytes)


def burn_stablecoins(user_pubkey_str, amount):
    bytes = construct_stablecoin_transaction(
        PublicKey(user_pubkey_str),
        amount,
        TOKEN_OWNER).to_solders().__bytes__()

    return transaction_bytes_to_array(bytes)


def new_stablecoin_transaction(sender, amount, recipient):
    bytes = construct_stablecoin_transaction(
        PublicKey(sender),
        amount,
        PublicKey(recipient)).to_solders().__bytes__()

    return transaction_bytes_to_array(bytes)


def construct_stablecoin_transaction(sender, amount, recipient):
    ''' Creates a transfer transaction to move stablecoin tokens from one
        account to the other.

        Args:
            from: PublicKey of the sender
            amount: Number of stablecoins to transfer
            to: PublicKey of the recipient
    '''
    transaction = Transaction()

    source_account = get_associated_token_account(sender)
    dest_acount = get_associated_token_account(recipient)

    assert (source_account is not None)
    assert (dest_acount is not None)

    transaction.add(
        transfer_checked(
            TransferCheckedParams(
                program_id=TOKEN_PROGRAM_ID,
                source=source_account,
                mint=MINT_ACCOUNT,
                dest=dest_acount,
                owner=sender,
                amount=int(amount * (10**TOKEN_DECIMALS)),
                decimals=TOKEN_DECIMALS,
                signers=[]
            )
        )
    )
    return transaction


def issue_stablecoins(recipient_public_key, amount):
    ''' Given the public key of the TOKEN account (not the wallet address)
        issues the requested amount of stablecoins to that account.
        Prior to executing it should be ensured that the user has provided
        equivalent collateral in exchange for the coins.
    '''
    recipient_public_key = PublicKey(recipient_public_key)

    transaction = construct_stablecoin_transaction(
        sender=TOKEN_OWNER,
        amount=amount,
        recipient=recipient_public_key)

    # TODO: find a secure way to store the private key of the token account.
    owner = Keypair.from_secret_key(SECRET_KEY)

    print("Sending request to issue stablecoins for account: {}".format(
        recipient_public_key))

    resp = SOLANA_CLIENT.send_transaction(
        transaction,
        owner,
        opts=TxOpts(skip_confirmation=False, preflight_commitment=Confirmed))

    print("Transaction finished with response: {}".format(resp))
    if (resp.value.__str__() is not None):
        return {"success": True}


def get_transaction_for_phantom(sender, amount, recipient):
    ''' Constructs a transaction which can be sent to Phantom for signing and
        then sent to the network.

        Args:
            sender: A string representing the public key of the sender.
            amount: The amount of stablecoins to be transferred.
            recipient: A string representing the public key of the recipient.
    '''
    sender_key = PublicKey(sender)
    recipient_key = PublicKey(recipient)

    return construct_stablecoin_transaction(
        sender_key, amount, recipient_key).to_solders().__bytes__()


def get_associated_token_account(wallet_address):
    if wallet_address == TOKEN_OWNER:
        # When issuing coins the token account associated with the owner is the
        # reserve account.
        return RESERVE_ACCOUNT_ADDRESS

    wallet_address = PublicKey(wallet_address)
    resp = SOLANA_CLIENT.get_token_accounts_by_owner(
        wallet_address, TokenAccountOpts(mint=MINT_ACCOUNT))
    # It is possible that there is more than one Stablecoin token account
    # associated with the user's wallet, in such case we need to do something
    # about it. Right now we always pick the first account in the list.
    # TODO: prevent creation of multiple stablecoin accounts for one wallet.
    token_account = PublicKey.from_solders(resp.value[0].pubkey)

    if token_account is None:
        print("There are no token accounts associated with the wallet: {}".format(
            wallet_address))
        return

    print("Token account: {} found for wallet: {}".format(
        token_account, wallet_address))
    return token_account


def get_balance(public_key):
    return SOLANA_CLIENT.get_balance(public_key).value


def get_sol_balance(pubkey_str):
    return get_balance(PublicKey(pubkey_str)) / LAMPORTS_PER_SOL


def get_token_balance(pubkey_str):
    solana_client = os.getenv("SOLANA_CLIENT")
    token_program_id = "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"
    assert (solana_client is not None)
    payload = {
        'jsonrpc': '2.0',
        'id': 1,
        'method': 'getTokenAccountsByOwner',
        'params': [
            f'{pubkey_str}',
            {
                'programId': f'{token_program_id}'
            },
            {
                'encoding': 'jsonParsed'
            }
        ]
    }
    r = post(solana_client, json=payload)
    j = r.json()
    return float(j['result']['value'][0]['account']['data']['parsed']['info']['tokenAmount']['amount']) / (10**TOKEN_DECIMALS)


def get_total_tokens_issued():
    return TOTAL_SUPPLY - get_token_balance(os.getenv("TOKEN_OWNER"))
