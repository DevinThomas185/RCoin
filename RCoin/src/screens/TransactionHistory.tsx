import React, { useCallback, useEffect, useState } from 'react';
import { Text, View } from "react-native-ui-lib";
import { RefreshControl, ScrollView } from "react-native"
import { useAuth } from '../contexts/Auth';
import style from '../style/style'
import History from './history.json'
import Transaction from '../components/Transaction'
import Balance from '../components/Balances/Balance';

const TransactionHistory = () => {
    const auth = useAuth();
    const [refreshing, setRefreshing] = useState(false);

    const initArr: any[] = []
    const [transaction_history, setTransactionHistory] = React.useState<any[]>(initArr);
    const [token_balance, setTokenBalance] = useState(0.0);
    const [user_email, set_user_email] = useState("");

    const numberWithCommas = (x: number) => {
        const options = {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        };
        return Number(x).toLocaleString('en', options);
    }

    useEffect(() => {

        fetch('http://10.0.2.2:8000/api/user', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${auth.authData?.token}`,
            },
        })
            .then(res => res.json())
            .then(data => {
                console.log(data['email'])
                set_user_email(data['email']);
            })
            .catch(error => {
                console.log(error);
            });

        fetch('http://10.0.2.2:8000/api/get_token_balance', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${auth.authData?.token}`,
            },
        })
            .then(res => res.json())
            .then(data => {
                setTokenBalance(data['token_balance']);
            })
            .catch(error => {
                console.log(error);
            });
    }, []);

    const updateTransactionHistory = () => {
        fetch('http://10.0.2.2:8000/api/transaction_history', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${auth.authData?.token}`,
            },
        })
            .then(res => res.json())
            .then(data => {
                setTransactionHistory(data["transaction_history"])
                console.log(data["transaction_history"])
                console.log(data)
            })
            .catch(error => {
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


    return (
        <View flex>
            <Balance />
            <Text text50 marginT-20 marginH-30>Transaction History</Text>
            <ScrollView
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                    />
                }
            >
                {transaction_history.map((transaction) => (
                    <View key={transaction.signature}>
                        <Transaction type={transaction.transaction_type} rcoin={-transaction.amount / 1000000000} recipient={transaction.recipient} sender={transaction.sender} user_email={user_email} />
                        <View style={style.thinDivider} />
                    </View>
                ))}
            </ScrollView>
        </View >
    );
}

export default TransactionHistory;