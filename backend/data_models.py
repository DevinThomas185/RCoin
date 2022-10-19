from typing import Union
from pydantic import BaseModel

class UserInformation(BaseModel):
    email: str
    password: Union[str, bytes]
    first_name: str
    last_name: str
    wallet_id: str
    bank_account: str
    sort_code: str
    class Config:
        orm_mode = True


class LoginInformation(BaseModel):
    email: str
    password: str

    class Config:
        orm_mode = True
