from fastapi import FastAPI
import stripe
from data_models import UserInformation
import external_apis

app = FastAPI()
stripe.api_key = "sk_test_51LtqDCKxXCYYgE1FyOIt9SDyZyW8qJ3IGU6i0DeAc2k0SLNekbCwVwLpnR74g48SSyBAPADZRZEz8UzCdrzeg145005r6zXxcD"

stripe.Balance.retrieve()

#TODO[Devin]: Add return types for these functions

# TEST
@app.get("/api/tests")
async def root():
    balance = "{:,}".format(stripe.Balance.retrieve().available[0].amount / 100)



    return {"message": "There is R{} in the reserve".format(balance)}

# SIGNUP
@app.put("/api/signup")
async def signup():
    return None

# REAL TIME AUDITING
@app.get("/api/audit")
async def audit():
    reserve_balance = stripe.Balance.retrieve()
    issued_coins = 0 #TODO[Devin] connect with blockchain and get current coins issued (OR WITH DB)
    return {
        "message": str({
            "reserve": reserve_balance,
            "issued": issued_coins
        })
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
@app.get("/api/test")
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

    return {"message": str(x)}