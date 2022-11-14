import React, { useEffect, useState } from "react";
import { View, Text, Image } from "react-native-ui-lib";
import { useAuth } from "../../contexts/Auth"
import BalanceFormat from "./BalanceFormat";


// Select the amount
const ChangingBalance = ({
    deduction,
}: {
    deduction: number;
}) => {
    const [token_balance, setTokenBalance] = useState(0.0)
    const [new_balance, setNewTokenBalance] = useState(0.0)
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
                setNewTokenBalance(data['token_balance'] - deduction)
            })
            .catch(error => {
                console.log(error);
            });
    }, []);

    return (
        <View center marginV-20>
            <BalanceFormat token_balance={token_balance}/>
            <View center>
                {
                    deduction > 0 ?
                    <Image
                        source={require('../red-arrow-down.png')}
                        style={{ width: 30, height: 30 }}
                    />
                    :
                    <Image
                        source={require('../green-arrow-down.png')}
                        style={{ width: 30, height: 30}}
                    />
                }
            </View>
            <BalanceFormat token_balance={new_balance} />
        </View>

    );
}

export default ChangingBalance;