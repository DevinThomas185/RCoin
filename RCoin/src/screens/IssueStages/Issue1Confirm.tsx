import React, {useEffect, useRef, useState} from 'react';
import {Text, View, Button, Image} from 'react-native-ui-lib';
import {useAuth} from '../../contexts/Auth';
import styles from '../../style/style';
import Config from 'react-native-config';
import {Paystack, paystackProps} from 'react-native-paystack-webview';
import IssueReceipt from './IssueReceipt';
import ChangingBalanceCard from '../../components/Balances/ChangingBalanceCard';

const LEAST_LIMIT = 0;
const MAX_LIMIT = 100000000000;

// Select the amount
const IssueAmount = ({
  nextStage,
  setCoinsToIssue,
  coins_to_issue,
  setRandToPay,
  rand_to_pay,
}: {
  nextStage: React.Dispatch<void>;
  setCoinsToIssue: React.Dispatch<React.SetStateAction<number>>;
  coins_to_issue: number;
  setRandToPay: React.Dispatch<React.SetStateAction<number>>;
  rand_to_pay: number;
}) => {
  const auth = useAuth();
  const paystackWebViewRef = useRef<paystackProps.PayStackRef>();
  const metadata = `${auth.authData?.token_info.user_id}X${coins_to_issue}`;

  const [valid, setValid] = useState(false);
  const [loaded_amount, setLoadedAmount] = useState(false);

  useEffect(() => {
    validate();
  }, [coins_to_issue]);

  const setRands = (coins: number) => {
    fetch(`${Config.API_URL}/api/get_rand_to_pay?amount=` + coins.toString(), {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${auth.authData?.token}`,
      },
    })
      .then(res => res.json())
      .then(data => {
        setRandToPay(data['rand_to_pay']);
      })
      .catch(error => {
        console.log(error);
      });
  };

  const receive_after_fee = (x: number) => {
    const a = x * 100;
    const c = a < 1000 ? 0 : 100;
    return Math.ceil((a - 1.15 * (Math.ceil(0.029 * a) + c)) / 100);
  };

  const validate = () => {
    let valid = false;
    if (coins_to_issue > LEAST_LIMIT && coins_to_issue < MAX_LIMIT) {
      valid = true;
    }
    setValid(valid);
  };

  const pre_calculated_rand_to_pay = () => {
    let res = coins_to_issue;
    let after_fee = receive_after_fee(res);
    // while (after_fee < coins_to_issue) {
    //   res += 1;
    //   after_fee = receive_after_fee(res);
    // }

    if (auth.authData) {
      return res * auth.authData.token_info.trust_score;
    } else {
      return res * 1.05;
    }
  };

  return (
    <View flex marginH-10>
      <Paystack
        billingEmail={auth.authData?.token_info.email}
        amount={rand_to_pay}
        paystackKey={Config.PAYSTACK_PUBLIC_KEY}
        currency="ZAR"
        activityIndicatorColor={styles.rcoin}
        // This is used to hold user id because we can't pass in custom props
        billingName={metadata}
        onCancel={() => {}}
        onSuccess={() => {
          nextStage();
        }}
        ref={paystackWebViewRef}
      />

      <View marginV-10>
        <Text text40 style={styles.title}>
          Confirm Deposit
        </Text>
      </View>

      <View marginV-10>
        <IssueReceipt
          rand_to_pay={pre_calculated_rand_to_pay()}
          coins_to_issue={coins_to_issue}
        />
      </View>

      <View>
        <ChangingBalanceCard increment={coins_to_issue} />
      </View>

      <View flex bottom marginV-10>
        <Button
          iconSource={require('../../style/paystack-full-logo.png')}
          iconStyle={{height: 17, width: 100}}
          iconOnRight
          onPress={() => {
            setRands(coins_to_issue);
            paystackWebViewRef.current.startTransaction();
          }}
          label="Pay with"
          disabled={!valid}
          backgroundColor={styles.paystack}
        />
      </View>
    </View>
  );
};

export default IssueAmount;
