from datetime import datetime
from typing import List, Union, Any
from pydantic import BaseModel


class UserInformation(BaseModel):
    email: str
    password: Union[str, bytes]
    first_name: str
    last_name: str
    wallet_id: Union[str, bytes]
    bank_account: str
    sort_code: str
    document_number: str
    is_merchant: bool

    class Config:
        orm_mode = True


class UserTableInfo(BaseModel):
    email: str
    password: Union[str, bytes]
    first_name: str
    last_name: str
    wallet_id: Union[str, bytes]
    document_number: str
    is_merchant: bool

    class Config:
        orm_mode = True


class BankAccount(BaseModel):
    user_id: int
    bank_account: str
    sort_code: str
    recipient_code: str
    default: bool


class AlterBankAccount(BaseModel):
    user_id: int
    bank_account: str
    sort_code: str


class Friend(BaseModel):
    email: str


class MerchantTransaction(BaseModel):
    transaction_id: str
    signature: str


class LoginInformation(BaseModel):
    email: str
    password: str

    class Config:
        orm_mode = True


class IssueTransaction(BaseModel):
    # email: str
    # wallet: str
    amount_in_rands: float


class AuditTransactionsRequest(BaseModel):
    offset: int
    limit: int
    first_query_time: datetime


class TradeTransaction(BaseModel):
    coins_to_transfer: float
    # sender_email: str
    recipient_email: str

    # sender_wallet: str
    # recipient_wallet: str
    # TODO[devin]: Timestamp add to all transactions?
    # Probably wanted for auditing purposes?


class CompleteTradeTransaction(BaseModel):
    signature: List[int]
    transaction_bytes: List[int]


class TradeEmailValid(BaseModel):
    email: str


class RedeemTransaction(BaseModel):
    # email: str
    # wallet: str
    amount_in_coins: float


class CompleteRedeemTransaction(BaseModel):
    signature: List[int]
    transaction_bytes: List[int]


class TokenBalance(BaseModel):
    email: str


class TokenResponse(BaseModel):
    access_token: str
    token_type: str


class RegisterDeviceToken(BaseModel):
    device_token: str


class AddAuditorRequest(BaseModel):
    email: str
