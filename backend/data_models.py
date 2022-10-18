from pydantic import BaseModel

WalletIDType = str

class UserInformation(BaseModel):
    first_name: str
    last_name: str
    email: str
    account_id: int
    wallet_address: WalletIDType
