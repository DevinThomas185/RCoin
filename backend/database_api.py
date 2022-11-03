# Database
from datetime import datetime
import sqlalchemy as sql
from sqlalchemy.schema import Sequence
import sqlalchemy.ext.declarative as declarative
import sqlalchemy.orm as orm
import data_models
import uuid
from typing import List, Tuple


def get_dummy_id() -> str:
    # returns dummy id used for mocking things like transactions
    return str(uuid.uuid4())


DB_URL = "postgresql://stablecoin_database:stablecoin@db:5432/stablecoin_database"

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
    email = sql.Column(sql.Text, index=True, unique=True)
    # user_name = sql.Column(sql.Text, index=True, unique=True)
    password = sql.Column(sql.LargeBinary, index=True)
    first_name = sql.Column(sql.Text, index=True)
    last_name = sql.Column(sql.Text, index=True)
    wallet_id = sql.Column(sql.Text, index=True)  # , unique=True)
    bank_account = sql.Column(sql.Text, index=True)
    sort_code = sql.Column(sql.Text, index=True)
    document_number = sql.Column(sql.Text, index=True)
    recipient_code = sql.Column(sql.Text, index=True)


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
    user: data_models.UserInformation,
    db: "Session",
) -> data_models.UserInformation:
    """
    Create a user for the stablecoin

    :param user: The information regarding the user to be saved
    :param db: The database session to utilise
    :return: The user information
    """
    user = User(**user.dict())
    db.add(user)
    db.commit()
    db.refresh(user)
    return data_models.UserInformation.from_orm(user)


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
    user = db.query(User).filter(User.email == email).first()
    return user


# Issue
async def create_issue_transaction(
    issue: data_models.IssueTransaction,
    user_email: str,
    bank_transaction_id: str,
    date: datetime,
    db: "Session",
) -> Issue:
    user = await get_user(email=user_email, db=db)
    # bank_transaction_id = sql.Column(sql.Text, unique=True)
    # blockchain_transaction_id = sql.Column(sql.Text, unique=True)
    # amount = sql.Column(sql.Float)
    # start_date = None
    # end_date = None

    # start date is today
    # end date should be later on
    # we should not take blockchain_transaction as we do not add it immediately.

    issue_transaction = Issue(
        user_id=user.id,
        bank_transaction_id=bank_transaction_id,
        date=date,
        amount=issue.amount_in_rands,
    )

    db.add(issue_transaction)
    db.commit()
    db.refresh(issue_transaction)
    return issue_transaction


async def complete_issue_transaction(
    issue_id: int, blockchain_transaction_id: str, db: "Session"
):
    # We have now issued the coins so should update the corresponding row
    db.query(Issue).filter(Issue.id == issue_id).update(
        {"blockchain_transaction_id": blockchain_transaction_id}
    )
    db.commit()


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


async def get_audit_transactions(
    offset: int, limit: int, query_date: datetime, db: "Session"
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
    return list(res)
