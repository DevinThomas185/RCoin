from fastapi import FastAPI
from solana_backend.api import new_stablecoin_transaction

app = FastAPI()

@app.get("/api/test")
async def root():
    return {"message": "Connected to backend!!!"}

@app.get("/api/test_transaction")
async def test_transaction():
        return {"transaction_bytes": new_stablecoin_transaction(
                            "6xbNLwyAjTVx3JpUDKu7cuiNacfQdL6XZ1C8FKdQdPaa",
                            1,
                            "31qpi5WRVV2qCqU1UewcVuhG8GCUdoUYHq98J6thTd7f")}
