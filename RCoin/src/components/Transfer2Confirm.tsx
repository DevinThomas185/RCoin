import React, { useEffect, useState } from "react";
import { Text, View, Card, Button, Colors, Incubator } from "react-native-ui-lib";
const { TextField } = Incubator
import Balance from "./Balance"
import Reciept from "./TransferReciept"
import styles from "../style/style"

// Select the amount
const Transfer2Confirm = ({
    setStage,
}: {
    setStage: React.Dispatch<React.SetStateAction<number>>;
}) => {
    return (
        <View flex>
            <Text text40 style={styles.title} margin-30>
                Confirm your transaction
            </Text>
            <View margin-30>
                <Balance confirmation={true} />
                <Reciept email={"adam@gmail.com"} amount={392} />
            </View>

            <View flex bottom marginH-30 marginB-20>
                <Button onPress={() => { setStage(3) }} label="Continue" backgroundColor={styles.rcoin} />
            </View>
        </View>
    );
}

export default Transfer2Confirm