import React, { useEffect, useState } from "react";
import { Text, View, Card, Button, Colors, Incubator } from "react-native-ui-lib";
const { TextField } = Incubator

// Show the summary
const IssueSummary = ({
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
        Payment Summary
      </Text>
      <View margin-30>
        <Text text30 grey10 left>
          {token_balance}
        </Text>
        <Text>
          You are purchasing {'\n'}
          x RCoin {'\n'}
          for {'\n'}
          y Rand {'\n'}
          Fees: z Rand
        </Text>
      </View>

      <View flex bottom marginH-30 marginB-50>
        <Button onPress={() => { setStage(2) }} label="Continue" backgroundColor={Colors.blue10} />
      </View>
      <View flex bottom marginH-10 marginB-10>
        <Button onPress={() => { setStage(0) }} label="Back" />
      </View>
    </View>
  );
}

export default IssueSummary
