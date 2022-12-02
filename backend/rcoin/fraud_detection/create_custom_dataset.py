import names
import random
import threading
import csv
from time import sleep
import numpy as np

class AtomicInteger():
    def __init__(self, value: int) -> None:
        self.__value = value
        self.__lock = threading.Lock()
    
    def set(self, value: int):
        with self.__lock:
            self.__value = value

    def get(self):
        return self.__value

    def __repr__(self) -> str:
        with self.__lock:
            return str(self.__value)

    def __iadd__(self, value: int):
        with self.__lock:
            self.__value += value
            return self

    def __isub__(self, value: int):
        with self.__lock:
            self.__value -= value
            return self
    
    def __le__(self, value: int):
        with self.__lock:
            return self.__value <= value

    def __lt__(self, value: int):
        with self.__lock:
            return self.__value < value

    def __ge__(self, value: int):
        with self.__lock:
            return self.__value >= value  

    def __gt__(self, value: int):
        with self.__lock:
            return self.__value > value

    def __eq__(self, value: int):
        with self.__lock:
            return self.__value == value   
    

class User():
    def __init__(self, id, simulation) -> None:
        self.id = id
        self.simulation = simulation # Simulation
        self.token_balance = AtomicInteger(0)
        self.name = names.get_full_name()
        self.issues = AtomicInteger(0)
        self.trades = AtomicInteger(0)
        self.redeems = AtomicInteger(0)
        self.time_of_last_transaction = 0

    def issue(self):
        pass

    def trade(self):
        pass

    def redeem(self):
        pass

    def run(self):
        pass

    def __repr__(self) -> str:
        return f"{self.name}, R{self.token_balance}, Issues: {self.issues}, Trades: {self.trades}, Redeems: {self.redeems}"


class Transaction():
    def __init__(self, sender: User, receiver: User, amount: int, time: int, balance_before: int, balance_after: int, fraudulent: bool):
        self.sender = sender
        self.receiver = receiver
        self.amount = amount
        self.time = time
        self.balance_before = balance_before
        self.balance_after = balance_after
        self.fraudulent = fraudulent
        self.type = "NONE"

class IssueTransaction(Transaction):
    def __init__(self, sender: User, receiver: User, amount: int, time: int, balance_before: int, balance_after: int, fraudulent=False):
        super().__init__(sender, receiver, amount, time, balance_before, balance_after, fraudulent)
        self.type = "ISSUE"

    def __repr__(self) -> str:
        return f"ISSUE: {self.receiver.name}, R{self.amount}, @{self.time}, {self.fraudulent}"

class TradeTransaction(Transaction):
    def __init__(self, sender: User, receiver: User, amount: int, time: int, balance_before: int, balance_after: int, fraudulent=False):
        super().__init__(sender, receiver, amount, time, balance_before, balance_after, fraudulent)
        self.type = "TRADE"

    def __repr__(self) -> str:
        return f"TRADE: {self.sender.name} -> R{self.amount} -> {self.receiver.name} @{self.time}, {self.fraudulent}"

class RedeemTransaction(Transaction):
    def __init__(self, sender: User, receiver: User, amount: int, time: int, balance_before: int, balance_after: int, fraudulent=False):
        super().__init__(sender, receiver, amount, time, balance_before, balance_after, fraudulent)
        self.type = "REDEEM"

    def __repr__(self) -> str:
        return f"REDEEM: {self.sender.name}, R{self.amount}, @{self.time}, {self.fraudulent}"


POPULATION = 1_172_000
def get_unique_id(user_ids):
    id = random.randint(1, POPULATION)
    while id in user_ids:
        id = random.randint(1, POPULATION)
    return id

