import functools
from typing import Any
import bcrypt
from datetime import datetime
import hmac
import hashlib
import os
import json
from jose import JWTError, jwt

# import datetime
from datetime import timezone, datetime, timedelta

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
    create_and_fund_solana_account,
    create_token_account,
)

from solana_backend.response import Success, Failure
import sqlalchemy.orm as orm
from starlette.middleware.sessions import SessionMiddleware
from fastapi import Depends, FastAPI, Response, Request, HTTPException, status
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from data_models import (
    CompleteRedeemTransaction,
    LoginInformation,
    TokenResponse,
    UserInformation,
    IssueTransaction,
    TradeTransaction,
    RedeemTransaction,
    TokenBalance,
)
import database_api
from database_api import User
import paystack_api

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="api/login")
JWT_SECRET = "secret"

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


async def get_current_user(
    token: str = Depends(oauth2_scheme),
    db: orm.Session = Depends(database_api.connect_to_DB),
) -> User:
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )

    try:
        payload = jwt.decode(token, JWT_SECRET, algorithms=["HS256"])
        user_id: str = payload.get("context", {}).get("user_id")
        if user_id is None:
            raise credentials_exception
    except JWTError:
        raise credentials_exception

    # TODO[Karim] this get_user_by_id should return None if no user
    user = await database_api.get_user_by_id(id=user_id, db=db)
    if user is None:
        raise credentials_exception
    return user


def from_paystack(func):
    """Decorator for ensuring that a webhook comes from paystack"""

    @functools.wraps(func)
    async def secure_function(*args, **kwargs):
        data = await kwargs["request"].json()

        hash = hmac.new(
            os.getenv("PAYSTACK_SECRET_KEY").encode(),
            msg=json.dumps(data, separators=(",", ":")).encode(),
            digestmod=hashlib.sha512,
        ).hexdigest()

        if hash != kwargs["request"].headers["x-paystack-signature"]:
            kwargs["response"].status_code = 401
            return {"error": "unauthorised"}

        print("from paystack")
        return await func(*args, **kwargs)

    return secure_function


@app.post("/api/create-sol-account")
async def create_sol_account():
    kp = create_and_fund_solana_account(1)
    return {"pk": kp.public_key.__str__(), "sk": kp.secret_key.hex()}


# Do check if already created token account (incase failure)

# SIGNUP
@app.post("/api/signup")
async def signup(
    user: UserInformation,
    db: orm.Session = Depends(database_api.connect_to_DB),
) -> dict[str, Any]:
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
        currency="ZAR",
    )
    user.recipient_code = recipient_code
    await database_api.create_user(user=user, db=db)
    return create_token_account(user.wallet_id).to_json()


# LOGIN


class JwtToken:
    iss = "imperial-server"

    def __init__(self, user_id: str, email: str, name: str):
        current_time = datetime.now(tz=timezone.utc)
        self.iat = current_time
        self.exp = current_time + timedelta(days=31)
        self.jti = ""  # to uniquely identify, empty for now
        self.context = {"user_id": user_id, "email": email, "name": name}

    def get_jwt(self):
        return jwt.encode(self.__dict__, JWT_SECRET, algorithm="HS256")


@app.post("/api/login", response_model=TokenResponse)
async def login(
    login: LoginInformation,
    db: orm.Session = Depends(database_api.connect_to_DB),
) -> None:

    match = await database_api.get_user(email=login.email, db=db)
    if not match or not verify_password(login.password, match.password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )

    # Build the jwt
    token = JwtToken(match.id, match.email, match.first_name)
    jwt_token = token.get_jwt()
    return {"access_token": jwt_token, "token_type": "bearer"}


# LOGOUT
@app.post("/api/logout")
async def logout(request: Request, response: Response):
    if request.session.get("logged_in_email", None):
        request.session.pop("logged_in_email")
        return {"success": True}
    else:
        response.status_code = 401
        return {"error": "not logged in"}


# Auth
@app.post("/api/authenticated")
async def check_authenticated(request: Request):
    if request.session.get("logged_in_email") is None:
        return {"authenticated": False}
    else:
        return {"authenticated": True}


# AUDIT
@app.get("/api/audit")
async def audit() -> dict[str, Any]:
    resp = get_total_tokens_issued()

    if isinstance(resp, Failure):
        return resp.to_json()

    issued_coins = round(resp.contents, 2)
    rands_in_reserve = paystack_api.check_balance()

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


# TRANSACTION HISTORY
@app.get("/api/transaction_history")
async def transactionHistory(
    user: User = Depends(get_current_user),
    db: orm.Session = Depends(database_api.connect_to_DB),
) -> dict:
    wallet_id = user.wallet_id
    return get_stablecoin_transactions(wallet_id).to_json()


# ISSUE
@app.post("/api/issue")
async def issue(
    issue_transaction: IssueTransaction,
    user: User = Depends(get_current_user),
    db: orm.Session = Depends(database_api.connect_to_DB),
) -> dict[str, Any]:
    issue_transac = await database_api.create_issue_transaction(
        issue_transaction, user.email, database_api.get_dummy_id(), datetime.now(), db
    )

    # Below should be done in a background job once we verify the bank transaction
    # has gone through - not pending

    # 1:1 issuance of Rands to Coins
    coins_to_issue = issue_transaction.amount_in_rands
    resp = issue_stablecoins(user.wallet_id, coins_to_issue)

    await database_api.complete_issue_transaction(issue_transac.id, resp.contents, db)

    return resp.to_json()


