import React, {useCallback, useEffect, useState} from 'react';
import {Card, Text, View} from 'react-native-ui-lib';
import {RefreshControl, ScrollView} from 'react-native';
import {useAuth} from '../contexts/Auth';
import style from '../style/style';
import History from './history.json';
import Transaction from '../components/Transaction';
import PendingLoader from '../components/PendingLoader';
import Config from 'react-native-config';

const TransactionHistory = () => {
  const auth = useAuth();
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(false);

  const initArr: any[] = [];
  const [transaction_history, setTransactionHistory] =
    React.useState<any[]>(initArr);

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
        setTransactionHistory(data['transaction_history']);
        console.log(data['transaction_history']);
        setLoading(false);
        // console.log(data);
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
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }>
        {transaction_history.map(transaction => (
          <View key={transaction.signature}>
            <Transaction
              type={transaction.transaction_type}
              rcoin={transaction.amount}
              recipient={transaction.recipient}
              sender={transaction.sender}
              user_email={auth.authData?.token_info.email}
            />
            <View style={style.thinDivider} />
          </View>
        ))}
      </ScrollView>
    );
  }
};

export default TransactionHistory;
