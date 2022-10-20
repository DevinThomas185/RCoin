from solana_backend.api import (
        new_stablecoin_transaction,
        request_create_token_account,
        issue_stablecoins,
        burn_stablecoins
)
import bcrypt
import sqlalchemy.orm as orm
from fastapi import Depends, FastAPI, Response
from data_models import IssueTransaction, TradeTransaction, RedeemTransaction

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
        return {"transaction_bytes": request_create_token_account(user.wallet_id)}
    except: 
        return {} # TODO[devin]: Catch the explicit exception

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
async def issue(
    issue_transaction: IssueTransaction,
    db: orm.Session = Depends(database_api.connect_to_DB),
) -> None:
    # Get the user from the database #TODO[devin]: Change to session data
    buyer = await database_api.get_user(email=issue_transaction.email, db=db)

    # 1:1 issuance of Rands to Coins
    coins_to_issue = issue_transaction.amount_in_rands
    return issue_stablecoins(buyer.email, coins_to_issue)

# TRADE
@app.post("/api/trade")
async def trade(
    trade_transaction: TradeTransaction,
    db: orm.Session = Depends(database_api.connect_to_DB)
) -> None:
    sender = await database_api.get_user(email=trade_transaction.sender_email, db=db)
    recipient = await database_api.get_user(email=trade_transaction.recipient_email, db=db)
    return {"transaction_bytes": new_stablecoin_transaction(sender.wallet_id, trade_transaction.coins_to_transfer, recipient.wallet_id)}

# REDEEM
@app.post("/api/redeem")
async def redeem(
    redeem_transaction: RedeemTransaction,
    db: orm.Session = Depends(database_api.connect_to_DB),
) -> None:
    # Get the user from the database #TODO[devin]: Change to session data
    redeemer = await database_api.get_user(email=redeem_transaction.email, db=db)
    return {"transaction_bytes": burn_stablecoins(redeemer.wallet_id, redeem_transaction.amount_in_coins)}
