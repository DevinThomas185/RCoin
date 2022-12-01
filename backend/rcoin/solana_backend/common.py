import os
from dotenv import load_dotenv

load_dotenv()

# Solana dependencies
from solana.publickey import PublicKey
from solana.rpc.api import Client

SOLANA_CLIENT = Client(str(os.getenv("SOLANA_CLIENT")))
MINT_ACCOUNT = PublicKey(str(os.getenv("MINT_ACCOUNT")))
FEE_ACCOUNT = PublicKey(str(os.getenv("FEE_ACCOUNT")))
TOKEN_OWNER = PublicKey(str(os.getenv("TOKEN_OWNER")))
MULTISIG_ACCOUNT = PublicKey(str(os.getenv("MULTISIG_ACCOUNT")))
RESERVE_ACCOUNT = PublicKey(str(os.getenv("RESERVE_ACCOUNT")))

SIGNER_1_PUBKEY = PublicKey(str(os.getenv("SIGNER_1_PUBKEY")))
SIGNER_2_PUBKEY = PublicKey(str(os.getenv("SIGNER_2_PUBKEY")))

TOTAL_SUPPLY = 10_000_000_000

def read_the_secret_key(key: str) -> list[int]:
    numbers_strings = key.split(",")
    return list(map(int, numbers_strings))

# Secret keys of the two signers that need to sign each blockchain transaction.
SIGNER_1 = bytes(read_the_secret_key(str(os.getenv("SIGNER_1"))))

# On the actual deployed backend the secret key of the second signer will not
# be there. This one here is for the purposes of running the testsuite locally
# as it is required to be able to manufacture both signatures while testing.
SIGNER_2 = bytes(read_the_secret_key(str(os.getenv("SIGNER_2"))))

# The precision that we support in transactions involving our stablecoin token
# is up to 9 decimal places.
TOKEN_DECIMALS = 9

# A fraction of Solana coin (SOL) is called a Lamport, there are 1000000000
# Lamports in one SOL
LAMPORTS_PER_SOL = 1000000000
