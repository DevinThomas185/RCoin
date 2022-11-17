import React, { useEffect, useState } from "react";
import { View, Image, LoaderScreen } from "react-native-ui-lib";
import { useAuth } from "../../contexts/Auth"
import BalanceFormat from "./BalanceFormat";
import styles from "../../style/style"
import Ionicons from "react-native-vector-icons/Ionicons"

const ChangingBalance = ({
    deduction,
}: {
    deduction: number;
}) => {
    const [token_balance, setTokenBalance] = useState(0.0)
    const [new_balance, setNewTokenBalance] = useState(0.0)
    const [timeUpdated, setTimeUpdated] = useState(0.0)
    const [loading, setLoading] = useState(true)
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
            setNewTokenBalance(data['token_balance'] - deduction)
            setLoading(false);
        })
        .catch(error => {
            console.log(error);
        });
    }

    if (loading) {
        return (
            <View center marginV-20>
                <LoaderScreen margin-30 message={'Loading Balance'} color={styles.rcoin} />
            </View>
        );
    }
    else {
        return (
            <View center marginV-20>
                <BalanceFormat token_balance={token_balance} />
                <View center>
                    {
                        deduction > 0 ?
                            <Image
                                source={require('../../style/red-arrow-down.png')}
                                style={{ width: 40, height: 40 }}
                            />
                            :
                            <Image
                                source={require('../../style/green-arrow-down.png')}
                                style={{ width: 40, height: 40 }}
                            />
                    }
                </View>
                <Ionicons.Button
                    name="refresh-outline"
                    color={styles.rcoin}
                    backgroundColor="none"
                    onPress={onRefresh}
                />
            </View>
        );
    }
}

export default ChangingBalance;