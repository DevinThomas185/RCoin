# Should load here since this is entry point to system
from dotenv import load_dotenv

from rcoin.solana_backend.common import SIGNER_1
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
import math
import time
import pandas as pd


# import datetime
from datetime import timezone, datetime, timedelta

from rcoin.solana_backend.api import (
    get_recipient_for_trade_transaction,
    get_total_tokens_issued,
    get_transfer_amount_for_transaction,
    get_user_token_balance,
)

from rcoin.solana_backend.response import Success, Failure
import sqlalchemy.orm as orm
import rcoin.database_api as database_api
from rcoin.database_api import User

from starlette.middleware.sessions import SessionMiddleware

# Fastapi imports
from fastapi import Depends, FastAPI, Response, Request, HTTPException, status
from fastapi_utils.tasks import repeat_every
from fastapi.security import OAuth2PasswordBearer
from fastapi.responses import FileResponse
from rcoin.data_models import (
    AddAuditorRequest,
    CompleteRedeemTransaction,
    CompleteTradeTransaction,
    LoginInformation,
    RegisterDeviceToken,
    TokenResponse,
    TradeEmailValid,
    UserInformation,
    UserTableInfo,
    BankAccount,
    AlterBankAccount,
    Friend,
    MerchantTransaction,
    IssueTransaction,
    TradeTransaction,
    AuditTransactionsRequest,
    RedeemTransaction,
)


# Custom module imports
from rcoin.issue import ShouldIssueStage, get_should_issue_stage
import rcoin.paystack_api as paystack_api
from rcoin.lock import redis_lock
from rcoin.mobile_notification import notify_transacted, notify_issued, notify_withdrawn
from rcoin.fraud_detection import fraud_detection
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
    r = redis.Redis(host="redis", port=6379, db=0, password=os.getenv("REDIS_PASS"))

# Set recalculation count to 0
r.set("reserve_ratio_count", 0)


def update_reserve_ratio():
    resp = get_total_tokens_issued()
    issued_coins = round(resp.contents, 2)
    rands_in_reserve = paystack_api.check_balance()
    reserve_ratio = rands_in_reserve / issued_coins
    r.set("reserve_ratio", reserve_ratio)


def send_ratio_email():
    message = """
RATIO DROPPED!
CHECK IMMEDIATELY!
    """
    send_email("!!! RATIO DROPPED !!!", message)


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
    user = await database_api.get_user_by_id(id=user_id)
    if user is None:
        raise credentials_exception
    return user


# DECORATORS
def from_paystack(func):
    """Decorator for ensuring that a webhook comes from paystack"""

    @functools.wraps(func)
    async def secure_function(*args, **kwargs):
        data = await kwargs["request"].json()

        if not (os.getenv("ENV") == "local" or os.getenv("ENV") == "dev"):

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


