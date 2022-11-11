import React, { useEffect, useState } from "react";
import { Text, View, Card, Button, Colors, Incubator } from "react-native-ui-lib";
import { useAuth } from "../contexts/Auth";
const { TextField } = Incubator

const LEAST_LIMIT = 0

// Select the amount
const WithdrawStage0 = ({
  nextStage,
  setCoinsToWithdraw,
  setRandsBeingCredited,
  token_balance,
  sol_balance,
}: {
  nextStage: React.Dispatch<void>;
  setCoinsToWithdraw: React.Dispatch<React.SetStateAction<number>>;
  setRandsBeingCredited: React.Dispatch<React.SetStateAction<number>>;
  token_balance: number;
  sol_balance: number;
}) => {

  const auth = useAuth();
  const [valid_amount, setValidAmount] = useState(false);

  const setRands = (coins: number) => {
    fetch('http://10.0.2.2:8000/api/get_rand_to_return/?amount=' + coins.toString(), {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${auth.authData?.token}`,
      },
    })
    .then(res => res.json())
    .then(data => {
      console.log(data);
      setRandsBeingCredited(data['rand_to_return']);
    })
    .catch(error => {
      console.log(error);
    });
  }

  return (
    <View flex>
      <Text text40 blue10 margin-30>
        Make a Withdrawal
      </Text>
      <View margin-30>
        <Text>
          Your current balance:
        </Text>
        <Text text30 grey10 left>
          RCoin: {token_balance}
        </Text>
        <Text text30 grey10 left>
          SOL: {sol_balance}
        </Text>
      </View>
      <View margin-30> 
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
      <View margin-30>
        <TextField 
          placeholder="RCoin Amount"
          floatingPlaceholder
          validateOnChange
          validate = {(value: string) => {
            let valid = true;
            if (isNaN(value) || parseFloat(value) < LEAST_LIMIT || value == "") {
              valid = false; 
            }
            setValidAmount(valid)
          }}
          validationMessage={["Amount is required"]}
          onChangeValidity={(isValid: boolean) => setValidAmount(isValid)}
          keyboardType="numeric"
          onChangeText={(coins: number) => {
            setRands(coins);
            setCoinsToWithdraw(coins)
          }}
        />
      </View>
      <View flex bottom marginH-30 marginB-50>
        <Button onPress={nextStage} label="Continue" backgroundColor={Colors.blue10} />
      </View>
    </View>
  );
}

export default WithdrawStage0