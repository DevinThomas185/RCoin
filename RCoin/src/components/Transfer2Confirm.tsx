import React, { useEffect, useState } from "react";
import { Text, View, Card, Button, Colors, Incubator } from "react-native-ui-lib";
const { TextField } = Incubator
import ChangingBalance from "./Balances/ChangingBalance"
import Reciept from "./TransferReciept"
import styles from "../style/style"

// Select the amount
const Transfer2Confirm = ({
    setStage,
    deduction,
    recipient,
}: {
    setStage: React.Dispatch<React.SetStateAction<number>>;
    deduction: number;
    recipient: string;
}) => {
    return (
        <View flex>
            <Text text40 style={styles.title} margin-30>
                Confirm your transaction
            </Text>
            <View margin-30>
                <ChangingBalance deduction={deduction} />
                <Reciept email={recipient} amount={deduction} />
            </View>

            <View flex bottom marginH-30 marginB-20>
                <Button onPress={() => { setStage(3) }} label="Continue" backgroundColor={styles.rcoin} />
            </View>
        </View>
    );
}

export default Transfer2Confirm