def not_fraudulent(func):
    """Decorator for ensuring transactions are not fraudulent"""

    @functools.wraps(func)
    async def check_function(*args, **kwargs):

        response = kwargs["response"]
        user = kwargs["user"] if "user" in kwargs else kwargs["sender"]
        assert isinstance(user, User)
        balance = get_user_token_balance(user.wallet_id).contents

        if "issue_transaction" in kwargs:
            data = kwargs["issue_transaction"]
            assert isinstance(data, IssueTransaction)
            assert isinstance(user, User)

            transaction = pd.DataFrame(
                data={
                    "time": [time.time()],
                    "type": ["ISSUE"],
                    "amount": [data.amount_in_rands],
                    "sender": [0],  # ID for us
                    "balance_before": [balance],
                    "balance_after": [balance + data.amount_in_rands],
                    "receiver": [user.id],
                }
            )

        elif "trade_transaction" in kwargs:
            data = kwargs["trade_transaction"]
            assert isinstance(data, TradeTransaction)
            assert isinstance(user, User)
            receiver = await database_api.get_user(data.recipient_email)

            transaction = pd.DataFrame(
                data={
                    "time": [time.time()],
                    "type": ["TRADE"],
                    "amount": [data.coins_to_transfer],
                    "sender": [user.id],
                    "balance_before": [balance],
                    "balance_after": [balance - data.coins_to_transfer],
                    "receiver": [receiver.id],
                }
            )

        elif "redeem_transaction" in kwargs:
            data = kwargs["redeem_transaction"]
            assert isinstance(data, RedeemTransaction)
            assert isinstance(user, User)

            transaction = pd.DataFrame(
                data={
                    "time": [time.time()],
                    "type": ["REDEEM"],
                    "amount": [data.amount_in_coins],
                    "sender": [user.id],
                    "balance_before": [balance],
                    "balance_after": [balance - data.amount_in_coins],
                    "receiver": [0],  # ID for us
                }
            )
        else:
            raise Exception("How did we get here?")

        result = fraud_detection.check_fraudulent(transaction)
        if result == [0]:
            print("NOT FRAUDULENT")
        else:
            print("FRAUDULENT - Sending Email")
            now = datetime.now()
            t = now.strftime("%X")
            date = now.strftime("%A, %x")
            subject = (
                f"POSSIBLE FRAUD: {user.first_name} {user.last_name} at {t} on {date}"
            )
            message = f"""
Details of transaction:

User: {user.first_name} {user.last_name}
User Email: {user.email}

Transaction: {transaction["type"][0]}
Amount: {"R" if isinstance(data, IssueTransaction) else "RCoin "} {transaction["amount"][0]}

{"Recipient: " + receiver.first_name + " " + receiver.last_name if isinstance(data, TradeTransaction) else ""}
{"Recipient Email: " + receiver.email if isinstance(data, TradeTransaction) else ""}

Time: {t}
Date: {date}
            """
            response.status_code = 409
            database_api.suspend_user(user.id)
            send_email(subject, message, user.email)
            return {"status": "fraud"}

        return await func(*args, **kwargs)

    return check_function


def not_suspended(func):
    """Decorator for ensuring that a user is not currently suspended"""

    @functools.wraps(func)
    async def check_function(*args, **kwargs):
        user = kwargs["user"] if "user" in kwargs else kwargs["sender"]
        assert isinstance(user, User)

        if user.suspended:
            return  # Do not continue if suspended

        return await func(*args, **kwargs)

    return check_function


def checkReserveRatio(func):
    """Decorator to check reserve ratio ever 10 api calls"""

    @functools.wraps(func)
    async def inner(*args, **kwargs):
        current_count = int(r.get("reserve_ratio_count"))
        if current_count >= 10:
            update_reserve_ratio()
            r.set("reserve_ratio_count", 0)
        else:
            r.set("reserve_ratio_count", current_count + 1)

        if float(r.get("reserve_ratio")) >= 1:
            return await func(*args, **kwargs)
        else:
            send_ratio_email()
            return Failure("all transactions paused").to_json()

    return inner


@app.post("/api/create-sol-account")
async def create_sol_account():
    kp: Keypair = Keypair.generate()
    return {"pk": kp.public_key.__str__(), "sk": kp.secret_key.hex()}


@app.post("/api/register-device-token")
async def device_token(
    register_device_token: RegisterDeviceToken,
    user: User = Depends(get_current_user),
):
    await database_api.add_device_to_user(register_device_token, user.id)
    # What to return
    return {}


# Do check if already created token account (incase failure)

# SIGNUP
@app.post("/api/signup")
async def signup(
    user: UserInformation,
) -> dict[str, Any]:
    # verify = paystack_api.verify_account_ZA(
    #     bank_code=user.sort_code,
    #     account_number=user.bank_account,
    #     account_name=user.first_name + " " + user.last_name,
    #     document_number=user.document_number
    # )

    # recipient_code = paystack_api.create_transfer_recipient_by_bank_account(
    #     first_name=user.first_name,
    #     last_name=user.last_name,
    #     account_number=user.bank_account,
    #     bank_code=user.sort_code,
    # )

    recipient_code = "RCP_8j93r6ejwxpektt"

    temp = UserTableInfo.parse_obj(
        {
            "email": user.email,
            "password": user.password,
            "first_name": user.first_name,
            "last_name": user.last_name,
            "wallet_id": user.wallet_id,
            "document_number": user.document_number,
            "is_merchant": user.is_merchant,
        }
    )
    temp.password = hash_password(user.password)

    db_user_id = await database_api.create_user(user=temp)

    bank_account = BankAccount.parse_obj(
        {
            "user_id": db_user_id,
            "bank_account": user.bank_account,
            "sort_code": user.sort_code,
            "recipient_code": recipient_code,
            "default": True,
        }
    )

    await database_api.add_bank_account(bank_account=bank_account)

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

    def __init__(
        self,
        user_id: str,
        email: str,
        name: str,
        trust_score: float,
        suspended: bool,
        is_merchant: bool,
    ):
        current_time = datetime.now(tz=timezone.utc)
        self.iat = current_time
        self.exp = current_time + timedelta(days=31)
        self.jti = ""  # to uniquely identify, empty for now
        self.context = {
            "user_id": user_id,
            "email": email,
            "name": name,
            "trust_score": trust_score,
            "suspended": suspended,
            "is_merchant": is_merchant,
        }

    def get_jwt(self):
        return jwt.encode(self.__dict__, JWT_SECRET, algorithm="HS256")


