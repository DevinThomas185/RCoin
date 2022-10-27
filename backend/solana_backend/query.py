import os

# Solana dependencies
from solana.rpc.commitment import Confirmed
from solana.rpc.types import TokenAccountOpts, TxOpts
from solana.keypair import Keypair
from solana.publickey import PublicKey
from solana.rpc.api import Client
from solana.transaction import Transaction

SOLANA_CLIENT            = Client(str(os.getenv("SOLANA_CLIENT")))
MINT_ACCOUNT             = PublicKey(str(os.getenv("MINT_ACCOUNT")))
TOKEN_OWNER              = PublicKey(str(os.getenv("TOKEN_OWNER")))
RESERVE_ACCOUNT_ADDRESS  = PublicKey(str(os.getenv("RESERVE_ACCOUNT_ADDRESS")))

TOTAL_SUPPLY = 1000000000

def get_associated_token_account(wallet_address):
    if wallet_address == TOKEN_OWNER:
        # When issuing coins the token account associated with the owner is the
        # reserve account.
        return RESERVE_ACCOUNT_ADDRESS

    wallet_address = PublicKey(wallet_address)
    resp = SOLANA_CLIENT.get_token_accounts_by_owner(wallet_address, TokenAccountOpts(mint=MINT_ACCOUNT))
    # It is possible that there is more than one Stablecoin token account
    # associated with the user's wallet, in such case we need to do something
    # about it. Right now we always pick the first account in the list.
    # TODO: prevent creation of multiple stablecoin accounts for one wallet.
    token_account = PublicKey.from_solders(resp.value[0].pubkey)

    if token_account is None:
        print("There are no token accounts associated with the wallet: {}".format(wallet_address))
        return

    print("Token account: {} found for wallet: {}".format(token_account, wallet_address))
    return token_account

def get_balance(public_key):
    return SOLANA_CLIENT.get_balance(public_key).value

def get_sol_balance(public_key):
    return get_balance(public_key) / LAMPORTS_PER_SOL

def get_token_balance(pubkey_str):
    solana_client = os.getenv("SOLANA_CLIENT")
    token_program_id = "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"
    assert(solana_client is not None)
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
    r =  post(solana_client, json = payload)
    j = r.json()
    return float(j['result']['value'][0]['account']['data']['parsed']['info']['tokenAmount']['amount']) / (10**TOKEN_DECIMALS)

def get_total_tokens_issued():
    return TOTAL_SUPPLY - get_token_balance(os.getenv("TOKEN_OWNER"))