# TRADE
@app.post("/api/trade")
async def trade(
    trade_transaction: TradeTransaction,
    user: User = Depends(get_current_user),
    db: orm.Session = Depends(database_api.connect_to_DB),
) -> dict[str, Any]:
    sender = await database_api.get_user(email=user.email, db=db)
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
    user: User = Depends(get_current_user),
    db: orm.Session = Depends(database_api.connect_to_DB),
) -> dict[str, Any]:
    redeemer = await database_api.get_user(email=user.email, db=db)
    return burn_stablecoins(
        redeemer.wallet_id, redeem_transaction.amount_in_coins
    ).to_json()


# TODO[sk4520]: Do we want to wait for the transaction to appear on the blockchain
# and check its health before returning?
@app.post("/api/complete-redeem")
async def complete_redeem(
    transaction: CompleteRedeemTransaction,
    user: User = Depends(get_current_user),
    db: orm.Session = Depends(database_api.connect_to_DB),
) -> dict[str, Any]:

    transaction_bytes = bytes(transaction.transaction_bytes)
    redeemer = await database_api.get_user(email=user.email, db=db)
    resp = send_transaction_from_bytes(transaction_bytes)

    # TODO[szymon] add more robust error handling.
    if isinstance(resp, Failure):
        return resp.to_json()

    amount_resp = get_transfer_amount_for_transaction(resp.contents.value.__str__())

    if isinstance(amount_resp, Failure):
        return amount_resp.to_json()

    reference = paystack_api.initiate_transfer(
        amount_resp.contents, redeemer.recipient_code, redeemer.wallet_id
    )
    if reference == -1:
        # TODO[devin]: WHAT TO DO WHEN PAYSTACK FAILS - SEND TO FRONTEND
        return {"success": False}

    await database_api.create_redeem_transaction(
        redeem=transaction,
        email=user.email,
        bank_transaction_id=reference,
        blockchain_transaction_id=resp.contents.value.__str__(),
        date=datetime.now(),
        amount=amount_resp.contents,
        db=db,
    )

    return amount_resp.to_json()


# GET BANK ACCOUNTS FOR USER
@app.get("/api/get_bank_accounts")
async def get_bank_accounts(
    user: User = Depends(get_current_user),
    db: orm.Session = Depends(database_api.connect_to_DB),
) -> list[dict[str, Any]]:

    return [
        {
            "bank_account": user.bank_account,
            "sort_code": user.sort_code,
        },
    ]


@app.get("/api/get_coins_to_issue")
async def get_coins_to_issue_api(
    amount: float,
    user: User = Depends(get_current_user),
    db: orm.Session = Depends(database_api.connect_to_DB),
) -> dict[str, int]:
    return {"coins_to_issue": get_coins_to_issue(amount)}


@app.get("/api/get_rand_to_return")
async def get_coins_to_issue_api(
    amount: float,
    user: User = Depends(get_current_user),
    db: orm.Session = Depends(database_api.connect_to_DB),
) -> dict[str, int]:
    return {"rand_to_return": get_rand_to_return(amount)}


# GET AMOUNT OF COINS TO ISSUE
def get_coins_to_issue(
    amount_of_rand: float,
) -> int:
    return amount_of_rand  # TODO[dt120]: Add in trust calculations


# GET AMOUNT OF RAND TO RETURN
def get_rand_to_return(
    amount_in_coins: float,
) -> int:
    return amount_in_coins  # TODO[dt120]: Add in trust calculations


# GET TOKEN BALANCE
@app.get("/api/get_token_balance")
async def token_balance(
    user: User = Depends(get_current_user),
    db: orm.Session = Depends(database_api.connect_to_DB),
) -> dict[str, Any]:

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


@app.post("/api/webhook")
@from_paystack
async def recieve_issue_webhook(
    request: Request,
    response: Response,
    user: User = Depends(get_current_user),
    db: orm.Session = Depends(database_api.connect_to_DB),
) -> None:

    data = await request.json()

    # Issued coins payment
    if data["event"] == "charge.success":
        transaction_id = data["data"]["reference"]
        amount = data["data"]["amount"] / 100
        metadata = data["data"]["metadata"]

        # If there is already a row, or something, check blockchain, waiting for szymon

        issue_transaction = await database_api.create_issue_transaction(
            IssueTransaction(amount_in_rands=amount),
            user.email,
            bank_transaction_id=transaction_id,
            date=datetime.now(),
            db=db,
        )

        resp = issue_stablecoins(user.wallet_id, amount)

        await database_api.complete_issue_transaction(
            issue_transaction.id, resp.contents, db=db
        )

        print(transaction_id, amount)

    # If issued, return 200
    response.status_code = 200
    return "done"  # for paystack coz it stoopid


app.add_middleware(SessionMiddleware, secret_key="random-string")
