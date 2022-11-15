import React, { useEffect } from "react";
import { Text, View, Button, Image } from "react-native-ui-lib";
import Balance from "../../components/Balances/Balance";
import { useAuth } from "../../contexts/Auth";
import styles from "../../style/style"

const LEAST_LIMIT = 0

// Select the amount
const WithdrawStage0 = ({
  nextStage,
  setCoinsToWithdraw,
  setRandsBeingCredited,
  coins_to_withdraw,
}: {
  nextStage: React.Dispatch<void>;
  setCoinsToWithdraw: React.Dispatch<React.SetStateAction<number>>;
  setRandsBeingCredited: React.Dispatch<React.SetStateAction<number>>;
  coins_to_withdraw: number;
}) => {

  const auth = useAuth();

  useEffect(() => {
    fetch('http://10.0.2.2:8000/api/get_rand_to_return/?amount=' + coins_to_withdraw.toString(), {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${auth.authData?.token}`,
      },
    })
    .then(res => res.json())
    .then(data => {
      setRandsBeingCredited(data['rand_to_return']);
    })
    .catch(error => {
      console.log(error);
    });
  }, [coins_to_withdraw])

  return (
    <View flex>
      <Text text40 style={styles.title}>
        Make a Withdrawal
      </Text>
      <View margin-30>
        <Balance />
      </View>
      <View style={{ marginHorizontal: 30 }}>
        <Text>
          You can withdraw RCoin to Rand at any time.
          {'\n'}
          {'\n'}
          The transaction will appear in your transaction history as well as on the Real-Time Audit.
        </Text>
      </View>

      <Image
        source={require('../../style/RCoin-ZAR.png')}
        style={{ width: '100%', height: 130, marginVertical: 30 }}
      />

      <View flex bottom marginH-30 marginB-50>
        <Button onPress={nextStage} label="Continue" backgroundColor={styles.rcoin} />
      </View>
    </View>
  );
}

export default WithdrawStage0