import React, { useEffect, useState } from "react";
import { useAuth } from '../../contexts/Auth';
import { Text, View } from 'react-native-ui-lib'
import BalanceFormat from "./BalanceFormat";

const Balance = () => {
    const [token_balance, setTokenBalance] = useState(0.0)
    const [timeUpdated, setTimeUpdated] = useState(0.0)
    const auth = useAuth()

    useEffect(() => {
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

    return (
        <View>
            <Text>Balance</Text>
            <BalanceFormat token_balance={token_balance} />
        </View>
    );
}

export default Balance