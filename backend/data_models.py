from typing import Union
from pydantic import BaseModel

class UserInformation(BaseModel):
    email: str
    password: Union[str, bytes]
    first_name: str
    last_name: str
    wallet_id: Union[str, bytes]
    bank_account: str
    sort_code: str
    class Config:
        orm_mode = True


class LoginInformation(BaseModel):
    email: str
    password: str

    class Config:
        orm_mode = True


class IssueTransaction(BaseModel):
    email: str
    amount_in_rands: float


class TradeTransaction(BaseModel):
    coins_to_transfer: float
    sender_email: str
    recipient_email: str
    # TODO[devin]: Timestamp add to all transactions?
    # Probably wanted for auditing purposes?


class RedeemTransaction(BaseModel):
    email: str
    amount_in_coins: float