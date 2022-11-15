import React, { useEffect, useState } from "react";
import { Text, View, Card, Button, Colors, Incubator, Image } from "react-native-ui-lib";
import { useAuth } from '../../contexts/Auth';
import styles from "../../style/style"
const { TextField } = Incubator


// Select the amount
const Reciept = ({
    coins,
    rands,
    bank_account
}: {
    coins: number,
    rands: number,
    bank_account: { [key: string]: string }
}) => {
    const numberWithCommas = (x: number) => {
        const options = {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        };
        return Number(x).toLocaleString('en', options);
    }

    return (
        <View>
            <Text style={styles.buttonCaption}>
                You are withdrawing{'\n'}
                <Text text40 color={styles.rcoin}>
                    {numberWithCommas(coins)} Rand
                </Text>{'\n'}
                into
            </Text>
            <View style={{
                flexDirection: "row",
                justifyContent: 'center',
                alignItems: 'center'
            }} >
                <Text style={styles.bankDetails}>
                    {bank_account["sort_code"]}{'\n'}
                    {bank_account["bank_account"]}
                </Text>
                <Text style={styles.bankDetailsLabel}>
                    Bank Code{'\n'}
                    Account Number
                </Text>
            </View>
        </View >
    );
}

export default Reciept