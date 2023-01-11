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
        tokens, title="Deposit Successful", body=f"You deposited {amount} RCoin."
    )


def notify_withdrawn(tokens: List[str], amount: float):
    sendPushNotification(
        tokens, title="Withdrawal Successful", body=f"You withdrew {-amount} RCoin."
    )


def notify_transacted(
    senderTokens: List[str],
    senderEmail: str,
    recieverTokens: List[str],
    receiverEmail: str,
    amount: float,
):
    try:
        sendPushNotification(
            senderTokens,
            title="RCoin Sent",
            body=f"You sent {amount} RCoin to {receiverEmail}.",
        )
        sendPushNotification(
            recieverTokens,
            title="RCoin Received",
            body=f"You received {amount} RCoin from {senderEmail}.",
        )
    except Exception as e:
        print("An error while sending a notification occurred.")
        print(e)
