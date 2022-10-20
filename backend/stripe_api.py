import stripe
from pathlib import Path
import os
from dotenv import load_dotenv

env_path = Path(".") / '.env'
load_dotenv(dotenv_path=env_path)
stripe.api_key = os.getenv("STRIPE_API_KEY")

def get_total_balance() -> float:
    balances = stripe.Balance.retrieve()
    available_balance = balances.available[0].amount / 100
    pending_balance = balances.pending[0].amount / 100
    total_balance = available_balance + pending_balance
    
    return total_balance
