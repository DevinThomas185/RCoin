from time import sleep
from enum import Enum

# Solana dependencies
from solana.rpc.commitment import Confirmed
from solana.rpc.types import TxOpts
from solana.keypair import Keypair
from solana.publickey import PublicKey
from solana.transaction import Transaction

from solders.rpc.responses import GetTokenSupplyResp, GetTransactionResp
from solders.signature import Signature
from solders.transaction_status import EncodedTransactionWithStatusMeta
from solders.transaction import Transaction as SoldersTx
from solders.signature import Signature

from solana.blockhash import Blockhash

# Spl-token dependencies
from spl.token.instructions import create_associated_token_account
from spl.token.instructions import transfer

from spl.token.instructions import (
    create_associated_token_account,
)

from rcoin.blockchain_abstraction_layer import (
    BlockchainAbstractionLayer,
    TransactionLogItem,
    TransactionType,
)

# Solana backend imports
from rcoin.solana_backend.common import (
    MULTISIG_ACCOUNT,
    SIGNER_1_PUBKEY,
    SOLANA_CLIENT,
    MINT_ACCOUNT,
    TOKEN_DECIMALS,
    TOKEN_OWNER,
    TOTAL_SUPPLY,
)

from rcoin.solana_backend.exceptions import (
    BlockchainQueryFailedException,
    InvalidGetTransactionRespException,
    TokenAccountAlreadyExists,
    TransactionTimeoutException,
)

from rcoin.solana_backend.transaction import (
    stamp_blockhash,
    construct_token_transfer,
    construct_transaction_safely,
    get_associated_token_account,
)

from rcoin.solana_backend.query import (
    execute_query,
    get_processed_transactions_for_account,
    get_reserve_balance,
    get_token_balance,
    get_transaction_details,
    has_token_account,
    get_sol_balance,
)

from rcoin.solana_backend.response import (
    CustomResponse,
    Success,
    Failure,
    TransactionConstructionFailure,
    TransactionConstructionSuccess,
)

BLOCKCHAIN_RESPONSE_TIMEOUT = 30


