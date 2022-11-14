import React, { useEffect, useState } from "react";
import { Text, View, Card, Button, Colors, Incubator, Image } from "react-native-ui-lib";
const { TextField } = Incubator
import styles from "../style/style"

// Select the recipient
const Transfer0Email = ({
    setStage,
    setRecipient,
}: {
    setStage: React.Dispatch<React.SetStateAction<number>>;
    setRecipient: React.Dispatch<React.SetStateAction<string>>;
}) => {
    return (
        <View flex>
            <Text text40 style={styles.title}>
                Make a Transfer
            </Text>
            <View style={{ marginHorizontal: 30 }}>
                <Text>
                    You can send RCoin to any other user.
                    Simply enter the email of the recipient and choose the amount.
                    {'\n'}
                    {'\n'}
                    The transaction will appear on both your accounts as well as the real time audit.
                </Text>
            </View>

            <Image
                source={require('../style/RCoin-RCoin.png')}
                style={{ width: '100%', height: 130 }}
            />

            <View margin-30>
                <Text>
                    Who would you like to send RCoin to?
                </Text>
                <TextField
                    placeholder="email"
                    style={styles.input}
                    validationMessage={["Email is required"]}
                    keyboardType="email"
                    onChangeText={(email: string) => {
                        setRecipient(email);
                    }}
                />
            </View>
            <View flex bottom marginH-30 marginB-20>
                <Button onPress={() => { setStage(1) }} label="Continue" backgroundColor={styles.rcoin} />
            </View>
        </View >
    );
}

export default Transfer0Email