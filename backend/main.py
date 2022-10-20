from solana_backend.api import (
        new_stablecoin_transaction,
        request_create_token_account,
        issue_stablecoins,
        burn_stablecoins
)
import bcrypt
import sqlalchemy.orm as orm
from fastapi import Depends, FastAPI, Response
from data_models import TradeTransaction

import database_api
import time
from data_models import LoginInformation, UserInformation

app = FastAPI()

# Password functions
def hash_password(
    password: str,
) -> bytes:
    bytes = password.encode('utf-8')
    salt = bcrypt.gensalt()
    return bcrypt.hashpw(bytes, salt)

def verify_password(
    password: str,
    hashed_password: bytes
) -> bool:
    return bcrypt.checkpw(password.encode("utf8"), hashed_password)

#TODO[Devin]: Add return types for these functions

# SIGNUP
@app.post("/api/signup")
async def signup(
    user: UserInformation,
    response: Response,
    db: orm.Session = Depends(database_api.connect_to_DB),
) -> None:
    try:
        user.password=hash_password(user.password)
        await database_api.create_user(user=user, db=db)
        response.status_code = 200
    except: # TODO[devin]: Catch the explicit exception
        response.status_code = 500

# LOGIN
@app.post("/api/login")
async def login(
    login: LoginInformation,
    response: Response,
    db: orm.Session = Depends(database_api.connect_to_DB),
) -> None:
    try:
        match = await database_api.get_user(email=login.email, db=db)
        if match != None and verify_password(login.password, match.password):
            response.status_code = 200
        else:
            response.status_code = 401

    except:  # TODO[devin]: Catch explicit exception
        response.status_code = 500

# ISSUE
@app.post("/api/issue")
async def issue():
    # STRIPE MUST HAVE SUCCEEDED BY NOW

    # Check reserves are enough
    reserve_empty = 0

    if reserve_empty:
        # Return FAILURE
        pass


    # Issue blockchain transaction
    blockchain_success = 0

    # Alter databases
    database_success = 0

    if not all([blockchain_success, database_success]):
        # Revert all
        # Return FAILURE
        pass
    else:
        # Return SUCCESS
        pass

    return None


# TRADE
@app.post("/api/trade")
async def trade(
    trade_transaction: TradeTransaction,
):
    pass


# REDEEM
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