@app.post("/api/login", response_model=TokenResponse)
async def login(
    login: LoginInformation,
) -> None:

    match = await database_api.get_user(email=login.email)
    if not match or not verify_password(login.password, match.password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )

    # Build the jwt
    token = JwtToken(
        user_id=match.id,
        email=match.email,
        name=match.first_name,
        trust_score=match.trust_score,
        suspended=match.suspended,
        is_merchant=match.is_merchant,
    )
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
        "trust_score": user.trust_score,
        "suspended": user.suspended,
        "walled_id": user.wallet_id,
        "is_merchant": user.is_merchant,
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

DEFAULT_INITIAL_AUDIT_TRANSACTIONS = 20


@app.get("/api/audit/transactions")
async def auditTransactions() -> dict:
    transactions = await database_api.get_audit_transactions(
        0, DEFAULT_INITIAL_AUDIT_TRANSACTIONS, datetime.now()
    )

    print(transactions)
    print("\n")
    return {"transactions": transactions}


@app.post("/api/audit/more_transactions")
async def moreAuditTransactions(
    audit_transactions_request: AuditTransactionsRequest,
) -> dict:
    transactions = await database_api.get_audit_transactions(
        audit_transactions_request.offset,
        audit_transactions_request.limit,
        audit_transactions_request.first_query_time,
    )
    print(transactions)
    print("\n")
    return {"transactions": transactions}


# TRANSACTION HISTORY
@app.get("/api/transaction_history")
async def transactionHistory(
    user: User = Depends(get_current_user),
) -> dict:
    wallet_id = user.wallet_id
    transaction_history = solana_api.get_stablecoin_transactions(wallet_id).to_json()[
        "transaction_history"
    ]
    for transaction in transaction_history:
        sender = await database_api.get_user_by_wallet_id(transaction["sender"])
        recipient = await database_api.get_user_by_wallet_id(transaction["recipient"])
        if sender is not None:
            transaction["sender"] = sender.email
        if recipient is not None:
            transaction["recipient"] = recipient.email

    pending_transactions = await database_api.get_pending_transactions(user_id=user.id)

    return {
        "transaction_history": transaction_history,
        "pending_transactions": pending_transactions,
    }


@app.post("/api/trade")
@not_fraudulent
@not_suspended
@checkReserveRatio
async def trade(
    trade_transaction: TradeTransaction,
    response: Response,
    sender: User = Depends(get_current_user),
) -> dict[str, Any]:
    recipient = await database_api.get_user(email=trade_transaction.recipient_email)

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
@not_fraudulent
@not_suspended
@checkReserveRatio
async def redeem(
    redeem_transaction: RedeemTransaction,
    response: Response,
    user: User = Depends(get_current_user),
) -> dict[str, Any]:
    redeemer = await database_api.get_user(email=user.email)
    if redeemer is None:
        # return some error
        pass

    response: CustomResponse = solana_api.construct_withdraw_transaction(
        redeemer.wallet_id, redeem_transaction.amount_in_coins
    )

    final_response = await handle_transaction_construction_response(response)
    return final_response.to_json()


async def handle_transaction_construction_response(
    response: CustomResponse,
) -> CustomResponse:
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
            SIGNER_BACKEND_URL + "/api/sign-transaction",
            json={"transaction_bytes": transaction_bytes},
        )
        signed_transaction_bytes = bytes(response.json()["transaction_bytes"])
        return solana_api.transaction_from_bytes(signed_transaction_bytes)


