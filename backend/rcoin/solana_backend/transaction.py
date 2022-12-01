from typing import Callable
from solana.transaction import Transaction
from solana.rpc.types import TokenAccountOpts
from solana.publickey import PublicKey
from solders.signature import Signature
from solana.blockhash import Blockhash, BlockhashCache

# Spl-token dependencies
from spl.token.constants import TOKEN_PROGRAM_ID
from spl.token.instructions import (
    TransferParams,
    transfer,
)

from rcoin.solana_backend.exceptions import (
    InvalidInputException,
    TransactionCreationFailedException,
)

from rcoin.solana_backend.response import (
    CustomResponse,
    TransactionConstructionFailure,
)

from rcoin.solana_backend.common import (
    MULTISIG_ACCOUNT,
    MINT_ACCOUNT,
    SIGNER_1_PUBKEY,
    SIGNER_2_PUBKEY,
    TOKEN_DECIMALS,
    RESERVE_ACCOUNT,
    SOLANA_CLIENT,
)

from rcoin.solana_backend.exceptions import (
    NoTokenAccountException,
    TransactionCreationFailedException,
    InvalidInputException,
)

def construct_transaction_safely(
    construction_function: Callable[[], CustomResponse]
) -> CustomResponse:
    try:

        response: CustomResponse = construction_function()
        print("Transaction created successfully!")
        return response

    except ValueError as exception:
        return TransactionConstructionFailure(
            InvalidInputException("Invalid public key.")
        )
    except (TransactionCreationFailedException, InvalidInputException) as exception:
        print(exception)
        return TransactionConstructionFailure(exception)


def construct_token_transfer(
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

    if amount < 0:
        raise InvalidInputException("The amount to transfer has to be positive.")

    transaction = Transaction(fee_payer=SIGNER_1_PUBKEY)

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
            transfer(
                TransferParams(
                    program_id=TOKEN_PROGRAM_ID,
                    source=source_account,
                    dest=dest_account,
                    owner=sender,
                    amount=int(amount * (10**TOKEN_DECIMALS)),
                    signers=get_transfer_signers(sender),
                )
            )
        )

        stamp_blockhash(transaction)

    except Exception as exception:
        raise TransactionCreationFailedException(exception)

    return transaction


def stamp_blockhash(transaction: Transaction):
    blockhash_resp = SOLANA_CLIENT.get_latest_blockhash()
    recent_blockhash = Blockhash(str(blockhash_resp.value.blockhash))
    transaction.recent_blockhash = recent_blockhash


def get_transfer_signers(sender: PublicKey) -> list[PublicKey]:
    """Given the transfer sender determines who is supposed to sign the
    transaction. We always require that both signers sign the transaction.
    (One signature per backend server). If the transaction is coming from a
    user (i.e. sender is not the MULTISIG_ACCOUNT), then that user is also
    required to sign the transaction.
    """

    signers = [SIGNER_1_PUBKEY, SIGNER_2_PUBKEY]

    if sender is not MULTISIG_ACCOUNT:
        signers.append(sender)

    return signers


def get_associated_token_account(public_key: PublicKey) -> PublicKey:
    """Get the token account associated with a given wallet

    Args:
        wallet_address: str - The string representing the public key of the
        wallet of the owner of the token account that will be returned

    Returns:
        token_account_key: PublicKey

    """

    # When issuing coins, the token account associated with the MULTISIG_ACCOUNT
    # is the reserve account which holds all of the minted tokens.
    if public_key == MULTISIG_ACCOUNT:
        return RESERVE_ACCOUNT

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
