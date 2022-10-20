# Database
import sqlalchemy as sql
import sqlalchemy.ext.declarative as declarative
import sqlalchemy.orm as orm
import data_models


DB_URL = "postgresql://stablecoin_database:stablecoin@db:5432/stablecoin_database"
engine = sql.create_engine(DB_URL)

SessionLocal = orm.sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative.declarative_base()

# Tables
class User(Base):
    __tablename__ = "users"
    email = sql.Column(sql.Text, primary_key=True, index=True, unique=True)
    password = sql.Column(sql.LargeBinary, index=True)
    first_name = sql.Column(sql.Text, index=True)
    last_name = sql.Column(sql.Text, index=True)
    wallet_id = sql.Column(sql.Text, index=True)
    bank_account = sql.Column(sql.Text, index=True)
    sort_code = sql.Column(sql.Text, index=True)


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


async def create_user (
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


async def get_user (
    email: str,
    db: "Session",
) -> data_models.UserInformation:
    """
    Get a user from the database using their email

    :param email: The email of the user to find
    :param db: The database session to utilise
    :return: The user information found
    """
    user = db.query(User).filter(User.email == email).first()
    return user