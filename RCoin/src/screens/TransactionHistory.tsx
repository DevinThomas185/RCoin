import React, {useCallback, useEffect, useState} from 'react';
import {Card, Text, View} from 'react-native-ui-lib';
import {RefreshControl, ScrollView} from 'react-native';
import {useAuth} from '../contexts/Auth';
import style from '../style/style';
import Transaction from '../components/Transaction';
import PendingLoader from '../components/PendingLoader';
import Config from 'react-native-config';
import PendingTransaction from '../components/PendingTransaction';

const TransactionHistory = () => {
  const auth = useAuth();
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(false);

  // const initArr: any[] = [];
  const [transaction_history, setTransactionHistory] = useState<{
    [key: string]: any[];
  }>({});

  const [pending_transactions, setPendingTransactions] = useState<any[]>([]);

  const updateTransactionHistory = () => {
    setLoading(true);
    fetch(`${Config.API_URL}:8000/api/transaction_history`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${auth.authData?.token}`,
      },
    })
      .then(res => res.json())
      .then(data => {
        const transactions: {[key: string]: any[]} = {};
        for (let t in data['transaction_history']) {
          let transaction = data['transaction_history'][t];
          let time = new Date(transaction['block_time'] * 1000);
          let date = time.toLocaleString('en-GB', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          });
          if (date in transactions) {
            transactions[date].push(transaction);
          } else {
            transactions[date] = [transaction];
          }
        }
        setTransactionHistory(transactions);
        setPendingTransactions(data['pending_transactions']);
        console.log(data);
        setLoading(false);
      })
      .catch(error => {
        setLoading(false);
        console.log(error);
      });
  };

  useEffect(() => {
    updateTransactionHistory();
  }, []);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    updateTransactionHistory();
    setRefreshing(false);
  }, []);

  if (loading) {
    return (
      <PendingLoader
        loading={loading}
        show={loading}
        response_state={0}
        loading_page_message="Fetching your Transaction History"
        custom_fail_message="Failed to fetch your Transaction History"
      />
    );
  } else {
    return (
      <Card paddingH-10 enableShadow>
        <ScrollView
          contentContainerStyle={{flex: 1}}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }>
          {pending_transactions.length != 0 && (
            <View>
              <Text
                style={{
                  fontWeight: 'bold',
                  color: style.rcoin,
                  fontSize: 20,
                }}>
                Pending Transactions
              </Text>
              {pending_transactions.map(transaction => (
                <View>
                  <View marginV-5>
                    <PendingTransaction
                      type={transaction.type}
                      rcoin={transaction.amount}
                    />
                  </View>
                  {/* <View style={style.thinDivider} /> */}
                </View>
              ))}
            </View>
          )}
          {Object.keys(transaction_history).map((key, _) => (
            <View key={key}>
              <View>
                <Text
                  style={{
                    fontWeight: 'bold',
                    color: style.rcoin,
                    fontSize: 20,
                  }}>
                  {key}
                </Text>
              </View>
              {transaction_history[key].map(transaction => (
                <View key={transaction.signature}>
                  <View marginV-5>
                    <Transaction
                      type={transaction.transaction_type}
                      rcoin={transaction.amount}
                      recipient={transaction.recipient}
                      sender={transaction.sender}
                      user_email={auth.authData?.token_info.email}
                      date_time={transaction.block_time}
                    />
                  </View>
                  {/* <View style={style.thinDivider} /> */}
                </View>
              ))}
              <View style={style.thinDivider} />
            </View>
          ))}
        </ScrollView>
      </Card>
    );
  }
};

export default TransactionHistory;