@app.post("/api/complete-trade")
@not_suspended
@checkReserveRatio
async def complete_trade(
    trade_transaction: CompleteTradeTransaction,
    sender: User = Depends(get_current_user),
) -> dict[str, Any]:
    signature = bytes(trade_transaction.signature)
    transaction = bytes(trade_transaction.transaction_bytes)

    # Here we expect that the transaction has been successfully processed in the
    # earlier stages of the workflow and already has both required multisig
    # signatures obtained from both servers.
    res = solana_api.add_signature_and_send(transaction, signature, sender.wallet_id)

    recipient_res = get_recipient_for_trade_transaction(str(res.to_json()["signature"]))

    if isinstance(recipient_res, Failure):
        return recipient_res.to_json()

    recipient_wallet = str(recipient_res.contents)

    recipient_user: User = await database_api.get_user_by_wallet_id(recipient_wallet)

    sender_devices = await database_api.get_user_devices(sender.id)
    reciever_devices = await database_api.get_user_devices(recipient_user.id)

    sender_tokens = list(map(lambda d: d.device_token, sender_devices))
    reciever_tokens = list(map(lambda d: d.device_token, reciever_devices))

    amount_resp = get_transfer_amount_for_transaction(res.contents)

    if isinstance(amount_resp, Failure):
        return amount_resp.to_json()

    notify_transacted(
        sender_tokens,
        sender.email,
        reciever_tokens,
        recipient_user.email,
        abs(amount_resp.contents),
    )

    return res.to_json()


@app.post("/api/trade-email-valid")
async def is_trade_email_valid(
    email_valid: TradeEmailValid,
    user: User = Depends(get_current_user),
):
    email = email_valid.email

    if user.email == email:
        return {"valid": False}

    reciever = await database_api.get_user(email)

    if not reciever:
        return {"valid": False}

    return {"valid": True}


# TODO[ks1020]: We need a way of reconciling if this fails
@app.post("/api/complete-redeem")
@not_suspended
@checkReserveRatio
async def complete_redeem(
    redeem_transaction: CompleteRedeemTransaction,
    user: User = Depends(get_current_user),
) -> dict[str, Any]:
    signature = bytes(redeem_transaction.signature)
    transaction = bytes(redeem_transaction.transaction_bytes)

    resp = solana_api.add_signature_and_send(transaction, signature, user.wallet_id)

    if isinstance(resp, Failure):
        return resp.to_json()

    amount_resp = solana_api.get_transfer_amount_for_transaction(resp.contents)

    if isinstance(amount_resp, Failure):
        return amount_resp.to_json()

    default_bank_account = await database_api.get_default_bank_account_for_id(user.id)

    reference = paystack_api.initiate_transfer(
        abs(float(amount_resp.contents)),
        default_bank_account.recipient_code,
        user.wallet_id,
    )

    if reference == -1:
        # TODO[devin]: WHAT TO DO WHEN PAYSTACK FAILS - SEND TO FRONTEND
        return {
            "success": False,
            "default_bank_account": default_bank_account,
            "amount": amount_resp.contents,
        }

    await database_api.create_redeem_transaction(
        redeem=transaction,
        email=user.email,
        bank_transaction_id=reference,
        blockchain_transaction_id=resp.contents,
        date=datetime.now(),
        amount=amount_resp.contents,
    )

    devices = await database_api.get_user_devices(user.id)
    device_tokens = list(map(lambda d: d.device_token, devices))
    notify_withdrawn(device_tokens, amount_resp.contents)

    final_resp = amount_resp.to_json()
    final_resp["transaction_id"] = reference
    return final_resp


# GET BANK ACCOUNTS FOR USER
@app.get("/api/get_bank_accounts")
async def get_bank_accounts(
    user: User = Depends(get_current_user),
) -> list[dict[str, Any]]:

    return {"bank_accounts": await database_api.get_bank_accounts_for_id(id=user.id)}


@app.post("/api/add_bank_account")
async def add_bank_account(
    bank_account: BankAccount,
    user: User = Depends(get_current_user),
) -> None:

    recipient_code = paystack_api.create_transfer_recipient_by_bank_account(
        first_name=user.first_name,
        last_name=user.last_name,
        account_number=bank_account.bank_account,
        bank_code=bank_account.sort_code,
    )

    bank_account.recipient_code = recipient_code

    await database_api.add_bank_account(bank_account=bank_account)


