import React, { useEffect, useState } from "react";
import { Text, View, Card, Button, Colors, Incubator } from "react-native-ui-lib";
const { TextField } = Incubator

// Select the amount
const Transfer0Email = ({
    setStage,
}: {
    setStage: React.Dispatch<React.SetStateAction<number>>;
}) => {

    const [token_balance, setTokenBalance] = useState(0.0)
    const [sol_balance, setSolBalance] = useState(0.0)
    const [amount, setAmount] = useState(0.0)

    useEffect(() => {
        fetch("http://10.0.2.2:8000/api/get_token_balance", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        })
            .then((res) => res.json())
            .then((data) => {
                setTokenBalance(data["token_balance"]);
                setSolBalance(data["sol_balance"]);
            })
            .catch((error) => {
                console.log(error);
            });
    }, []);

    return (
        <View flex>
            <Text text40 blue10 margin-30>
                Make a Transfer
            </Text>
            <View margin-30>
                <Text>
                    You can send RCoin to any other user.
                    Simply enter the email of the recipient and choose the amount.
                    {'\n'}
                    {'\n'}
                    The transaction will appear on both your accounts as well as the real time audit.
                </Text>
            </View>
            <View margin-30>
                <Text>
                    Who would you like to send RCoin to?
                </Text>
                <TextField
                    placeholder="email"
                    floatingPlaceholder
                    validationMessage={["Email is required"]}
                    keyboardType="email"
                />
            </View>
            <View flex bottom marginH-30 marginB-50>
                <Button onPress={() => { setStage(1) }} label="Continue" backgroundColor={Colors.blue10} />
            </View>
        </View>
    );
}

export default Transfer0Email