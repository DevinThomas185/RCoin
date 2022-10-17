from solana.keypair import Keypair
from solana.publickey import PublicKey
from solana.rpc.api import Client
from solana.transaction import Transaction
from solana.system_program import TransferParams, transfer
from spl.token.constants import TOKEN_PROGRAM_ID

# Solana dependencies
from spl.token.instructions import create_associated_token_account, transfer_checked, TransferCheckedParams
from solana.rpc.commitment import Confirmed
from solana.rpc.types import TxOpts
from solana.keypair import Keypair

import json

solana_client = Client("https://api.devnet.solana.com")
MINT_ACCOUNT = PublicKey("pLbHR4ZMe5kY9E7EoQbNzKGqskVbP6znxvH7FES3psi")
TOKEN_OWNER      = PublicKey("BZjY9HpyFrYpUw5r1ZVZ9gjwBsfjFY9DrJ1Jg7TkkSA6")
RESERVE_ACCOUNT  = PublicKey("9narmYnWanra4QehhEuM1fH97ATJyMVXRSPJauUNTGpV")

def create_account(sender_username):
    try:
        kp = Keypair.generate()
        public_key = str(kp.public_key)
        secret_key = kp.secret_key

        data = {
            'public_key': public_key,
            'secret_key': secret_key.decode("latin-1"),
        }

        file_name = '{}.txt'.format(sender_username)
        with open(file_name, 'w') as outfile:
            json.dump(data, outfile)

        return public_key

    except Exception as e:
        print('error:', e)
        return None

def create_new_stablecoin_account_for(existing_username):
    try:
        wallet = load_wallet(existing_username)
        assert(wallet != None)
        public_key = PublicKey(wallet['public_key'])
        transaction = Transaction()
        transaction.add(
            create_associated_token_account(
                public_key, # User is paying for the creation of the stablecoin account.
                public_key, # User is the new owner of the stablecoint account.
                MINT_ACCOUNT # The account should be able to receive the stablecoin tokens.
            )
        )
        signers = Keypair.from_secret_key(wallet['secret_key'])

        solana_client.request_airdrop(public_key,1)
        solana_client.get_balance(public_key)
        #resp = solana_client.send_transaction(
        #    transaction, signers, opts=TxOpts(skip_confirmation=False, preflight_commitment=Confirmed))
        resp = solana_client.send_transaction(transaction, signers)

        print(resp)

        transaction_id = str(resp.value)
        if transaction_id != None:
            return transaction_id
        else:
            return None
    except Exception as e:
        print(e)
        return None

def issue_stablecoins_to(username):
    user_wallet = load_wallet(username)
    assert(user_wallet != None)
    destination = PublicKey("6Gqm271XmdkCq9HevpB9qDYRjmMgt6NyaBD3MfuhxPb2")
    transaction = Transaction()

    secret_key = bytes([188,96,134,197,236,92,143,57,175,146,225,231,63,164,158,10,76,35,113,167,71,31,6,66,33,177,61,200,13,133,132,171,156,247,141,68,243,172,183,207,182,44,212,70,179,178,189,245,50,23,44,4,9,124,241,169,107,115,23,170,239,62,111,59])

    owner = Keypair.from_secret_key(secret_key)

    transaction.add(transfer_checked(TransferCheckedParams(
        program_id=TOKEN_PROGRAM_ID,
        source=RESERVE_ACCOUNT,
        mint=MINT_ACCOUNT,
        dest=destination,
        owner=TOKEN_OWNER,
        amount=100,
        decimals=9, # Abstract it out into a constant because it needs to agree with the mint settings.
        signers=[]
            )
        )
    )
    solana_client.send_transaction(
        transaction, owner, opts=TxOpts(skip_confirmation=False, preflight_commitment=Confirmed))

def load_wallet(sender_username):
    try:
        file_name = '{}.txt'.format(sender_username)
        with open(file_name) as json_file:
            account = json.load(json_file)
            account['secret_key'] = account['secret_key'].encode("latin-1")
            return account

    except Exception as e:
        print(e)
        return None


def fund_account(sender_username, amount):
    try:
        amount = int(1000000000 * amount)
        account = load_wallet(sender_username)
        assert(account != None)
        resp = solana_client.request_airdrop(
                PublicKey(account['public_key']), amount)
        transaction_id = str(resp.value)
        if transaction_id != None:
            return transaction_id
        else:
            return None

    except Exception as e:
        print('error:', e)
        return None


def get_balance(sender_username):
    try:
        account = load_wallet(sender_username)
        assert(account != None)
        resp = solana_client.get_balance(PublicKey(account['public_key']))
        balance = resp.value / 1000000000
        data = {
            "publicKey": account['public_key'],
            "balance": str(balance),
        }
        return data
    except Exception as e:
        print('error:', e)
        return None

def send_to_user(sender_username, amount, receiver_username):
    receiver_account = load_wallet(receiver_username)
    assert(receiver_account != None)
    receiver_pub_key = PublicKey(receiver_account['public_key'])
    send_sol(sender_username, amount, receiver_pub_key)

def send_sol(sender_username, amount, receiver):
    try:
        account = load_wallet(sender_username)
        assert(account != None)
        sender = Keypair.from_secret_key(account['secret_key'])
        amount = int(1000000000 * amount)

        txn = Transaction().add(transfer(TransferParams(
            from_pubkey=sender.public_key, to_pubkey=PublicKey(receiver), lamports=amount)))
        resp = solana_client.send_transaction(txn, sender)
        print(resp)

        transaction_id = str(resp.value)
        if transaction_id != None:
            return transaction_id
        else:
            return None

    except Exception as e:
        print('error:', e)
        return None
