import os
from dotenv import load_dotenv, find_dotenv

load_dotenv(find_dotenv())

dev_state = os.getenv("DEV")

def getenv(variable):
    if dev_state == "True":
        return os.getenv("DEV_" + variable)
    elif dev_state == "False":
        return os.getenv("PROD_" + variable)