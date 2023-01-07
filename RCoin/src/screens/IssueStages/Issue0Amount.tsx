import React, {useEffect, useRef, useState} from 'react';
import {Text, View, Button, Image} from 'react-native-ui-lib';
import {useAuth} from '../../contexts/Auth';
import styles from '../../style/style';
import Config from 'react-native-config';
import NumberKeyboard from '../../components/NumberKeyboard/NumberKeyboard';
import ChangingBalanceCard from '../../components/Balances/ChangingBalanceCard';

// Select the amount
const IssueAmount = ({
  nextStage,
  setCoinsToIssue,
  coins_to_issue,
  setRandToPay,
}: {
  nextStage: React.Dispatch<void>;
  setCoinsToIssue: React.Dispatch<React.SetStateAction<number>>;
  coins_to_issue: number;
  setRandToPay: React.Dispatch<React.SetStateAction<number>>;
}) => {
  const auth = useAuth();
  const [valid, setValid] = useState(false);

  const setRands = (coins: number) => {
    fetch(
      `${Config.API_URL}:8000/api/get_rand_to_pay?amount=` + coins.toString(),
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${auth.authData?.token}`,
        },
      },
    )
      .then(res => res.json())
      .then(data => {
        setRandToPay(data['rand_to_pay']);
      })
      .catch(error => {
        console.log(error);
      });
  };

  return (
    <View flex marginH-10>
      <View marginV-10>
        <Text text40 style={styles.title}>
          Make a Deposit
        </Text>
        <Text text70>
          Top up your RCoin balance. Enter the amount and pay via our partner,
          Paystack.
        </Text>
      </View>

      <View>
        <ChangingBalanceCard increment={coins_to_issue} />
      </View>

      <View flex bottom marginV-10>
        <NumberKeyboard
          style={{
            borderTopLeftRadius: 10,
            borderTopRightRadius: 10,
            borderBottomLeftRadius: 0,
            borderBottomRightRadius: 0,
          }}
          number={coins_to_issue}
          setNumber={x => {
            setCoinsToIssue(x);
          }}
          setValid={setValid}
          limit_to_balance={false}
        />
        <Button
          style={{
            borderTopLeftRadius: 0,
            borderTopRightRadius: 0,
            borderBottomLeftRadius: 10,
            borderBottomRightRadius: 10,
          }}
          onPress={() => {
            setRands(coins_to_issue);
            nextStage();
          }}
          label="Continue to Confirmation"
          disabled={!valid}
          backgroundColor={styles.paystack}
        />
      </View>
    </View>
  );
};

export default IssueAmount;
