from solana.keypair import Keypair
from dotenv import load_dotenv

from typing import Any

from solana.transaction import Transaction
from fastapi import FastAPI

app = FastAPI()

load_dotenv()

from utils import (
    SIGNER_2,
    SignTransaction,
    transaction_from_bytes,
    transaction_to_bytes,
)


@app.post("/api/sign-transaction")
async def sign(sign_transaction: SignTransaction) -> dict[str, Any]:
    transaction: Transaction = transaction_from_bytes(
        bytes(sign_transaction.transaction_bytes)
    )
    print("Received a request to sign a transaction.")
    transaction.sign_partial(Keypair.from_secret_key(SIGNER_2))
    transaction_bytes = transaction_to_bytes(transaction)
    return {"transaction_bytes": transaction_bytes}