class Solana(BlockchainAbstractionLayer):
    def sign_transaction(
        self, transaction: Transaction, secret_key: bytes
    ) -> Transaction:
        """Signs a transaction given an appropriate secret key."""

        transaction.sign_partial(Keypair.from_secret_key(secret_key))
        return transaction

    def send_transaction(self, transaction: Transaction) -> Signature:
        """Sends a complete and signed transaction to the blockchain. Then it returns
        the transaction signature immediately and doesn't wait and check if
        the transaction is there on the blockchain (in contrast to
        send_and_confirm_transaction).
        """
        final_bytes = transaction.serialize()

        resp = SOLANA_CLIENT.send_raw_transaction(final_bytes)

        signature = resp.value

        print(
            "Transaction submitted to the blockchain with signature: {}".format(
                signature
            )
        )

        return signature

    def send_and_confirm_transaction(self, transaction: Transaction) -> CustomResponse:
        """Sends a complete and signed transaction to the blockchain. Then it waits
        for it to appear on it to make sure that it has been commited.

        Args:
            transaction: Transaction - transaction to be sent.
        Returns:
            a Response object indicating whether the operation was successful.
        """

        signature = self.send_transaction(transaction)

        try:
            self.await_transaction_commitment(signature)
        except TransactionTimeoutException as exception:
            return TransactionConstructionFailure(exception)

        return Success("signature", str(signature))

    def await_transaction_commitment(self, signature: Signature):
        print("Awaiting transaction: {}".format(str(signature)))
        print("Waiting until it appears on the blockchain...")

        count = 0
        while (
            get_transaction_details(signature) == GetTransactionResp(None)
            and count < BLOCKCHAIN_RESPONSE_TIMEOUT
        ):
            count += 1
            sleep(1)

        # Fail if the transaction is still not on the blockchain after over 30 seconds
        if count == BLOCKCHAIN_RESPONSE_TIMEOUT:
            raise TransactionTimeoutException()

        print("Transaction successfully committed to the blockchain!")

    def transaction_to_bytes(self, transaction: Transaction) -> list[int]:
        return list(transaction.to_solders().__bytes__())

    def transaction_from_bytes(self, bytes: bytes) -> Transaction:
        return Transaction.from_solders(SoldersTx.from_bytes(bytes))

    def send_transaction_from_bytes(self, txn: bytes) -> CustomResponse:
        resp = SOLANA_CLIENT.send_raw_transaction(txn)
        return Success("response", resp)

    def add_signature_and_send(
        self, transaction_bytes: bytes, signer: bytes, signer_wallet: str
    ) -> CustomResponse:
        try:
            transaction = self.transaction_from_bytes(transaction_bytes)

            pub_key = PublicKey(signer_wallet)
            signature = Signature.from_bytes(signer)
            transaction.add_signature(pub_key, signature)
            return self.send_and_confirm_transaction(transaction)

        except Exception as e:
            return Failure("exception", e)

    def construct_create_account_transaction(self, public_key: str) -> CustomResponse:
        """Request creation of a new token account for a Solana account with the
        address equal to public_key.

        This function should be used by the backend to get the transaction bytes,
        which can then be sent to phantom for signing and received back at the
        backend and sent to the blockchain.

        Args:
            public_key: The string representing the public key of the account that
            will be the owner of the new token account.

        Returns:
            byte array which can then be reconstructed into a solders transaction
            on the frontend side and sent to phantom.

        """
        if has_token_account(PublicKey(public_key)):
            return TransactionConstructionFailure(TokenAccountAlreadyExists(public_key))

        owner_key = PublicKey(public_key)
        transaction = Transaction()
        transaction.add(
            create_associated_token_account(
                # The first signer is paying for the creation of the new Stablecoin account.
                # It is done to ensure that a user can create an account even if they
                # don't have any sol at the moment. We don't require the full multisig
                # on that transaction as we only pay for the fee.
                payer=SIGNER_1_PUBKEY,
                # User is the new owner of the new Stablecoin account.
                owner=owner_key,
                # Mint account is the one which defines our Stablecoin token.
                mint=MINT_ACCOUNT,
            )
        )

        stamp_blockhash(transaction)

        return TransactionConstructionSuccess(transaction)

    ### Constructing a transaction to issue tokens to a user ###
    def construct_issue_transaction(
        self, recipient: str, amount: float
    ) -> CustomResponse:
        """Constructs a transaction to issue stablecoins and sends it directly
        to the blockchain.

        Args:
            recipient_public_key: string identifying the wallet address of the
            recipient
            amount: number of stablecoins to be issued.
        Returns:
            SolanaResponse containing the created transaction or the exception which
            has caused the failure.
        """
        print(
            "Creating a transaction object to issue {} stablecoins for account: {}".format(
                amount, recipient
            )
        )
        return construct_transaction_safely(
            lambda: TransactionConstructionSuccess(
                construct_token_transfer(MULTISIG_ACCOUNT, amount, PublicKey(recipient))
            )
        )

    ### Constructing a transfer between users ###
    def construct_token_transfer_transaction(
        self, sender: str, amount: float, recipient: str
    ) -> CustomResponse:
        print(
            "Creating a transaction object to transfer stablecoins {} from account to account {}".format(
                amount, sender, recipient
            )
        )
        return construct_transaction_safely(
            lambda: TransactionConstructionSuccess(
                construct_token_transfer(
                    PublicKey(sender), amount, PublicKey(recipient)
                )
            )
        )

    ### Constructing a withdrawal ###
    def construct_withdraw_transaction(
        self, user_key: str, amount: float
    ) -> CustomResponse:
        print(
            "Creating a transaction object to withdraw {} stablecoins from account: {}".format(
                amount, user_key
            )
        )
        return construct_transaction_safely(
            lambda: TransactionConstructionSuccess(
                construct_token_transfer(PublicKey(user_key), amount, TOKEN_OWNER)
            )
        )

    ### Query the Blockchain ###
    def get_total_tokens_issued(self) -> CustomResponse:
        return execute_query(
            lambda: Success("amount", TOTAL_SUPPLY - get_reserve_balance())
        )

    def get_user_token_balance(self, public_key: str) -> CustomResponse:
        return execute_query(
            lambda: Success("account_balance", get_token_balance(PublicKey(public_key)))
        )

    def get_user_sol_balance(self, public_key: str) -> CustomResponse:
        return execute_query(
            lambda: Success("account_balance", get_sol_balance(PublicKey(public_key)))
        )

    def _fix_transaction_format(transaction, public_key: str) -> TransactionLogItem:
        amount = transaction["amount"] / (10 ** (TOKEN_DECIMALS))

        if transaction["sender"] == public_key:
            if transaction["recipient"] == str(TOKEN_OWNER):
                transaction_type = TransactionType.Withdraw
            else:
                transaction_type = TransactionType.Send

        else:
            if transaction["sender"] == str(TOKEN_OWNER):
                transaction_type = TransactionType.Deposit
            else:
                transaction_type = TransactionType.Recieve

        fixed_transaction = TransactionLogItem(
            transaction_type,
            sender=transaction["sender"],
            recipient=transaction["recipient"],
            amount=amount,
            signature=transaction["signature"],
            block_time=transaction["block_time"],
        )

        return fixed_transaction.__dict__

    def get_stablecoin_transactions(public_key: str, limit: int = 10) -> CustomResponse:
        try:

            associated_account = get_associated_token_account(PublicKey(public_key))

            transactions = get_processed_transactions_for_account(
                associated_account, limit
            )

            corrected_transactions = list(
                map(lambda t: _fix_transaction_format(t, public_key), transactions)
            )

            return Success(
                "transaction_history",
                corrected_transactions,
            )

        except BlockchainQueryFailedException as exception:
            return Failure("exception", exception)

    def get_transfer_amount_for_transaction(signature: str) -> CustomResponse:
        resp = GetTransactionResp(None)
        counter = 0
        try:

            while (
                resp == GetTransactionResp(None)
                and counter < BLOCKCHAIN_RESPONSE_TIMEOUT
            ):
                resp = get_transaction_details(Signature.from_string(signature))
                counter += 1
                sleep(1)

        except BlockchainQueryFailedException as exception:
            return Failure(exception)

        if resp == GetTransactionResp(None):
            return Failure(TransactionTimeoutException())

        if resp.value is None:
            return Failure(InvalidGetTransactionRespException())

        confirmed_transaction: EncodedTransactionWithStatusMeta = resp.value.transaction

        if confirmed_transaction.meta is None:
            return Failure(InvalidGetTransactionRespException())

        pre_token_balances = confirmed_transaction.meta.pre_token_balances
        post_token_balances = confirmed_transaction.meta.post_token_balances

        if (
            pre_token_balances is None
            or post_token_balances is None
            or len(post_token_balances) != 2
        ):
            return Failure(InvalidGetTransactionRespException())

        if (
            pre_token_balances[0].account_index == post_token_balances[0].account_index
            and len(pre_token_balances) == 2
        ):
            # Both sender's and recipient's token accounts existed before
            # the transaction (usual scenario)
            amount = int(pre_token_balances[0].ui_token_amount.amount) - int(
                post_token_balances[0].ui_token_amount.amount
            )
        else:
            # Edge case when the recipient didn't have a token account before
            # transaction and it was created on request.
            amount = int(pre_token_balances[0].ui_token_amount.amount) - int(
                post_token_balances[1].ui_token_amount.amount
            )

        # We return the absolute value of the amount because we always transfer
        # positive amounts of coins.
        return Success("amount", abs(amount) / 10**TOKEN_DECIMALS)

    def get_recipient_for_trade_transaction(self, signature: str) -> CustomResponse:
        resp = GetTransactionResp(None)
        counter = 0
        try:

            while (
                resp == GetTransactionResp(None)
                and counter < BLOCKCHAIN_RESPONSE_TIMEOUT
            ):
                resp = get_transaction_details(Signature.from_string(signature))
                counter += 1
                sleep(1)

        except BlockchainQueryFailedException as exception:
            return Failure("exception", exception)

        if resp == GetTransactionResp(None):
            return Failure("exception", TransactionTimeoutException())

        if resp.value is None:
            return Failure("exception", InvalidGetTransactionRespException())

        confirmed_transaction: EncodedTransactionWithStatusMeta = resp.value.transaction

        if confirmed_transaction.meta is None:
            return Failure("exception", InvalidGetTransactionRespException())

        # Copied from query.py should abstract:

        def get_balances_map(balances_list):
            balance_map = {}
            for token_balance in balances_list:
                owner: str = str(token_balance.owner)
                balance_map[owner] = int(token_balance.ui_token_amount.amount)

            return balance_map

        pre_token_balances = confirmed_transaction.meta.pre_token_balances
        post_token_balances = confirmed_transaction.meta.post_token_balances

        pre_balances_map = get_balances_map(pre_token_balances)
        post_balances_map = get_balances_map(post_token_balances)

        balance_deltas_map = {}
        for owner, post_balance in post_balances_map.items():
            # If the pre_balances_map doesn't have an entry for the owner
            # it means that he didn't have a token account before the transaction
            # and it was created for him as a part of the transfer. In which case
            # we set the pre_balance to 0.
            if owner not in pre_balances_map.keys():
                pre_balances_map[owner] = 0

            balance_deltas_map[owner] = post_balance - pre_balances_map[owner]

        sender = None
        recipient = None
        amount = None

        if len(balance_deltas_map) == 2:
            # If there are only two accounts involved, we are dealing with
            # issue/withdraw without the fee.
            for owner, delta in balance_deltas_map.items():
                if delta < 0:
                    # Sender of money is the one whose amount decreases as a result
                    # of the transaction i.e. has a negative delta.
                    sender = owner
                else:
                    recipient = owner
                    amount = delta

        else:
            # If there are more than 2 accounts involved, we are making a on-chain
            # transfer and one of the accounts is the fee account owned by the
            # TOKEN_OWNER.
            for owner, delta in balance_deltas_map.items():
                print(owner, delta)
                if delta < 0:
                    # Sender of money is the one whose amount decreases as a result
                    # of the transaction i.e. has a negative delta.
                    sender = owner
                elif owner != str(TOKEN_OWNER):
                    # If the owner is not the owner of the fee account,
                    # then he must be the recipient of the transaction as he has
                    # a positive delta.
                    recipient = owner
                    amount = delta

        # Can this change?
        return Success("public_key", recipient)
