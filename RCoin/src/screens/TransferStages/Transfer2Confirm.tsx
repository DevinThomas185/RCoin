import React from "react";
import { Text, View, Button } from "react-native-ui-lib";
import ChangingBalance from "../../components/Balances/ChangingBalance"
import Reciept from "./TransferReciept"
import styles from "../../style/style"

// Select the amount
const Transfer2Confirm = ({
    nextStage,
    deduction,
    recipient,
}: {
    nextStage: React.Dispatch<void>;
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

            <View flex bottom marginH-30 marginB-50>
                <Button onPress={nextStage} label="Transfer RCoin" backgroundColor={styles.rcoin} />
            </View>
        </View>
    );
}

export default Transfer2Confirm