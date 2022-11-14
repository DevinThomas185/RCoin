
import React, { useEffect, useState } from "react";
import { Text, View, Card, Button, Colors, Incubator } from "react-native-ui-lib";
import AmountEntry from "../../components/AmountEntry";
import { useAuth } from "../../contexts/Auth";

const LEAST_LIMIT = 0;

// Select the amount
const IssueAmount = ({
  setStage,
  setAmount,
  setRandToPay,
}: {
  setStage: React.Dispatch<React.SetStateAction<number>>;
  setAmount: React.Dispatch<React.SetStateAction<number>>;
  setRandToPay: React.Dispatch<React.SetStateAction<number>>;
}) => {

  const auth = useAuth();

  // TODO: CHANGE TO GET RAND TO PAY
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
      setRandToPay(data['rand_to_return']);
    })
    .catch(error => {
      console.log(error);
    });
  }

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
      </View>
      <View margin-30>
        <Text>
          How many RCoin would you like?
        </Text>
      </View>
      <AmountEntry setAmount={setAmount} least_limit={LEAST_LIMIT} />
      <View flex bottom marginH-30 marginB-50>
        <Button onPress={() => { setStage(1) }} label="Continue" backgroundColor={Colors.blue10} />
      </View>
    </View>
  );
}

export default IssueAmount
