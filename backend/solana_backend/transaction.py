from solana.transaction import Transaction
from solana.rpc.types import TokenAccountOpts
from solana.publickey import PublicKey
from solana.transaction import Transaction

# Spl-token dependencies
from spl.token.constants import TOKEN_PROGRAM_ID
from spl.token.instructions import (
    transfer_checked,
    TransferCheckedParams,
)

from solana_backend.common import (
    MINT_ACCOUNT,
    TOKEN_DECIMALS,
    RESERVE_ACCOUNT_ADDRESS,
    SOLANA_CLIENT,
    TOKEN_OWNER,
)

from solana_backend.exceptions import (
    NoTokenAccountException,
    TransactionCreationFailedException,
)

def construct_stablecoin_transfer(
    sender: PublicKey, amount: float, recipient: PublicKey
) -> Transaction:
    """Creates a transfer transaction to move stablecoin tokens from one
    account to the other.

    Args:
        from: PublicKey of the sender
        amount: Number of stablecoins to transfer
        to: PublicKey of the recipient

    Returns:
        Transaction object which can then be converted into a solders
        transaction and decomposed into bytes.

    """
    transaction = Transaction()

    source_account = None
    dest_account = None

    try:
        source_account = get_associated_token_account(sender)
        dest_account = get_associated_token_account(recipient)
    except NoTokenAccountException as exception:
        print(exception)
        raise TransactionCreationFailedException(exception)

    assert source_account is not None
    assert dest_account is not None

    try:
        transaction.add(
            transfer_checked(
                TransferCheckedParams(
                    program_id=TOKEN_PROGRAM_ID,
                    source=source_account,
                    mint=MINT_ACCOUNT,
                    dest=dest_account,
                    owner=sender,
                    amount=int(amount * (10**TOKEN_DECIMALS)),
                    decimals=TOKEN_DECIMALS,
                    signers=[],
                )
            )
        )
    except Exception as exception:
        print(exception)
        raise TransactionCreationFailedException(exception)


    return transaction


def get_associated_token_account(public_key: PublicKey) -> PublicKey:
    """Get the token account associated with a given wallet

    Args:
        wallet_address: str - The string representing the public key of the
        wallet of the owner of the token account that will be returned

    Returns:
        token_account_key: PublicKey

    """

    # When issuing coins, the token account associated with the owner is the
    # reserve account which holds all of the minted tokens.
    if public_key == TOKEN_OWNER:
        return RESERVE_ACCOUNT_ADDRESS

    resp = SOLANA_CLIENT.get_token_accounts_by_owner(
        public_key, TokenAccountOpts(mint=MINT_ACCOUNT)
    )

    # It is possible that there is more than one Stablecoin token account
    # associated with the user's wallet. However, our current implementation
    # of creating token accounts will not allow for creating multiple token
    # accounts per user. Here we assume that only one such account exists and
    # therefore we access the fist item in the list.

    if resp.value == []:
        print(
            "There are no token accounts associated with the wallet: {}".format(
                public_key
            )
        )
        raise NoTokenAccountException(str(public_key))

    token_account_key = PublicKey.from_solders(resp.value[0].pubkey)

    print(
        "Token account: {} found for wallet: {}".format(token_account_key, public_key)
    )

    return token_account_key


def transaction_to_bytes(transaction: Transaction) -> list[int]:
    return list(transaction.to_solders().__bytes__())


