import React, { useState } from "react";
import { Text, View, Incubator } from "react-native-ui-lib";
import styles from "../style/style";
const { TextField } = Incubator

// Select the amount
const AmountEntry = ({
  setAmount,
  least_limit,
}: {
  setAmount: React.Dispatch<React.SetStateAction<number>>;
  least_limit: number;
}) => {

    const [valid_amount, setValidAmount] = useState(false);

    return (
        <View>
            <TextField 
                placeholder="RCoin Amount"
                style={styles.input}
                validateOnChange
                validate = {(value: string) => {
                    let valid = true;
                    if (isNaN(value) || parseFloat(value) < least_limit || value == "") {
                        valid = false; 
                    }
                    setValidAmount(valid)
                }}
                validationMessage={["Amount is required"]}
                onChangeValidity={(isValid: boolean) => setValidAmount(isValid)}
                keyboardType="numeric"
                onChangeText={(coins: number) => {
                    setAmount(coins);
                }}
            />
            {
            valid_amount ?
            <Text green10>
                Looks good!
            </Text>
            :
            <Text red10>
                Amount is invalid
            </Text>
            }
        </View>
    );
}

export default AmountEntry;
