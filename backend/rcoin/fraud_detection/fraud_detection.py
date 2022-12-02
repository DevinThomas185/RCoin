import numpy as np
import pandas as pd
import matplotlib.pyplot as plt

from sklearn.model_selection import train_test_split
from sklearn.model_selection import StratifiedKFold
from sklearn.metrics import accuracy_score, recall_score

from xgboost import XGBClassifier
import pickle

SEED = 0
K_FOLDS = 2
 

def read_dataset():
    return pd.read_csv("rcoin/fraud_detection/custom_dataset.csv")
    # return pd.read_csv('custom_dataset.csv')

def save_model(model):
    pickle.dump(model, open("rcoin/fraud_detection/fraud_model.bin", 'wb'))
    # pickle.dump(model, open("fraud_model.bin", 'wb'))

def load_model():
    return pickle.load(open('rcoin/fraud_detection/fraud_model.bin', 'rb'))
    # return pickle.load(open('fraud_model.bin', 'rb'))

class Model():
    __slots__ = [
        "model",
        "__training_columns",
        "__label",
    ]

    def __init__(self, X):
        self.model = XGBClassifier()
        self.__training_columns = None

        self.__preprocess(X, training=True)

    def __preprocess(self, X, y=None, training=False):
        pd.options.mode.chained_assignment = None  # Disable pandas unnecessary warning
        
        categoricals = [i for i in X.columns if X[i].dtypes == 'O']

        for column in categoricals:
            new_columns = pd.get_dummies(X[column])
            X = X.drop(column, axis=1).join(new_columns)

        # Drop the time column so there's no dependency
        if "time" in X.columns:
            X = X.drop("time", axis=1)

        if training:
            self.__training_columns = X.columns
        else:
            X = X.reindex(columns=self.__training_columns, fill_value=0)

        return X, y

    def fit(self, X, y):
        X, y = self.__preprocess(X, y, training=True)
        X, X_test, y, y_test = train_test_split(X, y, test_size=0.2, random_state=SEED)

        folds = StratifiedKFold(n_splits=K_FOLDS)

        for train_i, val_i in folds.split(X, y):
            X_train, y_train = X.iloc[train_i], y.iloc[train_i]
            X_val, y_val = X.iloc[val_i], y.iloc[val_i]

            self.model.fit(X_train, y_train)

            print("Training Accuracy:", self.model.score(X_train, y_train)*100)
            print("Validation Accuracy:", self.model.score(X_val, y_val)*100)

        
        y_pred = self.model.predict(X_test)
        
        print("Test Accuracy:", accuracy_score(y_test, y_pred))
        print("Recall: ", recall_score(y_test, y_pred))
        save_model(self)

    def predict(self, X):
        X, _ = self.__preprocess(X)
        return self.model.predict(X)

    def score(self, X, y):
        X, y = self.__preprocess(X, y)
        return self.model.score(X, y)


def train_model():
    data = read_dataset()[:10000]
    X, y = data.drop('isFraud', axis=1), data["isFraud"]
    model = Model(X)
    model.fit(X, y)


def plot(df, title=""):
    ax = plt.axes()

    ax.set_title(title)
    ax.set_xlabel("Balance Before")
    ax.set_ylabel("Amount")
    
    for i, row in df.iterrows():
        if row['isFraud'] == 0:
            mark = 'o'
            colour = 'g'
        else:
            mark = '^'
            colour = 'r'

        ax.scatter(row['balance_before'], row['amount'], marker=mark, color=colour)

    plt.show()


def csv_check_model(plotting=False):
    tests = pd.read_csv('rcoin/fraud_detection/custom_tests.csv')
    # tests = pd.read_csv('custom_tests.csv')
    X, y = tests.drop('isFraud', axis=1), tests['isFraud']
    
    y_p = check_fraudulent(X)
    
    print("Accuracy:   ", accuracy_score(y, y_p))
    print("Predictions:", y_p)
    print("Actual:     ", y.values)

    if plotting:
        plot(tests, "Test Data")

        plt.show()


def plot_training():
    rows = read_dataset()[:1000]
    # rows = rows[rows['isFraud'] == 1]

    plot(rows, "Training Data")




# train_model()

# THE MODEL TO USE - LOADED FROM FILE
MODEL = load_model()

def check_fraudulent(transaction):
    return MODEL.predict(transaction)


# random_check_model()
# csv_check_model(plotting=True)
# plot_training()
