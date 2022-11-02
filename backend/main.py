from typing import Any
import bcrypt
from datetime import datetime

from solana_backend.api import (
    get_stablecoin_transactions,
    new_stablecoin_transfer,
    request_create_token_account,
    issue_stablecoins,
    burn_stablecoins,
    get_total_tokens_issued,
    get_user_token_balance,
    get_user_sol_balance,
    send_transaction_from_bytes,
    get_transfer_amount_for_transaction,
)

from solana_backend.response import Success, Failure
import sqlalchemy.orm as orm
from fastapi import Depends, FastAPI, Response
from data_models import (
    CompleteRedeemTransaction,
    LoginInformation,
    TransactionHistoryInformation,
    UserInformation,
    IssueTransaction,
    TradeTransaction,
    RedeemTransaction,
    TokenBalance,
)
import database_api


app = FastAPI()

# Password functions
def hash_password(
    password: str,
) -> bytes:
    bytes = password.encode("utf-8")
    salt = bcrypt.gensalt()
    return bcrypt.hashpw(bytes, salt)


def verify_password(password: str, hashed_password: bytes) -> bool:
    return bcrypt.checkpw(password.encode("utf8"), hashed_password)


# TODO[Devin]: Add return types for these functions

# SIGNUP
@app.post("/api/signup")
async def signup(
    user: UserInformation,
    response: Response,
    db: orm.Session = Depends(database_api.connect_to_DB),
) -> dict[str, Any]:
    try:
        user.password = hash_password(user.password)
        await database_api.create_user(user=user, db=db)
        response.status_code = 200
        return request_create_token_account(user.wallet_id).to_json()
    except:
        response.status_code = 500
        return {}  # TODO[devin]: Catch the explicit exception


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


# AUDIT
@app.get("/api/audit")
async def audit() -> dict[str, Any]:
    resp = get_total_tokens_issued()

    if isinstance(resp, Failure):
        return resp.to_json()

    rands_in_reserve = issued_coins = round(resp.contents, 2)

    return {
        "rand_in_reserve": "{:,.2f}".format(rands_in_reserve),
        "issued_coins": "{:,.2f}".format(issued_coins),
        "rand_per_coin": "{:,.2f}".format(round(rands_in_reserve / issued_coins, 2)),
    }


# AUDIT TRANSACTIONS
@app.get("/api/audit/transactions")
async def auditTransactions(
    db: orm.Session = Depends(database_api.connect_to_DB),
) -> dict:
    transactions = await database_api.get_audit_transactions(
        0, 1000, datetime.now(), db
    )

    print(transactions)
    print("\n")
    return {"transactions": transactions}


# Why is is duplicated?
# AUDIT TABLE
@app.get("/api/transactions")
async def transactions() -> dict[str, Any]:
    resp = get_total_tokens_issued()

    if isinstance(resp, Failure):
        return resp.to_json()

    rands_in_reserve = issued_coins = round(resp.contents, 2)

    return {
        "rand_in_reserve": "{:,.2f}".format(rands_in_reserve),
        "issued_coins": "{:,.2f}".format(issued_coins),
        "rand_per_coin": "{:,.2f}".format(round(rands_in_reserve / issued_coins, 2)),
    }


# TRANSACTION HISTORY
@app.post("/api/transaction_history")
async def transactionHistory(
    transactionHistoryInformation: TransactionHistoryInformation,
    db: orm.Session = Depends(database_api.connect_to_DB),
) -> dict:
    user = await database_api.get_user(email=transactionHistoryInformation.email, db=db)
    wallet_id = user.wallet_id
    return get_stablecoin_transactions(wallet_id).to_json()

# ISSUE
@app.post("/api/issue")
async def issue(
    issue_transaction: IssueTransaction,
    db: orm.Session = Depends(database_api.connect_to_DB),
) -> dict[str, Any]:
    # Get the user from the database #TODO[devin]: Change to session data
    buyer = await database_api.get_user(email=issue_transaction.email, db=db)

    issue_transac = await database_api.create_issue_transaction(
        issue_transaction, database_api.get_dummy_id(), datetime.now(), db
    )

    # Below should be done in a background job once we verify the bank transaction
    # has gone through - not pending

    # 1:1 issuance of Rands to Coins
    coins_to_issue = issue_transaction.amount_in_rands
    response = issue_stablecoins(buyer.wallet_id, coins_to_issue)

    await database_api.complete_issue_transaction(
        issue_transac.id, database_api.get_dummy_id(), db
    )

    return response.to_json()


# TRADE
@app.post("/api/trade")
async def trade(
    trade_transaction: TradeTransaction,
    db: orm.Session = Depends(database_api.connect_to_DB),
) -> dict[str, Any]:
    sender = await database_api.get_user(email=trade_transaction.sender_email, db=db)
    # recipient = await database_api.get_user(email=trade_transaction.recipient_email, db=db)
    return new_stablecoin_transfer(
        sender.wallet_id,
        trade_transaction.coins_to_transfer,
        trade_transaction.recipient_wallet,
    ).to_json()


# REDEEM
@app.post("/api/redeem")
async def redeem(
    redeem_transaction: RedeemTransaction,
    db: orm.Session = Depends(database_api.connect_to_DB),
) -> dict[str, Any]:
    # Get the user from the database #TODO[devin]: Change to session data
    redeemer = await database_api.get_user(email=redeem_transaction.email, db=db)
    return burn_stablecoins(
        redeemer.wallet_id, redeem_transaction.amount_in_coins
    ).to_json()


# [sk4520]: Do we want to wait for the transaction to appear on the blockchain
# and check its health before returning?
@app.post("/api/complete-redeem")
async def complete_redeem(
    transaction: CompleteRedeemTransaction,
    db: orm.Session = Depends(database_api.connect_to_DB),
) -> dict[str, Any]:
    transaction_bytes = bytes(transaction.transaction_bytes)
    resp = send_transaction_from_bytes(transaction_bytes)
    # TODO[szymon] add more robust error handling.
    if isinstance(resp, Failure):
        return resp.to_json()

    amount_resp = get_transfer_amount_for_transaction(resp.contents.value.__str__())

    if isinstance(amount_resp, Failure):
        return amount_resp.to_json()

    await database_api.create_redeem_transaction(
        transaction,
        database_api.get_dummy_id(),
        resp.contents.value.__str__(),
        datetime.now(),
        amount_resp.contents,
        db,
    )

    return amount_resp.to_json()

# GET TOKEN BALANCE
@app.post("/api/get_token_balance")
async def token_balance(
    token_balance: TokenBalance,
    db: orm.Session = Depends(database_api.connect_to_DB),
) -> dict[str, Any]:
    # Get the user from the database #TODO[devin]: Change to session data
    user = await database_api.get_user(email=token_balance.email, db=db)

    token_balance_resp = get_user_token_balance(user.wallet_id)
    if isinstance(token_balance_resp, Failure):
        return token_balance_resp.to_json()

    sol_balance_resp = get_user_sol_balance(user.wallet_id)
    if isinstance(sol_balance_resp, Failure):
        return sol_balance_resp.to_json()

    return {
        "token_balance": token_balance_resp.contents,
        "sol_balance": sol_balance_resp.contents,
    }
