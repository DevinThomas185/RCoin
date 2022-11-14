import React, { useEffect, useState } from "react";
import { Text, View, Card, Button, Colors, Incubator } from "react-native-ui-lib";
const { TextField } = Incubator
import Balance from "../components/Balance"
import { useAuth } from '../contexts/Auth';
import styles from "../style/style"

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
            <Text text40 style={styles.title} margin-30>
                Choose the Amount
            </Text>
            <View margin-20>
                <Balance confirmation={false} />
            </View>
            <View margin-30>
                <Text>
                    How much would you like to send?
                </Text>
                <TextField
                    placeholder="RCoin"
                    style={styles.input}
                    validationMessage={["Amount is required"]}
                    keyboardType="numeric"
                />
            </View>
            <View flex bottom marginH-30 marginB-20>
                <Button onPress={() => { setStage(2) }} label="Continue" backgroundColor={styles.rcoin} />
            </View>
        </View>
    );
}

export default Transfer1Amount