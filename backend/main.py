from fastapi import FastAPI
from solana_backend.api import (
        new_stablecoin_transaction,
        request_create_token_account,
        issue_stablecoins,
        burn_stablecoins
)

app = FastAPI()

@app.get("/api/test")
async def root():
    return {"message": "Connected to backend!!!"}

@app.get("/api/test_transaction")
async def test_transaction():
        return {"transaction_bytes": new_stablecoin_transaction(
            "6xbNLwyAjTVx3JpUDKu7cuiNacfQdL6XZ1C8FKdQdPaa",
            3,
            "31qpi5WRVV2qCqU1UewcVuhG8GCUdoUYHq98J6thTd7f")}

@app.get("/api/request_transaction")
async def request_transaction(sender_pubkey, amount, recipient_pubkey):
        return {"transaction_bytes": new_stablecoin_transaction(
                                    sender_pubkey, amount, recipient_pubkey)}

@app.get("/api/create_token_account")
async def create_token_account(owner_pubkey):
        return {"transaction_bytes": request_create_token_account(owner_pubkey)}


@app.get("/api/issue_tokens")
async def issue_tokens(requestor_pubkey, amount):
        issue_stablecoins(requestor_pubkey, amount)


@app.get("/api/redeem_tokens")
async def redeem_tokens(requestor_pubkey, amount):
        return {"transaction_bytes": burn_stablecoins(requestor_pubkey, amount)}

