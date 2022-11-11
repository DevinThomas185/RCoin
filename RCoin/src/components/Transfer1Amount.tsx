import React, { useEffect, useState } from "react";
import { Text, View, Card, Button, Colors, Incubator } from "react-native-ui-lib";
const { TextField } = Incubator
import Balance from "../components/Balance"
import { useAuth } from '../contexts/Auth';

// Select the amount
const Transfer1Amount = ({
    setStage,
}: {
    setStage: React.Dispatch<React.SetStateAction<number>>;
}) => {

    const [token_balance, setTokenBalance] = useState(0.0)
    const [sol_balance, setSolBalance] = useState(0.0)
    const [amount, setAmount] = useState(0.0)
    const auth = useAuth();

    return (
        <View flex>
            <Text text40 blue10 margin-30>
                Choose the Amount
            </Text>
            <View margin-20>
                <Balance />
            </View>
            <View margin-30>
                <Text>
                    How much would you like to send?
                </Text>
                <TextField
                    placeholder="RCoin"
                    floatingPlaceholder
                    validationMessage={["Amount is required"]}
                    keyboardType="numeric"
                />
            </View>
            <View flex bottom marginH-30 marginB-50>
                <Button onPress={() => { setStage(2) }} label="Continue" backgroundColor={Colors.blue10} />
            </View>
            <View flex bottom marginH-10 marginB-10>
                <Button onPress={() => { setStage(0) }} label="Back" />
            </View>
        </View>
    );
}

export default Transfer1Amount