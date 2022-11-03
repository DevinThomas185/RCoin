from typing import Any

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

class Response:
    def __init__(self, contents_name: str, contents: Any):
        self.contents_name = contents_name
        self.contents = contents
    def to_json(self) -> dict[str, Any]:
        return {} # To be overridden
    def __str__(self):
        return str(self.to_json())

class Success(Response):
    def to_json(self) -> dict[str, Any]:
        return {SUCCESS: True, self.contents_name: self.contents}

class Failure(Response):
    def to_json(self) -> dict[str, Any]:
        return {SUCCESS: False, self.contents_name: str(self.contents)}

"""
Custom exception types for reporting the status of the creation of a new
transaction which is then sent to phantom.
"""
class CreateTransactionSuccess(Success):
    def __init__(self, contents):
        super().__init__("transaction_bytes", contents)

class CreateTransactionFailure(Failure):
    def __init__(self, contents):
        super().__init__("exception", contents)