@app.post("/api/delete_bank_account")
async def delete_bank_accounts(
    bank_account: AlterBankAccount,
) -> None:
    await database_api.delete_bank_account(
        user_id=bank_account.user_id,
        bank_account=bank_account.bank_account,
        sort_code=bank_account.sort_code,
    )


# GET DEFAULT BANK ACCOUNTS FOR USER
@app.get("/api/get_default_bank_account")
async def get_default_bank_account(
    user: User = Depends(get_current_user),
) -> list[dict[str, Any]]:

    bank_account = await database_api.get_default_bank_account_for_id(id=user.id)

    return {
        "bank_account": bank_account.bank_account,
        "sort_code": bank_account.sort_code,
    }


@app.post("/api/set_default_bank_account")
async def set_default_bank_account(
    bank_account: AlterBankAccount,
) -> None:
    await database_api.set_default_bank_account_for_id(
        id=bank_account.user_id,
        bank_account=bank_account.bank_account,
        sort_code=bank_account.sort_code,
    )


#### FRIENDS
@app.get("/api/get_friends")
async def get_friends(
    user: User = Depends(get_current_user),
) -> list[dict[str, Any]]:
    return {"friends": await database_api.get_friends_of_id(id=user.id)}


@app.get("/api/get_n_friends")
async def get_friends(
    n: int,
    user: User = Depends(get_current_user),
) -> list[dict[str, Any]]:
    return {"friends": await database_api.get_n_friends_of_id(id=user.id, n=n)}


@app.post("/api/add_friend")
async def add_friend(
    friend: Friend,
    response: Response,
    user: User = Depends(get_current_user),
) -> list[dict[str, Any]]:
    friend = await database_api.get_user(friend.email)
    if not friend:
        response.status_code = 500
    else:
        await database_api.add_friend(person_id=user.id, friend_id=friend.id)
        response.status_code = 200


@app.post("/api/delete_friend")
async def delete_friend(
    friend: Friend,
    response: Response,
    user: User = Depends(get_current_user),
) -> list[dict[str, Any]]:
    friend = await database_api.get_user(friend.email)
    if not friend:
        response.status_code = 500
    else:
        await database_api.delete_friend(person_id=user.id, friend_id=friend.id)
        response.status_code = 200


#### TRUST CALCULATIONS ON ISSUE AND WITHDRAW
@app.get("/api/get_trust_score")
async def get_trust_score(
    user: User = Depends(get_current_user),
) -> list[dict[str, Any]]:
    # TODO[devin]: DO NOT REVEAL TO THE USER THEIR TRUST SCORES
    return user.trust_score


# GET AMOUNT OF RAND TO PAY - ISSUE
@app.get("/api/get_rand_to_pay")
async def get_coins_to_issue_api(
    amount: float,
    user: User = Depends(get_current_user),
) -> dict[str, float]:
    return {"rand_to_pay": get_rand_to_pay(amount, user)}


def get_rand_to_pay(
    amount_in_coins: float,
    user: User,
) -> float:
    # def receive_after_fee(a):
    #     a *= 100
    #     c = 0 if a < 1000 else 100
    #     return math.ceil((a - (1.15 * (math.ceil(0.029 * a) + c))) / 100)

    res = amount_in_coins
    # after_fee = receive_after_fee(res)
    # while after_fee < amount_in_coins:
    #     res += 1
    #     after_fee = receive_after_fee(res)

    return res * user.trust_score


# GET AMOUNT OF RAND TO RETURN - REDEEM
@app.get("/api/get_rand_to_return")
async def get_rand_to_return_api(
    amount: float,
    user: User = Depends(get_current_user),
) -> dict[str, float]:
    return {"rand_to_return": get_rand_to_return(amount)}


def get_rand_to_return(
    amount_in_coins: float,
) -> float:
    return amount_in_coins


