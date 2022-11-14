import React, { useEffect, useState } from "react";
import { Text, View, Card, Button, Colors, Incubator, Image } from "react-native-ui-lib";
import { useAuth } from '../contexts/Auth';
import styles from "../style/style"
const { TextField } = Incubator


// Select the amount
const Reciept = ({ email, amount }: { email: String, amount: number }) => {
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
                You are sending
            </Text>
            <Text text40 color={styles.rcoin}>
                {numberWithCommas(amount)} RCoin
            </Text>
            <Text>
                to
            </Text>
            <Text text40 color={styles.rcoin}>
                {email}
            </Text>
        </View >
    );
}

export default Reciept