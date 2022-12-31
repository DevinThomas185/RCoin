from dotenv import load_dotenv, find_dotenv
import os
import requests

load_dotenv(find_dotenv())

PAYSTACK_SECRET_KEY = os.getenv("PAYSTACK_SECRET_KEY")


def check_balance():
    response = requests.get(
        """https://api.paystack.co/balance""",
        headers={
            "Authorization": "Bearer {}".format(PAYSTACK_SECRET_KEY),
        },
    ).json()
    if response["status"] == True:
        return response["data"][0]["balance"] / 100
    else:
        raise Exception


def fetch_balance_ledger():
    return requests.get(
        """https://api.paystack.co/balance/ledger""",
        headers={
            "Authorization": "Bearer {}".format(PAYSTACK_SECRET_KEY),
        },
    ).json()


def list_banks(
    currency: str,
):
    return requests.get(
        """https://api.paystack.co/bank""",
        headers={
            "Authorization": "Bearer {}".format(PAYSTACK_SECRET_KEY),
        },
        params={
            "currency": currency,
        },
    ).json()


def list_banks_for_mobile(
    currency: str,
):
    return requests.get(
        """https://api/paystack.co/bank""",
        headers={
            "Authorization": "Bearer {}".format(PAYSTACK_SECRET_KEY),
        },
        params={
            "currency": currency,
            "type": "mobile_money",
        },
    ).json()


def verify_account_ZA(
    bank_code: str,
    account_number: str,
    account_name: str,
    document_number: str,
):
    response = requests.post(
        """https://api.paystack.co/bank/validate""",
        headers={
            "Authorization": "Bearer {}".format(PAYSTACK_SECRET_KEY),
            "Content-Type": "application/json",
        },
        json={
            "bank_code": bank_code,
            "country_code": "ZA",
            "account_number": account_number,
            "account_name": account_name,
            "account_type": "personal",
            "document_type": "identityNumber",
            "document_number": document_number,
        },
    ).json()


def create_transfer_recipient_by_bank_account(
    first_name: str,
    last_name: str,
    account_number: str,
    bank_code: str,
):
    response = requests.post(
        """https://api.paystack.co/transferrecipient""",
        headers={
            "Authorization": "Bearer {}".format(PAYSTACK_SECRET_KEY),
            "Content-Type": "application.json",
        },
        json={
            "type": "basa",
            "name": first_name + " " + last_name,
            "account_number": account_number,
            "bank_code": bank_code,
            "currency": "ZAR",
        },
    ).json()

    if response["status"] == True:
        return response["data"]["recipient_code"]
    else:
        raise Exception


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
            "Content-Type": "application.json",
        },
        json={
            "type": "mobile_money",
            "name": name,
            "account_number": account_number,
            "bank_code": bank_code,
            "currency": currency,
        },
    ).json()


def initiate_transfer(
    amount: float,
    recipient_code: str,
    recipient_wallet_id: str,
):
    response = requests.post(
        """https://api.paystack.co/transfer""",
        headers={
            "Authorization": "Bearer {}".format(PAYSTACK_SECRET_KEY),
            "Content-Type": "application/json",
        },
        json={
            "source": "balance",
            "amount": str(int(amount * 100)),
            "recipient": recipient_code,
            "reason": "RCoin Payout to {}".format(recipient_wallet_id),
        },
    ).json()
    if response["status"] == True:
        return response["data"]["reference"]
    else:
        return -1


def initiate_transaction(
    amount: float,
):
    response = requests.post(
        """https://api.paystack.co/transaction/initialize""",
        headers={
            "Authorization": "Bearer {}".format(PAYSTACK_SECRET_KEY),
            "Content-Type": "application/json",
        },
        json={
            "email": "email@email.com",
            "amount": amount,
            "percentage_charge": 0.2,
        },
    ).json()
    if response["status"] == True:
        url = response["data"]["authorization_url"]
        reference = response["data"]["reference"]
        return url, reference
    else:
        return -1


def verify_transaction(reference: str):
    response = requests.get(
        "https://api.paystack.co/transaction/verify/{}".format(reference),
        headers={
            "Authorization": "Bearer {}".format(PAYSTACK_SECRET_KEY),
        },
    ).json()
    if response["status"] == True:
        return response["data"]["status"]
    else:
        return -1


# url, ref = initiate_transaction(1000)
# print(url)
# for i in range(100):
#     import time

#     time.sleep(2)
#     print(verify_transaction(ref))

# bank_code = "632005"
# account_number = "08100000000"
# document_number = "6809065800086"
