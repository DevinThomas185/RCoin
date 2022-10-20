import socket
import bcrypt
import sqlalchemy.orm as orm
import stripe
from fastapi import Depends, FastAPI, Response
from backend.data_models import TradeTransaction

import database_api
import stripe_api
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

# REAL TIME AUDITING
@app.get("/api/audit")
async def audit():
    total_balance = stripe_api.get_total_balance()
    tb = "{:,}".format(total_balance)

    issued_coins = 1 #TODO[Devin] connect with blockchain and get current coins issued (OR WITH DB)
    
    return {"message": "There is R{} in reserve. There are {} coins issued. This is R{} per coin".format(tb, issued_coins, total_balance/issued_coins)}

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
    


# REDEEM
@app.get("/api/test")
async def redeem():
    # Check that user has sufficient balance to redeem

    amount = 400000

    user = stripe.Account.create(
        type = "custom",
        country = "GB",
        email = "kon@group4.com",
        business_type = "individual",
        individual = {
            "first_name": "Konstantinos",
            "last_name": "Koupepas",
            "address": {
                "line1": "Imperial College London",
                "line2": "Exhibition Road",
                "city": "London",
                "country": "GB",
                "postal_code": "SW7 2AZ"
            },
            "dob": {
                "day": 1,
                "month": 1,
                "year": 2000
            },
            "phone": "+44770012345"
        },
        external_account = {
            "object": "bank_account",
            "country": "GB",
            "currency": "gbp",
            "account_holder_name": "Konstantinos Koupepas",
            "routing_number": "108800",
            "account_number": "GB82WEST12345698765432"
        },
        tos_acceptance = {
            "date": int(time.time()),
            "ip": "0.0.0.0"
        },
        capabilities = {
            "card_payments": {"requested": True},
            "transfers": {"requested": True}
        }
    )

    stripe.Transfer.create(
        amount = amount*100,
        currency = "zar",
        destination = user.stripe_account
    )

    payout = stripe.Payout.create(
        amount=amount*100, #TODO[devin]: Get redeem amound from request body
        currency='gbp',
        description="Redeeming {} coins".format(10)
    )

    # Issue blockchain transaction
    blockchain_success = 0

    # Alter databases
    database_success = 0

    if not all([stripe_success, blockchain_success, database_success]):
        # Revert all
        # Return FAILURE
        pass
    else:
        # Return SUCCESS
        pass

    return {"message": "hello"}
