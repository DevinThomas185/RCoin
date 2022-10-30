class NoTokenAccountException(Exception):
    """Raised when we want to get token accounts for a specific wallet
       and that wallet doesn't have any token accounts associated with it."""
    def __init__(self, wallet_address):
        self.wallet_address = wallet_address

    def __str__(self):
        return "No token account was found for wallet {}".format(self.wallet_address)

class TokenAccountAlreadyExists(Exception):
    """Indicates that a token account associated with a given public key
       already exists. Raised when we want to create a new token account."""
    def __init__(self, wallet_address):
        self.wallet_address = wallet_address

    def __str__(self):
        return "Token account already exists for wallet {}".format(self.wallet_address)

class TransactionCreationFailedException(Exception):
    """Raised when construct_stablecoin_transaction function cannot
       successfully create a Transaction object"""

    def __init__(self, cause):
        self.cause = cause

    def __str__(self):
        return "Unable to create transaction object because of \n {}".format(self.cause)

class TransactionTimeoutException(Exception):
    """Raised when an issue transaction takes too long to appear on the
       blockchain"""

    def __str__(self):
        return "Transaction timed out."

class BlockchainQueryFailedException(Exception):
    """Raised when a query sent to the blockchain fails."""

    def __str__(self):
        return """Query sent to the blockchain was unsuccessful."""



