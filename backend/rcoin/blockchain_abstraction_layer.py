from enum import Enum


class TransactionType(str, Enum):
    Withdraw = "withdraw"
    Send = "send"
    Deposit = "deposit"
    Recieve = "recieve"


class TransactionLogItem:
    def __init__(
        self,
        transaction_type: TransactionType,
        sender: str,
        recipient: str,
        amount: float,
        signature: str,
        block_time: int,
    ):
        self.transaction_type = transaction_type
        self.sender = sender
        self.recipient = recipient
        self.amount = amount
        self.signature = signature
        self.block_time = block_time


class BlockchainAbstractionLayer:
    def sign_transaction(transaction, secret_key: bytes):
        """Signs a transaction given an appropriate secret key."""
        pass

    def send_transaction(transaction):
        """Sends a complete and signed transaction to the blockchain. Then it returns
        the transaction signature immediately and doesn't wait and check if
        the transaction is there on the blockchain (in contrast to
        send_and_confirm_transaction).
        """
        pass

    def send_and_confirm_transaction(transaction):
        """Sends a complete and signed transaction to the blockchain. Then it waits
        for it to appear on it to make sure that it has been commited.

        Args:
            transaction: Transaction - transaction to be sent.
        Returns:
            a Response object indicating whether the operation was successful.
        """
        pass

    def await_transaction_commitment(signature):
        pass

    def transaction_to_bytes(transaction) -> list[int]:
        pass

    def transaction_from_bytes(bytes: bytes):
        pass

    def send_transaction_from_bytes(txn: bytes):
        pass

    def add_signature_and_send(
        transaction_bytes: bytes, signer: bytes, signer_wallet: str
    ):
        pass

    def construct_create_account_transaction(public_key: str):
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
        pass

    def construct_issue_transaction(recipient: str, amount: float):
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
        pass

    def construct_token_transfer_transaction(
        sender: str, amount: float, recipient: str
    ):
        pass

    def construct_withdraw_transaction(user_key: str, amount: float):
        pass

    def get_total_tokens_issued():
        pass

    def get_user_token_balance(public_key: str):
        pass

    def get_user_sol_balance(public_key: str):
        pass

    def _fix_transaction_format(transaction, public_key: str) -> TransactionLogItem:
        pass

    def get_stablecoin_transactions(public_key: str, limit: int = 10):
        pass

    def get_transfer_amount_for_transaction(signature: str):
        pass

    def get_recipient_for_trade_transaction(signature: str):
        pass
