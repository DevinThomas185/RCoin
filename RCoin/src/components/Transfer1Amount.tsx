import React from "react";
import { Text, View, Button, Colors } from "react-native-ui-lib";
import AmountEntry from "./AmountEntry";
import styles from "../style/style"
import ChangingBalance from "./Balances/ChangingBalance";

const LEAST_LIMIT = 0

// Select the amount
const Transfer1Amount = ({
    setStage,
    setAmount,
}: {
    setStage: React.Dispatch<React.SetStateAction<number>>;
    setAmount: React.Dispatch<React.SetStateAction<number>>;
}) => {

    return (
        <View flex>
            <Text text40 style={styles.title} margin-30>
                Choose the Amount
            </Text>
            <View margin-20>
                <ChangingBalance deduction={100} />
            </View>
            <View margin-30>
                <Text>
                    How much would you like to send?
                </Text>
            </View>
            <AmountEntry setAmount={setAmount} least_limit={LEAST_LIMIT} />
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