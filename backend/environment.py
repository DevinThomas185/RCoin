import os
from dotenv import load_dotenv, find_dotenv

load_dotenv(find_dotenv())

dev_state = os.getenv("DEV")

def getenv(variable):
    if dev_state:
        return os.getenv("DEV_" + variable)
    else:
        return os.getenv("PROD_" + variable)