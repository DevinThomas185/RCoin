from datetime import datetime
from solana_backend.api import (
    new_stablecoin_transaction,
    request_create_token_account,
    issue_stablecoins,
    burn_stablecoins,
    get_total_tokens_issued,
    get_token_balance,
    get_sol_balance,
    send_transaction_from_bytes,
)
import bcrypt
import sqlalchemy.orm as orm
from fastapi import Depends, FastAPI, Response
from data_models import (
    CompleteRedeemTransaction,
    LoginInformation,
    UserInformation,
    IssueTransaction,
    TradeTransaction,
    RedeemTransaction,
    TokenBalance,
)
import database_api
import paystack_api

from datetime import datetime

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
) -> None:
    try:
        user.password = hash_password(user.password)
        # verify = paystack_api.verify_account_ZA(
        #     bank_code=user.sort_code,
        #     account_number=user.bank_account, 
        #     account_name=user.first_name + " " + user.last_name,
        #     document_number=user.document_number
        # )
        recipient_code = paystack_api.create_transfer_recipient_by_bank_account(
            bank_type="basa",
            name=user.first_name + " " + user.last_name,
            account_number=user.bank_account,
            bank_code=user.sort_code,
            currency="ZAR"
        )
        user.recipient_code = recipient_code
        await database_api.create_user(user=user, db=db)
        response.status_code = 200
        return {"transaction_bytes": request_create_token_account(user.wallet_id)}
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
async def audit() -> None:
    rands_in_reserve = paystack_api.check_balance()
    issued_coins = round(get_total_tokens_issued(), 2)

    return {
        "rand_in_reserve": "{:,.2f}".format(rands_in_reserve),
        "issued_coins": "{:,.2f}".format(issued_coins),
        "rand_per_coin": "{:,.2f}".format(round(rands_in_reserve / issued_coins, 2)),
    }  # type: ignore


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


# AUDIT TABLE
@app.get("/api/transactions")
async def transactions() -> None:
    rands_in_reserve = issued_coins = round(get_total_tokens_issued(), 2)

    return {"rand_in_reserve": "{:,.2f}".format(rands_in_reserve),
            "issued_coins": "{:,.2f}".format(issued_coins),
            "rand_per_coin": "{:,.2f}".format(round(rands_in_reserve / issued_coins, 2))}


# ISSUE
@app.post("/api/issue")
async def issue(
    issue_transaction: IssueTransaction,
    db: orm.Session = Depends(database_api.connect_to_DB),
) -> None:
    # Get the user from the database #TODO[devin]: Change to session data
    buyer = await database_api.get_user(email=issue_transaction.email, db=db)

    issue_transac = await database_api.create_issue_transaction(
        issue_transaction, database_api.get_dummy_id(), datetime.now(), db
    )

    # Below should be done in a background job once we verify the bank transaction
    # has gone through - not pending

    # 1:1 issuance of Rands to Coins
    coins_to_issue = issue_transaction.amount_in_rands
    issue_stablecoins(buyer.wallet_id, coins_to_issue)

    await database_api.complete_issue_transaction(
        issue_transac.id, database_api.get_dummy_id(), db
    )

    return None


# TRADE
@app.post("/api/trade")
async def trade(
    trade_transaction: TradeTransaction,
    db: orm.Session = Depends(database_api.connect_to_DB),
) -> None:
    sender = await database_api.get_user(email=trade_transaction.sender_email, db=db)
    # recipient = await database_api.get_user(email=trade_transaction.recipient_email, db=db)
    return {
        "transaction_bytes": new_stablecoin_transaction(
            sender.wallet_id,
            trade_transaction.coins_to_transfer,
            trade_transaction.recipient_wallet,
        )
    }


# REDEEM
@app.post("/api/redeem")
async def redeem(
    redeem_transaction: RedeemTransaction,
    db: orm.Session = Depends(database_api.connect_to_DB),
) -> None:
    # Get the user from the database #TODO[devin]: Change to session data
    redeemer = await database_api.get_user(email=redeem_transaction.email, db=db)
    return {
        "transaction_bytes": burn_stablecoins(
            redeemer.wallet_id, redeem_transaction.amount_in_coins
        ),
        "amount": redeem_transaction.amount_in_coins
    }


@app.post("/api/complete-redeem")
async def complete_redeem(
    transaction: CompleteRedeemTransaction,
    db: orm.Session = Depends(database_api.connect_to_DB),
) -> None:
    transaction_bytes = bytes(transaction.transaction_bytes)
    redeemer = await database_api.get_user(email=transaction.email, db=db)
    resp = send_transaction_from_bytes(transaction_bytes)
    reference = paystack_api.initiate_transfer(transaction.amount, redeemer.recipient_code, redeemer.wallet_id)
    if reference == -1:
        # TODO[devin]: WHAT TO DO WHEN PAYSTACK FAILS - SEND TO FRONTEND
        return {"success": False} 
    await database_api.create_redeem_transaction(
        redeem=transaction,
        bank_transaction_id=reference,
        blockchain_transaction_id=resp.value.__str__(),
        date=datetime.now(),
        amount=transaction.amount,
        db=db,
    )
    # assume was successful until szymon refactors
    return {"success": True}


# GET TOKEN BALANCE
@app.post("/api/get_token_balance")
async def token_balance(
    token_balance: TokenBalance,
    db: orm.Session = Depends(database_api.connect_to_DB),
) -> None:
    # Get the user from the database #TODO[devin]: Change to session data
    user = await database_api.get_user(email=token_balance.email, db=db)
    return {
        "token_balance": get_token_balance(user.wallet_id),
        "sol_balance": get_sol_balance(user.wallet_id),
    }