class Simulation():
    def __init__(self, legit_users: int, fraudulent_users: int, time_limit: int) -> None:
        self.users: list[User] = []
        self.transactions: list[Transaction] = []
        self.time = AtomicInteger(0)
        self.time_limit = time_limit
        self.transactions_lock = threading.Lock()
        self.issues, self.trades, self.redeems = 0, 0, 0
        self.bank = User(0, self)

        user_ids = set()
        for _ in range(legit_users):
            id = get_unique_id(user_ids)
            self.users.append(LegitimateUser(id=id, simulation=self))

        for _ in range(fraudulent_users):
            id = get_unique_id(user_ids)
            self.users.append(FraudulentUser(id=id, simulation=self))

        # Shuffle the users, so that dataset is not biased 
        random.shuffle(self.users)
        
        self.user_threads: list[threading.Thread] = [threading.Thread(target=user.run) for user in self.users]
    
    def add_transaction(self, transaction: Transaction):
        with self.transactions_lock:
            self.transactions.append(transaction)
            if isinstance(transaction, IssueTransaction):
                self.issues += 1
            elif isinstance(transaction, TradeTransaction):
                self.trades += 1
            elif isinstance(transaction, RedeemTransaction):
                self.redeems += 1

    def issue(self, user: User, amount: int):
        b = user.token_balance.get()
        self.add_transaction(IssueTransaction(sender=self.bank, receiver=user, amount=amount, time=self.time.get(), balance_before=b, balance_after=b+amount, fraudulent=isinstance(user, FraudulentUser)))
        user.token_balance += amount
        user.issues += 1

    def trade(self, sender: User, receiver: User, amount: int):
        b = sender.token_balance.get()
        if b >= amount:
            self.add_transaction(TradeTransaction(sender=sender, receiver=receiver, amount=amount, time=self.time.get(), balance_before=b, balance_after=b-amount, fraudulent=isinstance(sender, FraudulentUser)))
            sender.token_balance -= amount
            receiver.token_balance += amount
            sender.trades += 1

    def redeem(self, user: User, amount: int):
        b = user.token_balance.get()
        if b >= amount:
            self.add_transaction(RedeemTransaction(sender=user, receiver=self.bank, amount=amount, time=self.time.get(), balance_before=b, balance_after=b-amount, fraudulent=isinstance(user, FraudulentUser)))
            user.token_balance -= amount
            user.redeems += 1

    def run(self):        
        for thread in self.user_threads:
            thread.start()

        while self.time < self.time_limit:
            # print(f"Time: {self.time}")
            sleep(0.1)
            self.time += 1

        for thread in self.user_threads:
            thread.join()

    def display(self):
        # print("\nTRANSACTIONS")
        # print(*self.transactions, sep='\n')

        print(f"\nIssues: {self.issues}\nTrades: {self.trades}\nRedeems: {self.redeems}")

        print("\nUSERS")
        print(*self.users, sep='\n')

    def to_csv(self):
        with open("custom_dataset.csv", 'w', newline='') as f:
            writer = csv.writer(f)
            writer.writerow(['time', 'type', 'amount', 'sender', 'balance_before', 'balance_after', 'receiver', 'isFraud'])
            for t in self.transactions:
                time = t.time
                type = t.type
                amount = t.amount
                sender = t.sender.id
                balance_before = t.balance_before
                balance_after = t.balance_after
                receiver = t.receiver.id
                isFraud = 1 if t.fraudulent else 0
                writer.writerow([time, type, amount, sender, balance_before, balance_after, receiver, isFraud])


ISSUE_PERCENT = 5
TRADE_PERCENT = 70
REDEEM_PERCENT = 5
NONE_PERCENT = 100 - ISSUE_PERCENT - TRADE_PERCENT - REDEEM_PERCENT

MIN_ISSUE = 200
MIN_TRADE = 200
MIN_REDEEM = 200

assert(0 <= NONE_PERCENT <= 100)

def get_amount(mean: int, std: int, minimum: int) -> float:
    amount = round(np.random.normal(mean, std))
    # while amount < minimum:
        # amount = round(np.random.normal(mean, std))
    return minimum if amount < minimum else amount
    # return amount

class LegitimateUser(User):
    def __init__(self, id: int, simulation: Simulation) -> None:
        super().__init__(id=id, simulation=simulation)

    def issue(self):
        amount = get_amount(30*MIN_ISSUE, 10000, MIN_ISSUE)
        self.simulation.issue(self, amount)

    def trade(self):
        if self.token_balance > MIN_TRADE:
            amount = get_amount(30*MIN_TRADE, 10000, MIN_TRADE)
            self.simulation.trade(self, random.choice(self.simulation.users), amount)

    def redeem(self):
        if self.token_balance > MIN_REDEEM:
            amount = get_amount(30*MIN_REDEEM, 10000, MIN_REDEEM)
            self.simulation.redeem(self, amount)

    def run(self):
        while self.simulation.time < self.simulation.time_limit:
            t = self.simulation.time.get()
            if t > self.time_of_last_transaction:
                what_to_do = random.choices(
                    [
                        self.issue,
                        self.trade,
                        self.redeem,
                        lambda: None
                    ],
                    weights=[ISSUE_PERCENT, TRADE_PERCENT, REDEEM_PERCENT, NONE_PERCENT],
                    k=1
                )[0]
                what_to_do()
                self.time_of_last_transaction = t

class FraudulentUser(User):
    def __init__(self, id: int, simulation: Simulation) -> None:
        super().__init__(id=id, simulation=simulation)

    def issue(self):
        self.simulation.issue(self, random.randint(10_000, 200_000))

    def trade(self):
        # Random receiver
        receiver = random.choice(list(filter(lambda x: isinstance(x, FraudulentUser), self.simulation.users)))
        
        # Perturb by 10% of balance
        balance = self.token_balance.get()
        perturbance = random.randint(0, round(0.3 * balance))
        self.simulation.trade(self, receiver, balance - perturbance)

    def redeem(self):
        # Perturb by 10% of balance
        balance = self.token_balance.get()
        perturbance = random.randint(0, round(0.3 * balance))
        self.simulation.redeem(self, balance - perturbance)

    def run(self):
        while self.simulation.time < self.simulation.time_limit:
            t = self.simulation.time.get()
            if t > self.time_of_last_transaction:
                x = random.choices([0, 1], [NONE_PERCENT, ISSUE_PERCENT + TRADE_PERCENT + REDEEM_PERCENT], k=1)[0]
                if x == 0:
                    pass
                else:
                    self.issue()
                    self.trade()
                    self.redeem()
                self.time_of_last_transaction = t+2
            

    def __repr__(self) -> str:
        return "Fraud: " + super().__repr__()


# simulation = Simulation(legit_users=97, fraudulent_users=3, time_limit=1000)
# simulation.run()
# simulation.display()
# simulation.to_csv()