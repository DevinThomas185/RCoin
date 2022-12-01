from typing import List
import firebase_admin
from firebase_admin import credentials, messaging
import os
import json

firebase_cred = credentials.Certificate(json.loads(os.getenv("FIREBASE_JSON")))
firebase_app = firebase_admin.initialize_app(firebase_cred)


def sendPushNotification(tokens: List[str], title: str, body: str):
    for token in tokens:
        message = messaging.Message(
            notification=messaging.Notification(title=title, body=body), token=token
        )
        messaging.send(message)


def notify_issued(tokens: List[str], amount: float):
    sendPushNotification(
        tokens, title="Deposit Successful", body=f"You deposited {amount} rand."
    )


def notify_withdrawn(tokens: List[str], amount: float):
    sendPushNotification(
        tokens, title="Withdrawal Successful", body=f"You withdrew {amount} rand."
    )


def notify_transacted(
    senderTokens: List[str],
    senderEmail: str,
    recieverTokens: List[str],
    receiverEmail: str,
    amount: float,
):
    sendPushNotification(
        senderTokens,
        title="Transaction Sent",
        body=f"You sent {amount} RCoin to {receiverEmail}.",
    )
    sendPushNotification(
        recieverTokens,
        title="Transaction Received",
        body=f"You received {amount} RCoin from {senderEmail}.",
    )
