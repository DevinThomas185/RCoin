# Database
from datetime import datetime
import sqlalchemy as sql
from sqlalchemy.schema import Sequence
from sqlalchemy.dialects.sqlite import insert
import sqlalchemy.ext.declarative as declarative
import sqlalchemy.orm as orm
import rcoin.data_models as data_models
import uuid
from typing import List, Optional, Tuple
import os


def get_dummy_id() -> str:
    # returns dummy id used for mocking things like transactions
    return str(uuid.uuid4())


DB_URL = os.getenv("DATABASE_URL")

engine = sql.create_engine(DB_URL)

SessionLocal = orm.sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative.declarative_base()

# Tables
class User(Base):
    __tablename__ = "users"
    id = sql.Column(
        sql.Integer,
        Sequence("user_id_seq", start=1001, increment=1),
        primary_key=True,
        index=True,
        unique=True,
    )
    email = sql.Column(sql.Text, unique=True)
    # user_name = sql.Column(sql.Text, index=True, unique=True)
    password = sql.Column(sql.LargeBinary)
    first_name = sql.Column(sql.Text)
    last_name = sql.Column(sql.Text)
    wallet_id = sql.Column(sql.Text)  # , unique=True)
    document_number = sql.Column(sql.Text)
    trust_score = sql.Column(sql.Float, default=1.05)
    suspended = sql.Column(sql.Boolean, default=False)
    is_merchant = sql.Column(sql.Boolean)


class BankAccount(Base):
    __tablename__ = "bankaccounts"
    id = sql.Column(
        sql.Integer,
        Sequence("bank_account_id_seq", start=1001, increment=1),
        primary_key=True,
        index=True,
        unique=True,
    )
    user_id = sql.Column(sql.Integer, sql.ForeignKey("users.id"))
    bank_account = sql.Column(sql.Text)
    sort_code = sql.Column(sql.Text)
    recipient_code = sql.Column(sql.Text)
    default = sql.Column(sql.Boolean)


class Friend(Base):
    __tablename__ = "friends"
    id = sql.Column(
        sql.Integer,
        Sequence("friends_id_seq", start=1001, increment=1),
        primary_key=True,
        index=True,
        unique=True,
    )
    person_id = sql.Column(sql.Integer, sql.ForeignKey("users.id"))
    friend_id = sql.Column(sql.Integer, sql.ForeignKey("users.id"))


class Device(Base):
    __tablename__ = "device"
    user_id = sql.Column(sql.Integer, sql.ForeignKey("users.id"), primary_key=True)
    device_token = sql.Column(sql.Text, primary_key=True)
    # have device type
    date_registered = sql.Column(sql.DateTime)


class Redeem(Base):
    __tablename__ = "redeem"
    id = sql.Column(
        sql.Integer,
        Sequence("redeem_id_seq", start=1001, increment=1),
        primary_key=True,
        unique=True,
    )
    user_id = sql.Column(sql.Integer, sql.ForeignKey("users.id"))
    bank_transaction_id = sql.Column(sql.Text, unique=True)
    blockchain_transaction_id = sql.Column(sql.Text, unique=True)
    date = sql.Column(sql.DateTime)
    amount = sql.Column(sql.Float)


class Issue(Base):
    __tablename__ = "issue"
    id = sql.Column(
        sql.Integer,
        Sequence("issue_id_seq", start=1001, increment=1),
        primary_key=True,
        unique=True,
    )
    user_id = sql.Column(sql.Integer, sql.ForeignKey("users.id"))
    fraud_id = sql.Column(sql.Integer, sql.ForeignKey("fraud.id"))
    bank_transaction_id = sql.Column(sql.Text, unique=True)
    blockchain_transaction_id = sql.Column(sql.Text, unique=True)
    amount = sql.Column(sql.Float)
    date = sql.Column(sql.DateTime)
    end_date = None


class Fraud(Base):
    __tablename__ = "fraud"
    id = sql.Column(
        sql.Integer,
        Sequence("fraud_id_seq", start=1001, increment=1),
        primary_key=True,
        unique=True,
    )
    bank_transaction_id = sql.Column(sql.Text, unique=True)
    amount_lost = sql.Column(sql.Float)
    date_chargeback = None
    date_solved = None


class RedeemFee(Base):
    __tablename__ = "redeem_fee"
    redeem_id = sql.Column(sql.Integer, sql.ForeignKey("redeem.id"), primary_key=True)
    bank_fee = sql.Column(sql.Float)
    blockchain_fee = sql.Column(sql.Float)
    fee_charged = sql.Column(sql.Float)


class IssueFee(Base):
    __tablename__ = "issue_fee"
    issue_id = sql.Column(sql.Integer, sql.ForeignKey("issue.id"), primary_key=True)
    bank_fee = sql.Column(sql.Float)
    blockchain_fee = sql.Column(sql.Float)
    fee_charged = sql.Column(sql.Float)


# API Functions
def _add_tables():
    return Base.metadata.create_all(bind=engine)


