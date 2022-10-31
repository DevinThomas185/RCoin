from dotenv import load_dotenv, find_dotenv
import os
import requests
import json

load_dotenv(find_dotenv())

PAYSTACK_SECRET_KEY = os.getenv("PAYSTACK_SECRET_KEY")

def check_balance():
    return requests.get(
        """https://api.paystack.co/balance""",
        headers={
            "Authorization": "Bearer {}".format(PAYSTACK_SECRET_KEY)
        }
    ).json()

def fetch_balance_ledger():
    return requests.get(
        """https://api.paystack.co/balance/ledger""",
        headers={
            "Authorization": "Bearer {}".format(PAYSTACK_SECRET_KEY)
        }
    ).json()

def list_banks(
    currency: str,
):
    return requests.get(
        """https://api.paystack.co/bank""", 
        headers={
            "Authorization": "Bearer {}".format(PAYSTACK_SECRET_KEY)
        },
        params={
            "currency": currency
        }
    ).json()

def list_banks_for_mobile(
    currency: str,
):
    return requests.get(
        """https://api/paystack.co/bank""",
        headers={
            "Authorization": "Bearer {}".format(PAYSTACK_SECRET_KEY)
        },
        params={
            "currency": currency,
            "type": "mobile_money"
        }
    ).json()

def verify_account_ZA(
    bank_code: str,
    country_code: str,
    account_number: str,
    account_name: str,
    document_number: str,
):
    return requests.post(
        """https://api.paystack.co/bank/validate""",
        headers={
            "Authorization": "Bearer {}".format(PAYSTACK_SECRET_KEY),
            "Content-Type": "application/json"
        },
        json={
            "bank_code": bank_code,
            "country_code": country_code,
            "account_number": account_number,
            "account_name": account_name,
            "account_type": "personal",
            "document_type": "identityNumber",
            "document_number": document_number
        }
    ).json()

def verify_account_NG_GH(
    bank_code: str,
    account_number: str,
    currency: str
):
    return requests.get(
        """https://api.paystack.co/bank/resolve""",
        headers={
            "Authorization": "Bearer {}".format(PAYSTACK_SECRET_KEY)
        },
        params={
            "account_number": account_number,
            "bank_code": bank_code,
            "currency": currency
        }
    ).json()

def create_transfer_recipient_by_bank_account(
    bank_type: str,
    name: str,
    account_number: str,
    bank_code: str,
    currency: str,
):
    return requests.post(
        """https://api.paystack.co/transferrecipient""",
        headers={
            "Authorization": "Bearer {}".format(PAYSTACK_SECRET_KEY),
            "Content-Type": "application.json"
        },
        json={
            "type": bank_type,
            "name": name,
            "account_number": account_number,
            "bank_code": bank_code,
            "currency": currency
        }
    ).json()

def create_transfer_recipient_by_mobile_money(
    name: str,
    account_number: str,
    bank_code: str,
    currency: str,
):
    return requests.post(
        """https://api.paystack.co/transferrecipient""",
        headers={
            "Authorization": "Bearer {}".format(PAYSTACK_SECRET_KEY),
            "Content-Type": "application.json"
        },
        json={
            "type": "mobile_money",
            "name": name,
            "account_number": account_number,
            "bank_code": bank_code,
            "currency": currency
        }
    ).json()

def create_transfer_recipient_by_authentication_code(
    name: str,
    email: str,
    authorization_code: str,
):
    return requests.post(
        """https://api.paystack.co/transferrecipient""",
        headers={
            "Authorization": "Bearer {}".format(PAYSTACK_SECRET_KEY),
            "Content-Type": "application/json"
        },
        json={
            "type": "authorization",
            "name": name,
            "email": email,
            "authorization_code": authorization_code
        }
    ).json()

def initiate_transfer(
    amount: float,
    recipient_id: str,
):
    return requests.post(
        """https://api.paystack.co/transfer""",
        headers={
            "Authorization": "Bearer {}".format(PAYSTACK_SECRET_KEY),
            "Content-Type": "application/json"
        },
        json = {
            "source": "balance",
            "amount": str(amount),
            "recipient": recipient_id,
            "reason": "RCoin Payout"
        }
    ).json()


# countries = requests.get("""https://api.paystack.co/country""").json()

# print(json.dumps(list_banks_for_mobile(), indent=2))

# Nigeria
# country_code = "NG"
# currency = "NGN"
# bank_type = "nuban"
# bank_code = "057"

# South Africa
country_code = "ZA"
currency = "ZAR"
bank_type = "basa"
bank_code = "588000"

account_number = "08100000000"
account_name = "Quadam Qualilou"
email = "adam@group4.com"
name = "Quadam"
document_number = "1234567890123"


# print(json.dumps(list_banks(currency=currency), indent=2))
print(json.dumps(verify_account_ZA(bank_code=bank_code, country_code=country_code, account_number=account_number, account_name=account_name, document_number=document_number)))
print(json.dumps(verify_account_NG_GH(bank_code=bank_code, account_number=account_number, currency=currency)))
print(json.dumps(create_transfer_recipient_by_bank_account(bank_type=bank_type, name=name, account_number=account_number, bank_code=bank_code, currency=currency), indent=2))
# print(json.dumps(create_transfer_recipient_by_authentication_code(name=account_name, email=email, authorization_code=authorization_code), indent=2))

print(json.dumps(initiate_transfer(amount=1000, recipient_id=recipient_id), indent=2))

# print(json.dumps(check_balance(), indent=2))
# print(json.dumps(fetch_balance_ledger(), indent=2))
