# Should load here since this is entry point to system
from dotenv import load_dotenv

from rcoin.solana_backend.common import SIGNER_1, SIGNER_2
import httpx

load_dotenv()

# Standard library imports
import functools
from typing import Any
import bcrypt
from datetime import datetime
import hmac
import hashlib
import os
import json
from jose import JWTError, jwt
import smtplib
import ssl
from email.message import EmailMessage
from datetime import timezone, datetime, timedelta

# Database imports
import sqlalchemy.orm as orm
import rcoin.database_api as database_api
from rcoin.database_api import User

from starlette.middleware.sessions import SessionMiddleware

# Fastapi imports
from fastapi import Depends, FastAPI, Response, Request, HTTPException, status
from fastapi_utils.tasks import repeat_every
from fastapi.security import OAuth2PasswordBearer
from rcoin.data_models import (
    CompleteRedeemTransaction,
    CompleteTradeTransaction,
    LoginInformation,
    TokenResponse,
    TradeEmailValid,
    UserInformation,
    IssueTransaction,
    TradeTransaction,
    RedeemTransaction,
)


# Custom module imports
from rcoin.issue import ShouldIssueStage, get_should_issue_stage
import rcoin.paystack_api as paystack_api
from rcoin.lock import redis_lock
import redis

# Solana backend imports
from rcoin.solana_backend.response import Failure, CustomResponse, Success

import rcoin.solana_backend.api as solana_api

from rcoin.solana_backend.exceptions import UnwrapOnFailureException

# Solana imports
from solana.keypair import Keypair
from solana.transaction import Transaction

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="api/login")
JWT_SECRET = "secret"

SIGNER_BACKEND_URL = str(os.getenv("SIGNER_BACKEND_URL"))

app = FastAPI()

if os.getenv("DEV"):
    r = redis.Redis(host="localhost", port=6379, db=0)
else:
    r = redis.Redis(host="localhost", port=6379, db=0, password=os.getenv("REDIS_PASS"))


def update_reserve_ratio():
    resp = get_total_tokens_issued()
    issued_coins = round(resp.contents, 2)
    rands_in_reserve = paystack_api.check_balance()
    reserve_ratio = rands_in_reserve / issued_coins
    r.set("reserve_ratio", reserve_ratio)


def send_ratio_email():
    ctx = ssl.create_default_context()
    password = os.getenv("GMAIL_PASSWORD")
    sender = "africanmicronation@gmail.com"
    recipient = "africanmicronation@proton.me"

    edited_message = """
    RATIO DROPPED!
    CHECK IMMEDIATELY!
    """

    msg = EmailMessage()
    msg.set_content(edited_message)
    msg["Subject"] = "!!! RATIO DROPPED !!!"
    msg["From"] = sender
    msg["To"] = recipient

    with smtplib.SMTP_SSL("smtp.gmail.com", port=465, context=ctx) as server:
        server.login(sender, password)
        server.send_message(msg)


@app.on_event("startup")
@repeat_every(seconds=60)
def ratio_check() -> None:
    update_reserve_ratio()
    if float(r.get("reserve_ratio")) < 1:
        send_ratio_email()
    print("Checked ratio")


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


def checkReserveRatio(func):
    """Decorator to check reserve ratio ever 10 api calls"""

    def inner(*args, **kwargs):
        reserve_ratio_recalculation_count += 1
        if reserve_ratio_recalculation_count >= 10:
            update_reserve_ratio()
            reserve_ratio_recalculation_count = 0
        if float(r.get("reserve_ratio")) >= 1:
            return func(*args, **kwargs)
        else:
            send_ratio_email()
            return Failure().to_json()

    return inner


@app.post("/api/create-sol-account")
async def create_sol_account():
    kp: Keypair = Keypair.generate()
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
    response: CustomResponse = solana_api.construct_create_account_transaction(
        user.wallet_id
    )

    if isinstance(response, Failure):
        return response.to_json()

    transaction: Transaction = response.unwrap()

    solana_api.sign_transaction(transaction, SIGNER_1)

    response: CustomResponse = solana_api.send_and_confirm_transaction(transaction)

    return response.to_json()


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
    return {
        "access_token": jwt_token,
        "token_type": "bearer",
        "token_info": token.context,
    }