def connect_to_DB():
    """
    Connect to database, adding tables if not already exists
    """
    db = SessionLocal()
    _add_tables()
    try:
        yield db
    finally:
        db.close()


async def create_user(
    user: data_models.UserTableInfo,
    db: "Session",
):
    """
    Create a user for the stablecoin

    :param user: The information regarding the user to be saved
    :param db: The database session to utilise
    :return: The user information
    """
    wid = user.wallet_id
    user = User(**user.dict())
    db.add(user)
    db.commit()
    db.refresh(user)
    db_user = await get_user_by_wallet_id(wallet_id=wid, db=db)
    return db_user.id


async def add_bank_account(
    bank_account: data_models.BankAccount,
    db: "Session",
) -> data_models.BankAccount:
    """
    Add a bank account for a user
    """
    account = BankAccount(**bank_account.dict())
    db.add(account)
    db.commit()
    db.refresh(account)


async def delete_bank_account(
    user_id: str,
    bank_account: str,
    sort_code: str,
    db: "Session",
) -> None:
    db.query(BankAccount).filter(BankAccount.user_id == user_id).filter(
        BankAccount.bank_account == bank_account
    ).filter(BankAccount.sort_code == sort_code).delete()
    db.commit()


async def get_bank_accounts_for_id(
    id: str,
    db: "Session",
) -> List[BankAccount]:
    return (
        db.query(BankAccount)
        .filter(BankAccount.user_id == id)
        .order_by(BankAccount.id)
        .all()
    )


async def get_default_bank_account_for_id(
    id: str,
    db: "Session",
) -> BankAccount:
    return (
        db.query(BankAccount)
        .filter(BankAccount.user_id == id)
        .filter(BankAccount.default == True)
        .first()
    )


async def set_default_bank_account_for_id(
    id: str,
    bank_account: str,
    sort_code: str,
    db: "Session",
) -> None:

    db.query(BankAccount).filter(BankAccount.user_id == id).filter(
        BankAccount.default == True
    ).update({BankAccount.default: False}, synchronize_session=False)

    db.query(BankAccount).filter(BankAccount.user_id == id).filter(
        BankAccount.bank_account == bank_account
    ).filter(BankAccount.sort_code == sort_code).update(
        {BankAccount.default: True}, synchronize_session=False
    )
    db.commit()


async def get_friends_of_id(id: str, db: "Session") -> List[Friend]:
    return (
        db.query(User.id, User.first_name, User.last_name, User.email, User.wallet_id)
        .join(Friend, Friend.friend_id == User.id)
        .filter(Friend.person_id == id)
        .all()
    )


async def get_n_friends_of_id(id: str, n: int, db: "Session") -> List[Friend]:
    return (
        db.query(User.id, User.first_name, User.last_name, User.email)
        .join(Friend, Friend.friend_id == User.id)
        .filter(Friend.person_id == id)
        .limit(n)
        .all()
    )


async def add_friend(person_id: str, friend_id: str, db: "Session") -> None:
    friend_entry = Friend(person_id=person_id, friend_id=friend_id)

    # If not already friends, add friend
    if (
        not db.query(Friend)
        .filter(Friend.person_id == person_id)
        .filter(Friend.friend_id == friend_id)
        .first()
    ):
        db.add(friend_entry)
        db.commit()
        db.refresh(friend_entry)


async def delete_friend(person_id: str, friend_id: str, db: "Session") -> None:
    db.query(Friend).filter(Friend.person_id == person_id).filter(
        Friend.friend_id == friend_id
    ).delete()
    db.commit()


async def get_user_by_id(id: str, db: "Session") -> User:
    return db.query(User).filter(User.id == id).first()


async def get_user_by_wallet_id(wallet_id: str, db: "Session") -> User:
    return db.query(User).filter(User.wallet_id == wallet_id).first()


async def get_user(
    email: str,
    db: "Session",
) -> User:
    """
    Get a user from the database using their email

    :param email: The email of the user to find
    :param db: The database session to utilise
    :return: The user information found
    """
    return db.query(User).filter(User.email == email).first()


# Device
async def add_device_to_user(
    register: data_models.RegisterDeviceToken, user_id: str, db: "Session"
) -> None:
    current_time = datetime.now()
    device = Device(
        device_token=register.device_token,
        user_id=user_id,
        date_registered=current_time,
    )

    statement = (
        insert(Device)
        .values(
            [
                {
                    "device_token": device.device_token,
                    "date_registered": device.date_registered,
                    "user_id": device.user_id,
                }
            ]
        )
        .on_conflict_do_update(
            index_elements=["user_id", "device_token"],
            set_=dict(date_registered=device.date_registered),
        )
    )
    res = db.execute(statement)

    # Remove old account device if exists
    db.query(Device).filter(Device.device_token == register.device_token).filter(
        Device.user_id != user_id
    ).delete()

    db.commit()
    return res


async def get_user_devices(user_id: str, db: "Session") -> Optional[List[Device]]:
    devices = db.query(Device).filter(Device.user_id == user_id)

    return devices