# GET A NEW TRANSACTION ID FOR A MERCHANT TRANSACTION
@app.get("/api/create_merchant_transaction")
async def get_merchant_transaction_api(
    amount: float,
    user: User = Depends(get_current_user),
) -> dict[str, str]:
    s = []
    s.append(user.email + "X")
    s.append(str(amount))
    s.append("X")
    s.append(datetime.now().strftime("%H:%M:%S"))
    code = "".join(s)
    transaction_id = "".join(str(ord(c)) for c in code)[::-1]
    mydict = {
        "transaction_id": transaction_id,
        "merchant": user.email,
        "amount": amount,
        "complete": "false",
        "signature": "null",
    }
    rval = json.dumps(mydict)
    r.set(transaction_id, rval)

    return {"transaction_id": transaction_id}


def wait_for_transaction_in_redis(id):
    max_wait = 10

    count = 0
    while not r.exists(id) and count < max_wait:
        time.sleep(1)

    return r.exists(id)


@app.get("/api/merchant_transaction_status")
async def merchant_transaction_status_api(
    transaction_id: str,
    user: User = Depends(get_current_user),
) -> dict[str, str]:

    exists = wait_for_transaction_in_redis(transaction_id)
    if not exists:
        return {"complete": "false, transaction cannot be found in time"}

    data = r.get(transaction_id)
    print("data from get end: " + str(data))
    # result = json.loads(str(data))
    result = json.loads(data)
    print("data from get end: " + str(result))

    return {"complete": result["complete"]}
    # else:
    #     for key in r.scan_iter():
    #         print("IMPORTANT!! key is " + key)
    #     return {"complete" : "false, transaction cannot be found"}


@app.get("/api/complete_merchant_transaction")
async def complete_merchant_transaction_api(
    transaction_id: str,
    user: User = Depends(get_current_user),
) -> dict[str, str]:
    print("trans_id from get end: " + transaction_id)
    id = transaction_id[2:]

    exists = wait_for_transaction_in_redis(id)
    if not exists:
        return {"complete": "false, transaction cannot be found in time"}

    if r.exists(id):
        data = r.get(id)
        print("data from get end: " + str(data))
        print("why does this work then" + str(data))
        result = json.loads(data.decode("utf8").replace("'", '"'))
        print("data from get end: " + str(result))
        return {"merchant": result["merchant"], "amount": result["amount"]}
    else:
        for key in r.scan_iter():
            print("IMPORTANT!! key is " + str(key))
        return {"merchant": "nothing", "amount": "more nothing"}


# AFTER SENDER SIGNS THE TRANSACTION, SENDER UPDATAES THE REDIS
@app.post("/api/sign_merchant_transaction")
async def sign_merchant_transaction(mt: MerchantTransaction) -> dict[str, Any]:

    transaction_id = mt.transaction_id
    signature = mt.signature

    exists = wait_for_transaction_in_redis(transaction_id)
    if not exists:
        return {"complete": "false, transaction cannot be found in time"}

    print("tid: ", transaction_id)

    data = r.get(transaction_id)
    print("data from get end: " + str(data))
    # result = json.loads(str(data))
    result = json.loads(data)

    print("before" + str(data))

    mydict = {
        "transaction_id": result["transaction_id"],
        "merchant": result["merchant"],
        "amount": result["amount"],
        "complete": "true",
        "signature": signature,
    }
    rval = json.dumps(mydict)
    r.set(transaction_id, rval)

    data = r.get(transaction_id)
    print("data from get end: " + str(data))
    # result = json.loads(str(data))
    result = json.loads(data)

    print("after" + str(data))

    return {"success": True}


