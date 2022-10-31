import os
from dotenv import load_dotenv

load_dotenv()

# Solana dependencies
from solana.publickey import PublicKey
from solana.rpc.api import Client

SOLANA_CLIENT            = Client(str(os.getenv("SOLANA_CLIENT")))
MINT_ACCOUNT      = PublicKey(str(os.getenv("MINT_ACCOUNT")))
TOKEN_OWNER              = PublicKey(str(os.getenv("TOKEN_OWNER")))
RESERVE_ACCOUNT_ADDRESS  = PublicKey(str(os.getenv("RESERVE_ACCOUNT_ADDRESS")))

TOTAL_SUPPLY = 1000000000

def read_the_secret_key(key: str) -> list[int]:
    numbers_strings = key.split(',')
    return list(map(int, numbers_strings))

# Secret key of the account of the token owner. Used for issuing new tokens
# for users who have provided equivalent collateral.
SECRET_KEY = bytes(read_the_secret_key(str(os.getenv("SECRET_KEY"))))

# The precision that we support in transactions involving our stablecoin token
# is up to 9 decimal places.
TOKEN_DECIMALS = 9

# A fraction of Solana coin (SOL) is called a Lamport, there are 1000000000
# Lamports in one SOL
LAMPORTS_PER_SOL = 1000000000