# Issue
async def create_issue_transaction(
    issue: data_models.IssueTransaction,
    user_id: str,
    bank_transaction_id: str,
    date: datetime,
    db: "Session",
) -> Issue:
    # user = await get_user(email=user_email, db=db)
    # bank_transaction_id = sql.Column(sql.Text, unique=True)
    # blockchain_transaction_id = sql.Column(sql.Text, unique=True)
    # amount = sql.Column(sql.Float)
    # start_date = None
    # end_date = None

    # start date is today
    # end date should be later on
    # we should not take blockchain_transaction as we do not add it immediately.

    issue_transaction = Issue(
        user_id=user_id,
        bank_transaction_id=bank_transaction_id,
        date=date,
        amount=issue.amount_in_rands,
    )

    db.add(issue_transaction)
    db.commit()
    db.refresh(issue_transaction)
    return issue_transaction


async def complete_issue_transaction(
    bank_transaction_id: str, blockchain_transaction_id: str, db: "Session"
):
    # We have now issued the coins so should update the corresponding row
    db.query(Issue).filter(Issue.bank_transaction_id == bank_transaction_id).update(
        {"blockchain_transaction_id": blockchain_transaction_id}
    )
    db.commit()


async def get_user_issue_for_bank_transaction(
    user_id: str,
    bank_transaction_id: str,
    db: "Session",
) -> Optional[Issue]:
    issue = (
        db.query(Issue)
        .filter(Issue.user_id == user_id)
        .filter(Issue.bank_transaction_id == bank_transaction_id)
        .first()
    )

    db.commit()
    return issue


async def get_issue_transactions_for_user(
    user_id: str,
    db: "Session",
) -> Optional[List[Issue]]:

    issues = db.query(Issue).filter(Issue.id == user_id)
    db.commit()

    return issues


# Redeem
async def create_redeem_transaction(
    redeem: data_models.CompleteRedeemTransaction,
    email: str,
    bank_transaction_id: str,
    blockchain_transaction_id: str,
    date: datetime,
    amount: float,
    db: "Session",
) -> Redeem:
    user = await get_user(email=email, db=db)

    redeem_transaction = Redeem(
        user_id=user.id,
        bank_transaction_id=bank_transaction_id,
        blockchain_transaction_id=blockchain_transaction_id,
        date=date,
        amount=amount,
    )

    db.add(redeem_transaction)
    db.commit()

    return redeem_transaction


async def get_pending_transactions(
    user_id: int,
    db: "Session",
) -> List[Tuple]:
    """Gets pending transactions for a user"""

    QUERY = """
    SELECT 'redeem' AS type, amount, date
    FROM redeem
    WHERE user_id = :user_id
    AND bank_transaction_id IS NULL
    UNION
    SELECT 'issue' AS type, amount, date 
    FROM issue
    WHERE user_id = :user_id
    AND blockchain_transaction_id IS NULL
    ORDER BY date DESC
    """

    res = db.execute(QUERY, {"user_id": user_id})
    db.commit()
    return list(res)


async def get_audit_transactions(
    offset: int,
    limit: int,
    query_date: datetime,
    db: "Session",
) -> List[Tuple]:
    """Gets sorted (descending) issue and redeem transactions

    Args:
        offset (int): skip the first n rows
        limit (int): maximum number of rows
        query_date (datetime): the date from the initial query,
            ensuring that offset works (if new rows are added later)
        db (Session): db session

    Returns:
        List[Tuple]: [(type, bank_transaction_id, blockchain_transaction_id, amount, date)]
    """

    QUERY = """
    SELECT 'redeem' AS type, bank_transaction_id, blockchain_transaction_id, amount, date 
    FROM redeem
    UNION
    SELECT 'issue' AS type, bank_transaction_id, blockchain_transaction_id, amount, date 
    FROM issue
    WHERE date <= :query_date
    ORDER BY date DESC
    LIMIT :limit OFFSET :offset;
    """

    res = db.execute(
        QUERY, {"query_date": query_date, "limit": limit, "offset": offset}
    )
    db.commit()
    return list(res)


# Change Account Details


async def change_email(
    user_id: int,
    new_email: str,
    db: "Session",
) -> None:
    db.query(User).filter(User.id == user_id).update(
        {User.email: new_email}, synchronize_session=False
    )
    db.commit()


async def change_name(
    user_id: int,
    new_first_name: str,
    new_last_name: str,
    db: "Session",
) -> None:
    db.query(User).filter(User.id == user_id).update(
        {User.first_name: new_first_name, User.last_name: new_last_name},
        synchronize_session=False,
    )
    db.commit()


async def suspend_user(
    user_id: int,
    db: "Session",
) -> None:
    db.query(User).filter(User.id == user_id).update(
        {User.suspended: True}, synchronize_session=False
    )
    db.commit()


async def unsuspend_user(
    user_id: int,
    db: "Session",
) -> None:
    db.query(User).filter(User.id == user_id).update(
        {User.suspended: False}, synchronize_session=False
    )
    db.commit()
