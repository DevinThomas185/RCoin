
import React, { useEffect, useState } from "react";
import { Text, View, Card, Button, Colors, Incubator, Image } from "react-native-ui-lib";
import AmountEntry from "../../components/AmountEntry";
import { useAuth } from "../../contexts/Auth";
import styles from "../../style/style"

const LEAST_LIMIT = 0;

// Select the amount
const IssueAmount = ({
  nextStage,
  setCoinsToIssue,
  setRandToPay,
  coins_to_issue,
}: {
  nextStage: React.Dispatch<void>;
  setCoinsToIssue: React.Dispatch<React.SetStateAction<number>>;
  setRandToPay: React.Dispatch<React.SetStateAction<number>>;
  coins_to_issue: number;
}) => {

  const auth = useAuth();
  const [valid, setValid] = useState(false);

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

  const continueButton = () => {
    if (valid) {
      return (
        <Button
          onPress={() => { nextStage(); setRands(coins_to_issue) }}
          label="Continue"
          backgroundColor={styles.rcoin}
        />
      );
    } else {
      return (
        <Button
          onPress={() => { }}
          label="Continue"
          backgroundColor={styles.grey}
        />
      );
    }
  }

  return (
    <View flex>
      <Text text40 style={styles.title}>
        Making A Deposit
      </Text>
      <View marginH-30>
        <Text>
          You can exchange any amount of Rand for RCoin.
          {'\n'}
          {'\n'}
          The transaction will appear in your transaction history and on the Real-Time Audit.
        </Text>
      </View>
      <Image
        source={require('../../style/RCoin-ZAR.png')}
        style={{ width: '100%', height: 130, marginVertical: 30 }}
      />
      <View marginH-30>
        <AmountEntry setAmount={setCoinsToIssue} least_limit={LEAST_LIMIT} max_limit={1000000} tellButton={setValid} />
      </View>

      <View flex bottom marginH-30 marginB-50 >
        {continueButton()}
      </View>

    </View>
  );
}

export default IssueAmount
