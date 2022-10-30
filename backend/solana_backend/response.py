from typing import Any

"""
This module contains an abstraction of a response received from any
api call that is sent to the blockchain. A response can either be
a Success or Failure which wraps around the actual contents of the
response.
"""

SUCCESS = "success"
FAILURE = "failure"

class Response:
    def __init__(self, contents_name: str, contents: Any):
        self.contents_name = contents_name
        self.contents = contents

class Success(Response):
    def to_json(self):
        return {"status": SUCCESS, self.contents_name: self.contents}

    def __str__(self):
        return str(self.to_json())

class Failure(Response):
    def to_json(self):
        return {"status": Failure, self.contents_name: self.contents}

    def __str__(self):
        return str(self.to_json())

class TransactionSuccess(Success):
    def __init__(self, contents):
        super().__init__("transaction_bytes", contents)

    def __str__(self):
        return str(self.to_json())

class TransactionFailure(Failure):
    def __init__(self, contents):
        super().__init__("exception", contents)

    def __str__(self):
        return str(self.to_json())
