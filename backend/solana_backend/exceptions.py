class NoTokenAccountException(Exception):
    """Raised when we want to get token accounts for a specific wallet
       and that wallet doesn't have any token accounts associated with it."""
    def __init__(self, wallet_address):
        self.wallet_address = wallet_address

    def __str__(self):
        return "No token account was found for wallet {}".format(self.wallet_address)

class TransactionCreationFailedException(Exception):
    """Raised when construct_stablecoin_transaction function cannot
       successfully create a Transaction object"""

    def __init__(self, cause):
        self.cause = cause

    def __str__(self):
        return "Unable to create transaction object because of \n {}".format(self.cause)





