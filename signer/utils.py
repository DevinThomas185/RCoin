import os
from typing import List
from solana.transaction import Transaction
from solders.transaction import Transaction as SoldersTx
from pydantic import BaseModel

class SignTransaction(BaseModel):
    transaction_bytes: List[int]

def read_the_secret_key(key: str) -> list[int]:
    numbers_strings = key.split(",")
    return list(map(int, numbers_strings))

SIGNER_2 = bytes(read_the_secret_key(str(os.getenv("SIGNER_2"))))

def transaction_from_bytes(bytes: bytes) -> Transaction:
    return Transaction.from_solders(SoldersTx.from_bytes(bytes))

def transaction_to_bytes(transaction: Transaction) -> list[int]:
    return list(transaction.to_solders().__bytes__())

