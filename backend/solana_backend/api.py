# Standard imports
import os
from requests import post

# Solana dependencies
from solana.rpc.commitment import Confirmed
from solana.rpc.types import TokenAccountOpts, TxOpts
from solana.keypair import Keypair
from solana.publickey import PublicKey
from solana.transaction import Transaction

from solders.signature import Signature

# Spl-token dependencies
from spl.token.constants import TOKEN_PROGRAM_ID
from spl.token.instructions import (
    create_associated_token_account,
    transfer_checked,
    TransferCheckedParams,
)

from solana_backend.common import (
    SOLANA_CLIENT,
    MINT_ACCOUNT,
    TOKEN_DECIMALS,
    TOKEN_OWNER,
    TOTAL_SUPPLY,
    RESERVE_ACCOUNT_ADDRESS,
    SECRET_KEY,
    LAMPORTS_PER_SOL,
)


def fund_account(public_key, amount):
    public_key = PublicKey(public_key)
    try:
        if amount > 2:
            print("The maximum amount allowed is 2 SOL")
            return

        print("Requesting {} SOL to the Solana account: {}".format(amount, public_key))

        resp = SOLANA_CLIENT.request_airdrop(public_key, amount)
        transaction_id = str(resp.value)

        if transaction_id is None:
            print("Failed to fund your Solana account")
            return

        print(resp)

        print("The transaction: {} was executed.".format(transaction_id))
        print("You requested funding your account with {} SOL.".format(amount))

    except Exception as e:
        print("error:", e)


def request_create_token_account(public_key):
    """Request creation of a new token account for a Solana account with the
       address equal to public_key.

    This function should be used by the backend to get the transaction json.
    It is not suitable for debugging and will not work.

    Args:
        public_key: The public key of the account that will be the owner
        of the new token account.

    Returns:
        json object representing a transaction which needs to be signed by
        phantom on the frontent side.

    """
    if does_public_key_have_a_token_account(public_key):
        ## failure, TODO: handle appropriately.
        return []

    public_key = PublicKey(public_key)
    transaction = Transaction()
    transaction.add(
        create_associated_token_account(
            # User is paying for the creation of their Stablecoin account.
            payer=public_key,
            # User is the new owner of the new Stablecoin account.
            owner=public_key,
            # Mint account is the one which defines our Stablecoin token.
            mint=MINT_ACCOUNT,
        )
    )

    bytes = transaction.to_solders().__bytes__()
    return transaction_bytes_to_array(bytes)


def transaction_bytes_to_array(transaction_bytes):
    byte_array = []
    for byte in transaction_bytes:
        byte_array.append(byte)

    return byte_array


def burn_stablecoins(user_pubkey_str, amount):
    bytes = (
        construct_stablecoin_transaction(
            PublicKey(user_pubkey_str), amount, TOKEN_OWNER
        )
        .to_solders()
        .__bytes__()
    )

    return transaction_bytes_to_array(bytes)


def new_stablecoin_transaction(sender, amount, recipient):
    bytes = (
        construct_stablecoin_transaction(
            PublicKey(sender), amount, PublicKey(recipient)
        )
        .to_solders()
        .__bytes__()
    )

    return transaction_bytes_to_array(bytes)


def construct_stablecoin_transaction(sender, amount, recipient):
    """Creates a transfer transaction to move stablecoin tokens from one
    account to the other.

    Args:
        from: PublicKey of the sender
        amount: Number of stablecoins to transfer
        to: PublicKey of the recipient
    """
    transaction = Transaction()

    source_account = get_associated_token_account(sender)
    dest_acount = get_associated_token_account(recipient)

    assert source_account is not None
    assert dest_acount is not None

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
                signers=[],
            )
        )
    )
    return transaction


def issue_stablecoins(recipient_public_key, amount):
    """Given the public key of the TOKEN account (not the wallet address)
    issues the requested amount of stablecoins to that account.
    Prior to executing it should be ensured that the user has provided
    equivalent collateral in exchange for the coins.
    """
    recipient_public_key = PublicKey(recipient_public_key)

    transaction = construct_stablecoin_transaction(
        sender=TOKEN_OWNER, amount=amount, recipient=recipient_public_key
    )

    # TODO: find a secure way to store the private key of the token account.
    owner = Keypair.from_secret_key(SECRET_KEY)

    print(
        "Sending request to issue stablecoins for account: {}".format(
            recipient_public_key
        )
    )

    resp = SOLANA_CLIENT.send_transaction(
        transaction,
        owner,
        opts=TxOpts(skip_confirmation=False, preflight_commitment=Confirmed),
    )

    print("Transaction finished with response: {}".format(resp))
    if resp.value.__str__() is not None:
        return {"success": True}


