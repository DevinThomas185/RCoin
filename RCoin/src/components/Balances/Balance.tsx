import React, { useEffect, useState } from "react";
import { useAuth } from '../../contexts/Auth';
import { LoaderScreen, Text, View } from 'react-native-ui-lib';
import BalanceFormat from "./BalanceFormat";
import styles from "../../style/style"
import Ionicons from "react-native-vector-icons/Ionicons"

const Balance = () => {
    const [token_balance, setTokenBalance] = useState(0.0);
    const [timeUpdated, setTimeUpdated] = useState(0.0);
    const [loading, setLoading] = useState(true);
    const auth = useAuth()

    useEffect(() => {
        onRefresh();
    }, []);

    const onRefresh = () => {
        setLoading(true);
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
            setLoading(false);
        })
        .catch(error => {
            console.log(error);
        });
    }

    if (loading) {
        return (
            <View center marginV-20>
                <LoaderScreen message={"Loading Balance"} color={styles.rcoin} />
            </View>
        );
    }
    else {
        return (
            <View center marginV-20>
                <Text>Current RCoin Balance</Text>
                <View row style={{justifyContent: "center", alignItems: "center"}}>
                    <BalanceFormat token_balance={token_balance} />
                    <Ionicons.Button
                        name="refresh-outline"
                        color={styles.rcoin}
                        backgroundColor="none"
                        onPress={onRefresh}
                    />
                </View>
            </View>
        );
    }
}

export default Balance