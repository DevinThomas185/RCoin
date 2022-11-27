# import pytest
from dotenv import load_dotenv

from rcoin.solana_backend.response import Success

load_dotenv()

# from mock import patch
from unittest.mock import patch
from rcoin.issue import get_should_issue_stage, ShouldIssueStage
import pytest

from rcoin.database_api import User, Issue

dummy_user = User()


@pytest.mark.anyio
@patch("rcoin.issue.get_user_issue_for_bank_transaction", return_value=None)
async def test_no_database_write(mock_get_user_issue_for_bank_transaction):

    test = await get_should_issue_stage("", dummy_user, None, None)
    assert test == (ShouldIssueStage.Write_Issue_Write, None)


@pytest.mark.anyio
@patch(
    "rcoin.issue.get_user_issue_for_bank_transaction",
    return_value=Issue(blockchain_transaction_id="1234"),
)
async def test_blockchain_transaction_in_db(mock_get_user_issue_for_bank_transaction):

    test = await get_should_issue_stage("", dummy_user, None, None)
    assert test == (ShouldIssueStage.Already_Completed, None)


@pytest.mark.anyio
@patch("rcoin.issue.get_issue_transactions_for_user", return_value=[])
@patch(
    "rcoin.issue.get_stablecoin_transactions",
    return_value=Success("transaction_history", []),
)
@patch("rcoin.issue.get_user_issue_for_bank_transaction", return_value=Issue())
async def test_write_with_no_solana_transaction(
    mock_get_user_issue_for_bank_transaction,
    mock_get_stablecoin_transactions,
    mock_get_issue_transactions_for_user,
):

    res = await get_should_issue_stage("", User(id="1"), None, None)
    assert res == (ShouldIssueStage._Issue_Write, None)


@pytest.mark.anyio
@patch(
    "rcoin.issue.get_issue_transactions_for_user",
    return_value=[Issue()],
)
@patch(
    "rcoin.issue.get_stablecoin_transactions",
    return_value=Success(
        "transaction_history",
        [
            {
                "transaction_type": "deposit",
                "amount": 10,
                "signature": "dummy_sig",
                "sender": "dummy_sender",
                "recipient": "dummy_rec",
            }
        ],
    ),
)
@patch("rcoin.issue.get_user_issue_for_bank_transaction", return_value=Issue())
async def test_write_with_no_matching_solana_transaction(
    mock_get_user_issue_for_bank_transaction,
    mock_get_stablecoin_transactions,
    mock_get_issue_transactions_for_user,
):

    test = await get_should_issue_stage("dummy_is", User(id="1"), 20, None)
    print(test)
    assert test == (ShouldIssueStage._Issue_Write, None)


@pytest.mark.anyio
@patch(
    "rcoin.issue.get_issue_transactions_for_user",
    return_value=[Issue(blockchain_transaction_id="dummy_sig")],
)
@patch(
    "rcoin.issue.get_stablecoin_transactions",
    return_value=Success(
        "transaction_history",
        [
            {
                "transaction_type": "deposit",
                "amount": 20,
                "signature": "dummy_sig",
                "sender": "dummy_sender",
                "recipient": "dummy_rec",
            }
        ],
    ),
)
@patch("rcoin.issue.get_user_issue_for_bank_transaction", return_value=Issue())
async def test_write_with_no_matching_solana_transaction_2(
    mock_get_user_issue_for_bank_transaction,
    mock_get_stablecoin_transactions,
    mock_get_issue_transactions_for_user,
):
    """
    When all the blockchain transactions for a user are already matched up
    """

    test = await get_should_issue_stage("dummy_is", User(id="1"), 20, None)
    print(test)
    assert test == (ShouldIssueStage._Issue_Write, None)


@pytest.mark.anyio
@patch(
    "rcoin.issue.get_issue_transactions_for_user",
    return_value=[Issue()],
)
@patch(
    "rcoin.issue.get_stablecoin_transactions",
    return_value=Success(
        "transaction_history",
        [
            {
                "transaction_type": "deposit",
                "amount": 20,
                "signature": "dummy_sig",
                "sender": "dummy_sender",
                "recipient": "dummy_rec",
            }
        ],
    ),
)
@patch("rcoin.issue.get_user_issue_for_bank_transaction", return_value=Issue())
async def test_write_with_matching_solana_transaction(
    mock_get_user_issue_for_bank_transaction,
    mock_get_stablecoin_transactions,
    mock_get_issue_transactions_for_user,
):

    test = await get_should_issue_stage("dummy_is", User(id="1"), 20, None)
    print(test)
    assert test == (ShouldIssueStage._Write, "dummy_sig")
