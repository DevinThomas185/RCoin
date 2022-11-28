import names
import random
import string
from solana.keypair import Keypair
from solana.publickey import PublicKey
import uuid


class FakeUser:
    email: str
    password: str
    first_name: str
    last_name: str
    wallet_id: str
    secret_key: bytes
    bank_account: str
    sort_code: str
    document_number: str
    recipient_code: str

    def __init__(self):
        self.first_name = names.get_first_name()
        self.last_name = names.get_last_name()
        self.email = self.create_email()
        self.password = self.create_password()
        wallet_id, secret_key = self.create_keypair()
        self.wallet_id = wallet_id
        self.secret_key = secret_key
        self.bank_account = "08100000000"
        self.sort_code = "632005"
        self.document_number = "6809065800086"
        self.recipient_code = ""

    def create_email(self):
        extra = "".join(
            random.choice(string.ascii_letters) for _ in range(random.randint(5, 10))
        ) + str(uuid.uuid4())

        return (
            self.first_name
            + "_"
            + self.last_name
            + "_"
            + extra
            + "@docloadtesting.notreal"
        )

    def create_password(self):
        return "password"

    def create_keypair(self):
        kp = Keypair.generate()
        wallet_id = str(kp.public_key)
        return (wallet_id, kp.secret_key)
