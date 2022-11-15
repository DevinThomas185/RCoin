import React from "react";
import { Text, View } from "react-native-ui-lib";
import styles from "../../style/style"


// Select the amount
const IssueReceipt = ({ coins_to_issue, rand_to_pay }: { coins_to_issue: number, rand_to_pay: number }) => {
    const numberWithCommas = (x: number) => {
        const options = {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        };
        return Number(x).toLocaleString('en', options);
    }

    return (
        <View>
            <Text>
                You are purchasing
            </Text>
            <Text text40 color={styles.rcoin}>
                {numberWithCommas(coins_to_issue)} RCoin
            </Text>
            <Text>
                for
            </Text>
            <Text text40 color={styles.rcoin}>
                {numberWithCommas(rand_to_pay)} Rand
            </Text>
        </View >
    );
}

export default IssueReceipt