def get_transaction_for_phantom(sender, amount, recipient):
    """Constructs a transaction which can be sent to Phantom for signing and
    then sent to the network.

    Args:
        sender: A string representing the public key of the sender.
        amount: The amount of stablecoins to be transferred.
        recipient: A string representing the public key of the recipient.
    """
    sender_key = PublicKey(sender)
    recipient_key = PublicKey(recipient)

    return (
        construct_stablecoin_transaction(sender_key, amount, recipient_key)
        .to_solders()
        .__bytes__()
    )


def get_associated_token_account(wallet_address):
    if wallet_address == TOKEN_OWNER:
        # When issuing coins the token account associated with the owner is the
        # reserve account.
        return RESERVE_ACCOUNT_ADDRESS

    wallet_address = PublicKey(wallet_address)
    resp = SOLANA_CLIENT.get_token_accounts_by_owner(
        wallet_address, TokenAccountOpts(mint=MINT_ACCOUNT)
    )
    # It is possible that there is more than one Stablecoin token account
    # associated with the user's wallet, in such case we need to do something
    # about it. Right now we always pick the first account in the list.
    # TODO: prevent creation of multiple stablecoin accounts for one wallet.
    token_account = PublicKey.from_solders(resp.value[0].pubkey)

    if token_account is None:
        print(
            "There are no token accounts associated with the wallet: {}".format(
                wallet_address
            )
        )
        return

    print(
        "Token account: {} found for wallet: {}".format(token_account, wallet_address)
    )
    return token_account


def get_balance(public_key):
    return SOLANA_CLIENT.get_balance(public_key).value


def get_sol_balance(pubkey_str):
    return get_balance(PublicKey(pubkey_str)) / LAMPORTS_PER_SOL


def does_public_key_have_a_token_account(public_key) -> bool:
    resp = SOLANA_CLIENT.get_token_accounts_by_owner(
        public_key, TokenAccountOpts(mint=MINT_ACCOUNT)
    )

    return resp.value != []


def get_token_balance(pubkey_str):
    solana_client = os.getenv("SOLANA_CLIENT")
    token_program_id = "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"
    assert solana_client is not None
    payload = {
        "jsonrpc": "2.0",
        "id": 1,
        "method": "getTokenAccountsByOwner",
        "params": [
            f"{pubkey_str}",
            {"programId": f"{token_program_id}"},
            {"encoding": "jsonParsed"},
        ],
    }
    r = post(solana_client, json=payload)
    j = r.json()
    return float(
        j["result"]["value"][0]["account"]["data"]["parsed"]["info"]["tokenAmount"][
            "amount"
        ]
    ) / (10**TOKEN_DECIMALS)


def get_total_tokens_issued():
    return TOTAL_SUPPLY - get_token_balance(os.getenv("TOKEN_OWNER"))


def get_transaction_details(transaction_signature):
    return SOLANA_CLIENT.get_transaction(transaction_signature)


def get_raw_transactions_for_account(pubkey_str, number_of_transactions):
    return SOLANA_CLIENT.get_signatures_for_address(
        PublicKey(pubkey_str), limit=number_of_transactions
    )

# Takes in a public key, and returns a list of tuples (source, target, amount)
# The amounts can be negative or positive, and the source is always the public key
def get_processed_transactions_for_account(pubkey_str, limit):
    mint = "6aFw36vy5FrnT7s6fuepnFie9H95bGMCxsSjXyEBZt4Q"
    resp = SOLANA_CLIENT.get_signatures_for_address(PublicKey(pubkey_str))
    signatures = list(map(lambda status: status.signature, resp.value))
    transaction_details = list(map(get_transaction_details, signatures))
    confirmed_transactions = [
        transaction_detail.value.transaction
        for transaction_detail in transaction_details
        if transaction_detail.value
    ]
    processed_transactions = []
    for confirmed_transaction in confirmed_transactions:
        pre_token_balances = confirmed_transaction.meta.pre_token_balances
        post_token_balances = confirmed_transaction.meta.post_token_balances
        isUseful = True
        if len(pre_token_balances) != 2 or len(post_token_balances) != 2:
            isUseful = False
        for pre_token_balance in pre_token_balances:
            if str(pre_token_balance.mint) != mint:
                isUseful = False
        for post_token_balance in post_token_balances:
            if str(post_token_balance.mint) != mint:
                isUseful = False
        if not isUseful:
            continue

        source = str(pre_token_balances[0].owner)
        target = str(pre_token_balances[1].owner)
        amount = int(pre_token_balances[0].ui_token_amount.amount) - int(
            pre_token_balances[1].ui_token_amount.amount
        )
        processed_transactions.append((source, target, amount))

    return processed_transactions[:limit]
