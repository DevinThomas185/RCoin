import React, { useEffect, useState } from "react";
import { Text, View, Card, Button, Colors, Incubator } from "react-native-ui-lib";
const { TextField } = Incubator
import styles from "../style/style"

// Select the amount
const Transfer2Confirm = ({
    setStage,
}: {
    setStage: React.Dispatch<React.SetStateAction<number>>;
}) => {
    return (
        <View flex>
            <Text text40 color={styles.rcoin} style={{

            }} margin-30>
                Successful ✅
            </Text>
            <View margin-30>
                <Text style={styles.buttonCaption}>
                    392 RCoin has successfuly been sent to adam@email.com {'\n'}
                    Transaction ID = asdkljf238ak92p3jhk239asdfih2lir3
                </Text>
            </View>
            <View flex bottom marginH-30-0>
                <Text style={styles.buttonCaption}>
                    You can now see your updated balance on the dashboard
                </Text>
                <Button onPress={() => { setStage(0) }} label="RCoin Dashboard" backgroundColor={styles.rcoin} />
            </View>
            <View flex bottom marginH-30-0>
                <Text style={styles.buttonCaption}>
                    Make another transfer below.
                </Text>
                <Button marginB-20 onPress={() => { setStage(0) }} label="Make a transfer" backgroundColor={styles.rcoin} />
            </View>
        </View >
    );
}

export default Transfer2Confirm