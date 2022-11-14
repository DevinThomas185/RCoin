import React, { useEffect, useState } from "react";
import { Text, View, Card, Button, Colors, Incubator, Image } from "react-native-ui-lib";
import { useAuth } from '../contexts/Auth';
const { TextField } = Incubator
import style from '../style/style'


// Select the amount
const Balance = ({ confirmation }: { confirmation: boolean }) => {
    const [token_balance, setTokenBalance] = useState(0.0)
    const [timeUpdated, setTimeUpdated] = useState(0.0)
    const auth = useAuth()

    const numberWithCommas = (x: number) => {
        const options = {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        };
        return Number(x).toLocaleString('en', options);
    }


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
            <Text>{confirmation ? 'From your balance of:' : 'Your available balance:'}</Text>
            <View style={{ flexDirection: "row" }}>
                <Image
                    source={require('../style/Logo.png')}
                    style={style.balanceLogo}
                />
                <Text text20 grey10 left>
                    {numberWithCommas(token_balance)}
                </Text>
            </View>
        </View>

    );
}

export default Balance