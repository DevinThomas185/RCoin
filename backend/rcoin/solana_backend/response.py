from typing import Any

from rcoin.solana_backend.exceptions import UnwrapOnFailureException

"""
This module contains an abstraction of a response received from any
api call that is sent to the blockchain. A response can either be
a Success or Failure which wraps around the actual contents of the
response.

In case of failure, we expect the contents of the response to be some
sort of an exception which implements the __str__ method that should
contain a user-friendly description of the error.
"""

SUCCESS = "success"
EXCEPTION = "exception"


class CustomResponse:
    def __init__(self, contents_name: str, contents: Any):
        self.contents_name = contents_name
        self.contents = contents

    def to_json(self) -> dict[str, Any]:
        return {}  # To be overridden

    def __str__(self):
        return str(self.to_json())

    def unwrap(self) -> Any:
        pass # To be overridden by inheritors



class Success(CustomResponse):
    def to_json(self) -> dict[str, Any]:
        return {SUCCESS: True, self.contents_name: self.contents}
    def unwrap(self) -> Any:
        return self.contents


class Failure(CustomResponse):
    def __init__(self, contents):
        super().__init__(EXCEPTION, contents)
    def to_json(self) -> dict[str, Any]:
        return {SUCCESS: False, self.contents_name: str(self.contents)}
    def unwrap(self) -> Any:
        raise UnwrapOnFailureException(str(self.to_json()))

"""
Custom Response variant used for common response kinds of responses.
"""

class TransactionConstructionSuccess(Success):
    def __init__(self, contents):
        super().__init__("transaction", contents)

class TransactionConstructionFailure(Failure):
    def __init__(self, contents):
        super().__init__(contents)
