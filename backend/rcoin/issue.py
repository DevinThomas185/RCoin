from enum import Enum
from typing import Optional, Tuple

from rcoin.database_api import (
    Issue,
    User,
    get_user_issue_for_bank_transaction,
    get_issue_transactions_for_user,
)

# import rcoin.database_api as database_api
from rcoin.solana_backend.api import TransactionType, get_stablecoin_transactions

import time


class ShouldIssueStage(Enum):
    Write_Issue_Write = 0
    _Issue_Write = 1
    _Write = 2
    Already_Completed = 3


# is amount actually a float??
async def get_should_issue_stage(
    transaction_id: str, user: User, amount: float
) -> Optional[Tuple[ShouldIssueStage, Optional[str]]]:
    """gets stage that webhook should continue from for issue

    Returns:
        Tuple[ShouldIssueStage, Optional[str]]: The stage and blockchain response (incase of _Write)
        returns None if failed
    """

    # If this transaction is not in the db, we haven't yet attempted to issue so we are safe to
    issue_write: Optional[Issue] = await get_user_issue_for_bank_transaction(
        user.id, transaction_id
    )
    print(f"issue write is {issue_write}")
    if not issue_write:
        # Just issue normally
        return (ShouldIssueStage.Write_Issue_Write, None)
    else:
        # If it is there we need to consider some cases

        # If the write is there and is associated then it's dealt with and return.
        if issue_write.blockchain_transaction_id != None:
            return (ShouldIssueStage.Already_Completed, None)

        # We need to wait for blockchain to have dealt with it.
        # According to this: https://solanacookbook.com/guides/retrying-transactions.html#handling-dropped-transactions
        # We will spin for 2 minutes, might need to change this

        # TWO_MINUTES = 120
        # time.sleep(TWO_MINUTES)

        # !!! We need to get ALL transactions for a user until a "certain" point, for now 1000
        blockchain_transactions_resp = get_stablecoin_transactions(
            user.wallet_id, 1000
        ).to_json()

        if not blockchain_transactions_resp["success"]:
            print("could not fetch transaction history")
            return None

        # If all transactions are mapped in db, we are free to issue
        blockchain_transactions = blockchain_transactions_resp["transaction_history"]
        blockchain_issue_transactions = filter(
            lambda t: t["transaction_type"] == TransactionType.Deposit,
            blockchain_transactions,
        )

        missing_transactions = []

        database_transactions = await get_issue_transactions_for_user(user.id)

        database_blockchain_ids = set(
            map(lambda t: t.blockchain_transaction_id, database_transactions)
        )

        for issue_transaction in blockchain_issue_transactions:
            if issue_transaction["signature"] not in database_blockchain_ids:
                missing_transactions.append(issue_transaction)

        if missing_transactions == []:
            return (ShouldIssueStage._Issue_Write, None)

        else:
            # If there are missing transactions but not for this ammount, we are free to issue
            same_amount = list(
                filter(lambda t: t["amount"] == amount, missing_transactions)
            )

            # print()

            print(missing_transactions)

            if same_amount == []:
                return (ShouldIssueStage._Issue_Write, None)
            else:
                # If there are missing transactions but for this amount, associate first with this
                return (ShouldIssueStage._Write, same_amount[0]["signature"])