# GET TOKEN BALANCE
@app.get("/api/get_token_balance")
async def token_balance(
    user: User = Depends(get_current_user),
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
# @from_paystack
async def recieve_issue_webhook(
    request: Request,
    response: Response,
    # user: User = Depends(get_current_user),
) -> Any:

    data = await request.json()

    # Issued coins payment
    if data["event"] == "charge.success":
        transaction_id = data["data"]["reference"]
        # amount = data["data"]["amount"] / 100
        # amount = amount / 1.05

        # Coz of stupid component, doesn't allow us to pass in generic props :(
        metadata = str(data["data"]["metadata"]["custom_fields"][0]["variable_name"])
        metadata = metadata.split("X")

        # Expected metadata length
        if len(metadata) != 2:
            response.status_code = 200
            raise ValueError(
                f"Old webhook - respond and ignore. Metadata was {metadata}"
            )

        user_id = metadata[0]
        amount = float(metadata[1])

        user: User = await database_api.get_user_by_id(user_id)

        if not user:
            # Got paid and it was not from our app since no user
            # how should we deal with this
            response.status_code = 200
            return "user not found"

        THIRTY_MINUTES = 60 * 30
        # Need to add timeout to other functions like waiting for blockchain
        lock_name = f"{user_id} {amount}"
        async with redis_lock(lock_name, timeout=THIRTY_MINUTES) as lock:

            issue_check = await get_should_issue_stage(transaction_id, user, amount)
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
                )

            if (
                should_issue == ShouldIssueStage._Issue_Write
                or should_issue == ShouldIssueStage.Write_Issue_Write
            ):
                associated_issue_resp: CustomResponse = (
                    solana_api.construct_issue_transaction(user.wallet_id, amount)
                )
                if isinstance(associated_issue_resp, Failure):
                    print("issue failed")
                    response.status_code = 500
                    return "not done"

                transaction: Transaction = associated_issue_resp.unwrap()

                solana_api.sign_transaction(transaction, SIGNER_1)
                # Now need to send the partially signed transaction to the signer backend
                # to obtain the second signature.
                transaction = await get_second_signature(transaction)
                solana_response: CustomResponse = (
                    solana_api.send_and_confirm_transaction(transaction)
                )

                if isinstance(solana_response, Failure):
                    response.status_code = 500
                    return str(solana_response.contents)

                associated_issue: str = solana_response.unwrap()

            # We always need to complete
            await database_api.complete_issue_transaction(
                transaction_id, associated_issue
            )

        devices = await database_api.get_user_devices(user_id)
        device_tokens = list(map(lambda d: d.device_token, devices))
        notify_issued(device_tokens, amount)

    # If issued, return 200
    response.status_code = 200
    return "done"  # for paystack coz it stoopid


# CHANGE DETAILS
@app.post("/api/change_email", status_code=status.HTTP_200_OK)
async def change_email(
    request: Request,
    response: Response,
    user: User = Depends(get_current_user),
) -> None:

    data = await request.json()

    await database_api.change_email(user.id, data["new_email"])


@app.post("/api/change_name", status_code=status.HTTP_200_OK)
async def change_name(
    request: Request,
    response: Response,
    user: User = Depends(get_current_user),
) -> None:

    data = await request.json()

    await database_api.change_name(
        user.id, data["new_first_name"], data["new_last_name"]
    )


# SUPPORT MESSAGE
@app.post("/api/send_message", status_code=status.HTTP_200_OK)
async def send_support_message(
    request: Request,
    user: User = Depends(get_current_user),
) -> None:
    data = await request.json()

    edited_message = """
{}

{}
    """.format(
        data["title"], data["message"]
    )

    subject = "Support for {} {} {}".format(
        user.first_name,
        user.last_name,
        datetime.now().strftime("at %H:%M:%S on %d/%m/%Y"),
    )

    send_email(subject, edited_message, user.email)


def send_email(subject: str, message: str, reply_to=None) -> None:
    ctx = ssl.create_default_context()
    password = os.getenv("GMAIL_PASSWORD")
    sender = "africanmicronation@gmail.com"
    recipient = "africanmicronation@proton.me"

    msg = EmailMessage()
    msg.set_content(message)
    if reply_to is not None:
        msg.add_header("reply-to", reply_to)
    msg["Subject"] = subject
    msg["From"] = sender
    msg["to"] = recipient

    # Actual Emailing disabled for now

    # with smtplib.SMTP_SSL("smtp.gmail.com", port=465, context=ctx) as server:
    #     server.login(sender, password)
    #     server.send_message(msg)


# remove this when going to prod
@app.get("/api/error-log")
async def get_logs():
    with open("logs/error.log", "r") as file:
        output = file.read()

    return output


@app.get("/api/access-log")
async def get_logs():
    with open("logs/access.log", "r") as file:
        output = file.read()

    return output


@app.post("/api/add-auditor")
async def add_auditor(req: AddAuditorRequest, response: Response):
    success = paystack_api.invite_user_to_audit(req.email, r)

    if not success:
        response.status_code = 500


@app.get("/api/download_release_build")
async def download_release_build():
    return FileResponse(path="./app-release.apk", filename="RCoin")


app.add_middleware(SessionMiddleware, secret_key="random-string")
