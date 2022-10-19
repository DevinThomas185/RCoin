from fastapi import FastAPI, Depends, HTTPException, Response
import stripe
from data_models import UserInformation
import database_api
import bcrypt
import sqlalchemy.orm as orm

app = FastAPI()
stripe.api_key = "sk_test_51LtqDCKxXCYYgE1FyOIt9SDyZyW8qJ3IGU6i0DeAc2k0SLNekbCwVwLpnR74g48SSyBAPADZRZEz8UzCdrzeg145005r6zXxcD"

stripe.Balance.retrieve()

# Password functions
def hash_password(
    password: str,
) -> str:
    return bcrypt.hashpw(password, bcrypt.gensalt())

def verify_password(
    password: str,
    hashed_password: str
) -> bool:
    return bcrypt.checkpw(password, hashed_password)

#TODO[Devin]: Add return types for these functions

# TEST
@app.get("/api/test")
async def root(
    db: orm.Session = Depends(database_api.connect_to_DB),
):
    balances = stripe.Balance.retrieve()
    available_balance = balances.available[0].amount / 100
    pending_balance = balances.pending[0].amount / 100
    total_balance = available_balance + pending_balance

    ab = "{:,}".format(available_balance)
    pb = "{:,}".format(pending_balance)
    tb = "{:,}".format(total_balance)

    p = "Hello"

    kon = UserInformation(first_name="Kon", last_name="stantinos", email="kon@group4.com", password=hash_password(p), wallet_id="1", bank_account="00012345", sort_code="108800")

    await database_api.create_user(user=kon, db=db)
    user = await database_api.get_user(email="kon@group4.com", db=db)

    if user is None:
        raise HTTPException(status_code=404, detail="User does not exist")

    return {"message": "There is R{} available and R{} unavailable in the reserve. This is R{} in total.".format(ab, pb, tb)}

# SIGNUP
@app.post("/api/signup")
async def signup(
    user: UserInformation,
    response: Response,
    db: orm.Session = Depends(database_api.connect_to_DB),
) -> None:
    try:
        user.password = hash_password(user.password)
        await database_api.create_user(user=user, db=db)
        response.status_code = 200
    except: # TODO[devin]: Catch the explicit exception
        response.status_code = 500

# LOGIN
@app.post("/api/login")
async def login(
    email: str,
    password: str,
    response: Response,
    db: orm.Session = Depends(database_api.connect_to_DB),
) -> None:
    try:
        match = await database_api.get_user(email=email, db=db)
        if verify_password(password, match.password):
            response.status_code = 200
        else:
            response.status_code = 401

    except:
        response.status_code = 500

# REAL TIME AUDITING
@app.get("/api/audit")
async def audit():
    balances = stripe.Balance.retrieve()
    available_balance = balances.available[0].amount / 100
    pending_balance = balances.pending[0].amount / 100
    total_balance = available_balance + pending_balance

    ab = "{:,}".format(available_balance)
    pb = "{:,}".format(pending_balance)
    tb = "{:,}".format(total_balance)

    issued_coins = "0" #TODO[Devin] connect with blockchain and get current coins issued (OR WITH DB)
    
    return {
        "reserve": tb,
        "issued": issued_coins
    }

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
async def trade():
    return None

# REDEEM
@app.get("/api/testx")
async def redeem():
    # Check that user has sufficient balance to redeem

    amount = 400000

    user = stripe.Account.create(
        type = "standard",
        country = "GB",
        email = "kon@group4.com",
        business_type = "individual",
        individual = {
            "first_name": "Konstantinos",
            "last_name": "Koupepas"
        },
        external_account = {
            "object": "bank_account",
            "country": "GB",
            "currency": "gbp",
            "account_holder_name": "Konstantinos Koupepas",
            "routing_number": "108800",
            "account_number": "GB82WEST12345698765432"
        }
    )

    # x = stripe.Account.retrieve(user.id)

    stripe.Transfer.create(
        amount = amount,
        currency = "gbp",
        destination = user.id
    )

    # Issue Stripe payment
    stripe_success = stripe.Payout.create(
        amount=amount, #TODO[devin]: Get redeem amound from request body
        currency='gbp'
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