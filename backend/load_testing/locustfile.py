import time
from dotenv import load_dotenv

load_dotenv()

import random
from locust import HttpUser, task, between

from user_generator import FakeUser
from solana.transaction import Transaction
from solders.transaction import Transaction as SoldersTx
import ed25519
import uuid

import nacl.bindings


class RCoinUser(HttpUser):
    wait_time = between(0.5, 10)

    # @task
    # def hello_world(self):
    #     self.client.get("/api/hello")

    fake_user: FakeUser
    balance: float

    def signup(self):
        res = self.client.post(
            "/api/signup",
            json={
                "email": self.fake_user.email,
                "password": self.fake_user.password,
                "first_name": self.fake_user.first_name,
                "last_name": self.fake_user.last_name,
                "wallet_id": self.fake_user.wallet_id,
                "bank_account": self.fake_user.bank_account,
                "sort_code": self.fake_user.sort_code,
                "document_number": self.fake_user.document_number,
                "recipient_code": self.fake_user.recipient_code,
                "is_merchant": False,
            },
        )

    def login(self):
        with self.client.post(
            "/api/login",
            json={"email": self.fake_user.email, "password": self.fake_user.password},
        ) as response:
            if response.status_code == 200:
                self.login_token = response.json()["access_token"]
            else:
                print("DO SOMETHING??")

    def on_start(self):
        self.fake_user = FakeUser()
        self.balance = 0

        self.signup()
        print("Signed up")
        self.login()
        print("Logged in")

        res = self.client.get(
            "/api/user",
            headers={"Authorization": "Bearer " + self.login_token},
        ).json()

        self.user_id = res["user_id"]

        print("Sleeping for 20 seconds")
        time.sleep(20)

        # amount = random.randint(1, 200)
        # issue_stablecoins(self.fake_user.wallet_id, amount)
        # self.balance += amount
        # print("Issued stablecoins")
        self.deposit()

        print("Sleeping for 10 seconds")
        time.sleep(10)
        print("User setup complete")

    @task(20)
    def get_balance(self):
        self.client.get(
            "/api/get_token_balance",
            headers={"Authorization": "Bearer " + self.login_token},
        )

    @task(20)
    def get_history(self):
        self.client.get(
            "/api/transaction_history",
            headers={"Authorization": "Bearer " + self.login_token},
        )

    @task(1)
    def send(self):
        if self.balance <= 0:
            return

        amount = random.randint(1, self.balance)

        res = self.client.post(
            "/api/trade",
            json={
                "coins_to_transfer": amount,
                "recipient_email": "email@email.com",
            },
            headers={"Authorization": "Bearer " + self.login_token},
        ).json()

        transaction_bytes = bytes(res["transaction_bytes"])

        solderstxn = SoldersTx.from_bytes(transaction_bytes)
        transaction = Transaction.from_solders(solderstxn)

        message = transaction.serialize_message()

        signing_key = ed25519.SigningKey(self.fake_user.secret_key)
        signature = signing_key.sign(message)

        res_2 = self.client.post(
            "/api/complete-trade",
            json={
                "signature": list(signature),
                "transaction_bytes": res["transaction_bytes"],
            },
            headers={"Authorization": "Bearer " + self.login_token},
        ).json()

        if res_2["success"]:
            self.balance -= amount

        print("send response was", res_2)

    @task(1)
    def withdraw(self):
        if self.balance <= 0:
            return

        amount = random.randint(1, self.balance)

        res = self.client.post(
            "/api/redeem",
            json={
                "amount_in_coins": amount,
            },
            headers={"Authorization": "Bearer " + self.login_token},
        ).json()

        transaction_bytes = bytes(res["transaction_bytes"])

        solderstxn = SoldersTx.from_bytes(transaction_bytes)
        transaction = Transaction.from_solders(solderstxn)

        message = transaction.serialize_message()

        signing_key = ed25519.SigningKey(self.fake_user.secret_key)
        signature = signing_key.sign(message)

        res_2 = self.client.post(
            "/api/complete-redeem",
            json={
                "signature": list(signature),
                "transaction_bytes": res["transaction_bytes"],
            },
            headers={"Authorization": "Bearer " + self.login_token},
        ).json()

        if res_2["success"]:
            self.balance -= amount

        print("withdraw response was", res_2)

    # Figure out how to mock paystack, for now just
    # issue tokens

    @task(1)
    def deposit(self):
        amount = random.randint(1, 100)

        json_data = {
            "event": "charge.success",
            "data": {
                "reference": str(uuid.uuid4()),
                "amount": amount * 100,
                "metadata": {"custom_fields": [{"variable_name": self.user_id}]},
            },
        }

        # print(json_data)

        res = self.client.post(
            "/api/paystack-webhook",
            json=json_data,
            headers={"Authorization": "Bearer " + self.login_token},
        )

        time.sleep(30)
        self.balance += amount

        print("deposit response was", res)
