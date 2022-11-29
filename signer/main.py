from fastapi import FastAPI, Response, Request
from pydantic import BaseModel

app = FastAPI()


class SignTransaction(BaseModel):
    pass


@app.post("/api/sign-transaction")
async def sign(sign_transaction: SignTransaction) -> None:
    return "Hello sir"
