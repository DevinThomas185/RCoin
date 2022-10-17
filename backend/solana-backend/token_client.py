from dotenv import load_dotenv
from wallet import create_account, fund_account, get_balance, send_sol



load_dotenv()
description = ''' A cli app which allows for creation of new tokens and accounts.'''

# Create a new solana account
def create(sender_username):
    print(sender_username)
    try:
        public_key = create_account(sender_username)
        if public_key is not None:
            message = "Solana Account created successfully.\n"
            message += "Your account public key is {}".format(public_key)
        else:
            message = "Failed to create account.\n"
        print(message)
    except Exception as e:
        print('error:',e)
        print('Failed to create account')
        return


# Fund the stablecoin account
def fund(sender_username, incoming_msg):
    try:
        amount = float(incoming_msg.split(" ")[1])
        if amount <= 2 :
            print("Requesting {} SOL to your Solana account, please wait !!!".format(amount))
            transaction_id = fund_account(sender_username, amount)
            if transaction_id is not None:
                print("You have successfully requested {} SOL for your Solana account \n".format(
                    amount))
                print("The transaction id is {}".format(transaction_id))
            else:
                print("Failed to fund your Solana account")
        else:
            print("The maximum amount allowed is 2 SOL")

    except Exception as e:
        print('error:',e)
        print('Failed to fund account')
        return


# Check the account balance
def balance(sender_username):
    try:
        data = get_balance(sender_username)
        if data is not None:
            public_key = data['publicKey']
            balance = data['balance']
            message = "Your Solana account {} balance is {} SOL".format(public_key, balance)
        else:
            message = "Failed to retrieve balance"
        print(message)
    except Exception as e:
        print('error:',e)
        print('Failed to check account balance')
        return

# Send SOL to another account
def send(ctx):
    sender_username = ctx.message.author
    incoming_msg = ctx.message.content
    try:
        split_msg = incoming_msg.split(" ")
        amount = float(split_msg[1])
        receiver = split_msg[2]
        message = "Sending {} SOL to {}, please wait !!!".format(
            amount, receiver)
        transaction_id = send_sol(sender_username, amount, receiver)
        if transaction_id is not None:
            message = "You have successfully sent {} SOL to {} \n".format(
                amount, receiver)
            message += "The transaction id is {}".format(transaction_id)
        else:
            message = "Failed to send SOL"
        print(message)
    except Exception as e:
        print('error:',e)
        print('Failed to send SOL')
        return