@app.get("/api/user")
async def get_user(user: User = Depends(get_current_user)):
    return {
        "user_id": user.id,
        "email": user.email,
        "name": f"{user.first_name} {user.last_name}",
        "walled_id": user.wallet_id,
    }


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
    resp = solana_api.get_total_tokens_issued()

    if isinstance(resp, Failure):
        return resp.to_json()

    issued_coins = round(resp.contents, 2)
    rands_in_reserve = paystack_api.check_balance()

    # Set global variable used to lock app in emergency
    reserve_ratio = rands_in_reserve / issued_coins
    r.set("reserve_ratio", reserve_ratio)

    return {
        "rand_in_reserve": "{:,.2f}".format(rands_in_reserve),
        "issued_coins": "{:,.2f}".format(issued_coins),
        "rand_per_coin": "{:,.2f}".format(round(reserve_ratio, 2)),
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
    transactions = solana_api.get_stablecoin_transactions(wallet_id).to_json()[
        "transaction_history"
    ]
    for transaction in transactions:
        sender = await database_api.get_user_by_wallet_id(transaction["sender"], db=db)
        recipient = await database_api.get_user_by_wallet_id(
            transaction["recipient"], db=db
        )
        if sender is not None:
            transaction["sender"] = sender.email
        if recipient is not None:
            transaction["recipient"] = recipient.email

    return {"transaction_history": transactions}


@app.post("/api/trade")
@checkReserveRatio
async def trade(
    trade_transaction: TradeTransaction,
    sender: User = Depends(get_current_user),
    db: orm.Session = Depends(database_api.connect_to_DB),
) -> dict[str, Any]:
    recipient = await database_api.get_user(
        email=trade_transaction.recipient_email, db=db
    )

    if recipient is None:
        return Failure(ValueError("Recipient not present in the database!")).to_json()

    response: CustomResponse = solana_api.construct_token_transfer_transaction(
        sender.wallet_id,
        trade_transaction.coins_to_transfer,
        recipient.wallet_id,
    )

    final_response = await handle_transaction_construction_response(response)
    return final_response.to_json()

# REDEEM
@app.post("/api/redeem")
async def redeem(
    redeem_transaction: RedeemTransaction,
    user: User = Depends(get_current_user),
    db: orm.Session = Depends(database_api.connect_to_DB),
) -> dict[str, Any]:
    redeemer = await database_api.get_user(email=user.email, db=db)
    if redeemer is None:
        # return some error
        pass

    response: CustomResponse = solana_api.construct_withdraw_transaction(
        redeemer.wallet_id, redeem_transaction.amount_in_coins
    )

    final_response = await handle_transaction_construction_response(response)
    return final_response.to_json()

async def handle_transaction_construction_response(response: CustomResponse) -> CustomResponse:
    try:
        transaction: Transaction = response.unwrap()
        solana_api.sign_transaction(transaction, SIGNER_1)
        signed_transaction = await get_second_signature(transaction)
        transaction_bytes = solana_api.transaction_to_bytes(signed_transaction)
        return Success("transaction_bytes", transaction_bytes)

    except (UnwrapOnFailureException, Exception) as e:
        print(e)
        return Failure(e)

async def get_second_signature(transaction: Transaction) -> Transaction:
    transaction_bytes = solana_api.transaction_to_bytes(transaction)
    async with httpx.AsyncClient() as client:
        response = await client.post(
                SIGNER_BACKEND_URL + "/api/sign-transaction", json={"transaction_bytes": transaction_bytes}
        )
        signed_transaction_bytes = bytes(response.json()["transaction_bytes"])
        return solana_api.transaction_from_bytes(signed_transaction_bytes)

@app.post("/api/complete-trade")
@checkReserveRatio
async def complete_trade(
    trade_transaction: CompleteTradeTransaction,
    sender: User = Depends(get_current_user),
    db: orm.Session = Depends(database_api.connect_to_DB),
) -> dict[str, Any]:
    signature = bytes(trade_transaction.signature)
    transaction = bytes(trade_transaction.transaction_bytes)

    # Here we expect that the transaction has been successfully processed in the
    # earlier stages of the workflow and already has both required multisig
    # signatures obtained from both servers.
    response = solana_api.add_signature_and_send(transaction, signature, sender.wallet_id)
    return response.to_json()


@app.post("/api/trade-email-valid")
async def is_trade_email_valid(
    email_valid: TradeEmailValid,
    user: User = Depends(get_current_user),
    db: orm.Session = Depends(database_api.connect_to_DB),
):
    email = email_valid.email

    if user.email == email:
        return {"valid": False}

    reciever = await database_api.get_user(email, db)

    if not reciever:
        return {"valid": False}

    return {"valid": True}

# TODO[ks1020]: We need a way of reconciling if this fails
@app.post("/api/complete-redeem")
@checkReserveRatio
async def complete_redeem(
    redeem_transaction: CompleteRedeemTransaction,
    user: User = Depends(get_current_user),
    db: orm.Session = Depends(database_api.connect_to_DB),
) -> dict[str, Any]:
    signature = bytes(redeem_transaction.signature)
    transaction = bytes(redeem_transaction.transaction_bytes)

    resp = solana_api.add_signature_and_send(transaction, signature, user.wallet_id)

    if isinstance(resp, Failure):
        return resp.to_json()

    amount_resp = solana_api.get_transfer_amount_for_transaction(resp.contents)

    if isinstance(amount_resp, Failure):
        return amount_resp.to_json()

    reference = paystack_api.initiate_transfer(
        amount_resp.contents, user.recipient_code, user.wallet_id
    )
    if reference == -1:
        # TODO[devin]: WHAT TO DO WHEN PAYSTACK FAILS - SEND TO FRONTEND
        return {"success": False}

    await database_api.create_redeem_transaction(
        redeem=transaction,
        email=user.email,
        bank_transaction_id=reference,
        blockchain_transaction_id=resp.contents,
        date=datetime.now(),
        amount=amount_resp.contents,
        db=db,
    )

    final_resp = amount_resp.to_json()
    final_resp["transaction_id"] = reference
    return final_resp


# GET BANK ACCOUNTS FOR USER
@app.get("/api/get_bank_accounts")
async def get_bank_accounts(
    user: User = Depends(get_current_user),
) -> list[dict[str, Any]]:

    return {
        "bank_accounts": [
            {
                "bank_account": user.bank_account,
                "sort_code": user.sort_code,
            },
        ]
    }


# GET DEFAULT BANK ACCOUNTS FOR USER
@app.get("/api/get_default_bank_account")
async def get_default_bank_accounts(
    user: User = Depends(get_current_user),
) -> list[dict[str, Any]]:

    return {
        "bank_account": user.bank_account,
        "sort_code": user.sort_code,
    }


@app.get("/api/get_coins_to_issue")
async def get_coins_to_issue_api(
    amount: float,
    user: User = Depends(get_current_user),
    db: orm.Session = Depends(database_api.connect_to_DB),
) -> dict[str, int]:
    return {"coins_to_issue": get_coins_to_issue(amount)}


@app.get("/api/get_rand_to_return")
async def get_rand_to_return_api(
    amount: float,
    user: User = Depends(get_current_user),
    db: orm.Session = Depends(database_api.connect_to_DB),
) -> dict[str, int]:
    return {"rand_to_return": get_rand_to_return(amount)}


# GET AMOUNT OF COINS TO ISSUE
def get_coins_to_issue(
    amount_of_rand: float,
) -> int:
    return int(amount_of_rand)  # TODO[dt120]: Add in trust calculations


# GET AMOUNT OF RAND TO RETURN
def get_rand_to_return(
    amount_in_coins: float,
) -> int:
    return int(amount_in_coins)  # TODO[dt120]: Add in trust calculations


# GET TOKEN BALANCE
@app.get("/api/get_token_balance")
async def token_balance(
    user: User = Depends(get_current_user),
    db: orm.Session = Depends(database_api.connect_to_DB),
) -> dict[str, Any]:

    token_balance_resp = solana_api.get_user_token_balance(user.wallet_id)
    if isinstance(token_balance_resp, Failure):
        return token_balance_resp.to_json()

    sol_balance_resp = solana_api.get_user_sol_balance(user.wallet_id)
    if isinstance(sol_balance_resp, Failure):
        return sol_balance_resp.to_json()

    return {
        "token_balance": token_balance_resp.contents,
        "sol_balance": sol_balance_resp.contents,
    }

@app.post("/api/paystack-webhook")
@from_paystack
async def recieve_issue_webhook(
    request: Request,
    response: Response,
    # user: User = Depends(get_current_user),
    db: orm.Session = Depends(database_api.connect_to_DB),
) -> Any:

    data = await request.json()

    # Issued coins payment
    if data["event"] == "charge.success":
        transaction_id = data["data"]["reference"]
        amount = data["data"]["amount"] / 100

        # Coz of stupid component, doesn't allow us to pass in generic props :(
        user_id = data["data"]["metadata"]["custom_fields"][0]["variable_name"]
        user: User = await database_api.get_user_by_id(user_id, db=db)

        if not user:
            # Got paid and it was not from our app since no user
            # how should we deal with this
            response.status_code = 200
            return "user not found"

        THIRTY_MINUTES = 60 * 30
        # Need to add timeout to other functions like waiting for blockchain
        lock_name = f"{user_id}"  # can we lock on amount too, less coarse?
        async with redis_lock(lock_name, timeout=THIRTY_MINUTES) as lock:

            issue_check = await get_should_issue_stage(transaction_id, user, amount, db)
            if not issue_check:
                response.status_code = 500
                return "failed checking issue stage"

            print(f"issue check returned {issue_check}")

            should_issue, associated_issue = issue_check

            if should_issue == ShouldIssueStage.Already_Completed:
                response.status_code = 200
                return "already done"

            if should_issue == ShouldIssueStage.Write_Issue_Write:
                await database_api.create_issue_transaction(
                    issue=IssueTransaction(amount_in_rands=amount),
                    user_id=user_id,
                    bank_transaction_id=transaction_id,
                    date=datetime.now(),
                    db=db,
                )

            if (
                should_issue == ShouldIssueStage._Issue_Write
                or should_issue == ShouldIssueStage.Write_Issue_Write
            ):
                associated_issue_resp: CustomResponse = solana_api.construct_issue_transaction(
                    user.wallet_id, amount
                )
                if isinstance(associated_issue_resp, Failure):
                    print("issue failed")
                    response.status_code = 500
                    return "not done"

                transaction : Transaction = associated_issue_resp.unwrap()

                solana_api.sign_transaction(transaction , SIGNER_1)
                # Now need to send the partially signed transaction to the signer backend
                # to obtain the second signature.
                transaction = await get_second_signature(transaction)
                solana_response: CustomResponse = solana_api.send_and_confirm_transaction(transaction)

                if isinstance(solana_response, Failure):
                    response.status_code = 500
                    return str(solana_response.contents)

                associated_issue: str = solana_response.unwrap()

            # We always need to complete
            await database_api.complete_issue_transaction(
                transaction_id, associated_issue, db=db
            )

    # If issued, return 200
    response.status_code = 200
    return "done"  # for paystack coz it stoopid


# CHANGE DETAILS
@app.post("/api/change_email", status_code=status.HTTP_200_OK)
async def change_email(
    request: Request,
    response: Response,
    user: User = Depends(get_current_user),
    db: orm.Session = Depends(database_api.connect_to_DB),
) -> None:

    data = await request.json()

    await database_api.change_email(user.id, data["new_email"], db=db)


@app.post("/api/change_name", status_code=status.HTTP_200_OK)
async def change_name(
    request: Request,
    response: Response,
    user: User = Depends(get_current_user),
    db: orm.Session = Depends(database_api.connect_to_DB),
) -> None:

    data = await request.json()

    await database_api.change_name(
        user.id, data["new_first_name"], data["new_last_name"], db=db
    )


# SUPPORT MESSAGE
@app.post("/api/send_message", status_code=status.HTTP_200_OK)
async def sendMessage(
    request: Request,
    response: Response,
    user: User = Depends(get_current_user),
) -> None:
    data = await request.json()

    ctx = ssl.create_default_context()
    password = os.getenv("GMAIL_PASSWORD")
    sender = "africanmicronation@gmail.com"
    recipient = "africanmicronation@proton.me"

    edited_message = """
    {}

    {}
    """.format(
        data["title"], data["message"]
    )

    msg = EmailMessage()
    msg.set_content(edited_message)
    msg.add_header("reply-to", user.email)
    msg["Subject"] = "Support for {} {} {}".format(
        user.first_name,
        user.last_name,
        datetime.now().strftime("at %H:%M:%S on %d/%m/%Y"),
    )
    msg["From"] = sender
    msg["To"] = recipient

    with smtplib.SMTP_SSL("smtp.gmail.com", port=465, context=ctx) as server:
        server.login(sender, password)
        server.send_message(msg)


# remove this when going to prod
@app.get("/api/logs")
async def get_logs():
    with open("logs/logfile.log", "r") as file:
        output = file.read()

    return output


app.add_middleware(SessionMiddleware, secret_key="random-string")
