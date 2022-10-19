from operator import truediv
from pydantic import BaseModel

class UserInformation(BaseModel):
    email: str
    password: str
    first_name: str
    last_name: str
    wallet_id: str
    bank_account: str
    sort_code: str
    class Config:
        orm_mode = True