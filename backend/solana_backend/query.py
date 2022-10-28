import os
from requests import post

# Solana dependencies
from solana.publickey import PublicKey
from solana.rpc.types import TokenAccountOpts

from solana_backend.common import (
        SOLANA_CLIENT,
        MINT_ACCOUNT,
        TOKEN_DECIMALS,
        TOKEN_OWNER,
        TOTAL_SUPPLY,
        RESERVE_ACCOUNT_ADDRESS,
        LAMPORTS_PER_SOL
        )

def does_public_key_have_a_token_account(public_key) -> bool:
    resp = SOLANA_CLIENT.get_token_accounts_by_owner(
            public_key,
            TokenAccountOpts(mint=MINT_ACCOUNT))

    return resp.value != []


def get_associated_token_account(wallet_address):
    wallet_address = PublicKey(wallet_address)

    if wallet_address == TOKEN_OWNER:
        # When issuing coins the token account associated with the owner is the
        # reserve account.
        return RESERVE_ACCOUNT_ADDRESS

    resp = SOLANA_CLIENT.get_token_accounts_by_owner(
            wallet_address,
            TokenAccountOpts(mint=MINT_ACCOUNT))

    # It is possible that there is more than one Stablecoin token account
    # associated with the user's wallet. However, here in the implementation
    # we assume that there is just one token account associated with
    # each wallet. That is because our function for creating token accounts
    # doesn't allow creating multiple token account for each user.
    token_account = PublicKey.from_solders(resp.value[0].pubkey)

    if token_account is None:
        print("There are no token accounts associated with the wallet: {}".format(wallet_address))
        return

    print("Token account: {} found for wallet: {}".format(token_account, wallet_address))
    return token_account

def get_balance(public_key):
    return SOLANA_CLIENT.get_balance(public_key).value

def get_sol_balance(pubkey_str):
    return get_balance(PublicKey(pubkey_str)) / LAMPORTS_PER_SOL

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

def get_transaction_details(transaction_signature):
    return SOLANA_CLIENT.get_transaction(Signature.from_string(transaction_signature))

def get_transactions_for_account(pubkey_str, transaction_number):
    return SOLANA_CLIENT.get_signatures_for_address(PublicKey(pubkey_str), limit=transaction_number)

