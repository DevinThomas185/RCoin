import based58
from solana.keypair import Keypair
from debug_wrappers import register_user_credentials

private_key = based58.b58decode(b'5QoWyNwMfjEwW912xdGjao5feXTWPMyoDbfF11goJ6tAavahqP8uVGUeXcsby1BuAQ3cxVqGNfprGujg86RaCaCS')
keypair = Keypair.from_secret_key(private_key)

register_user_credentials("token_owner", keypair.public_key, keypair.secret_key)

