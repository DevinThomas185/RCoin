
import React, { useEffect, useState } from "react";
import { Text, View, Card, Button, Colors, Incubator } from "react-native-ui-lib";
const { TextField } = Incubator

// Select the amount
const IssueAmount = ({
  setStage,
}: {
  setStage: React.Dispatch<React.SetStateAction<number>>;
}) => {

  const [token_balance, setTokenBalance] = useState(0.0)
  const [sol_balance, setSolBalance] = useState(0.0)
  const [amount, setAmount] = useState(0.0)

  useEffect(() => {
    fetch("http://10.0.2.2:8000/api/get_token_balance", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setTokenBalance(data["token_balance"]);
        setSolBalance(data["sol_balance"]);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  return (
    <View flex>
      <Text text40 blue10 margin-30>
        Making A Deposit
      </Text>
      <View margin-30>
        <Text>
          You can exchange any amount of Rand for RCoin.
          {'\n'}
          {'\n'}
          The transaction will appear on your account as well as the real time audit.
        </Text>
        <Text text30 grey10 left>
          {token_balance}
        </Text>
      </View>
      <View margin-30>
        <Text>
          How many RCoin would you like?
        </Text>
        <TextField
          placeholder="amount"
          floatingPlaceholder
          validationMessage={["Amount is required"]}
          keyboardType="amount"
        />
      </View>
      <View flex bottom marginH-30 marginB-50>
        <Button onPress={() => { setStage(1) }} label="Continue" backgroundColor={Colors.blue10} />
      </View>
    </View>
  );
}

export default IssueAmount
