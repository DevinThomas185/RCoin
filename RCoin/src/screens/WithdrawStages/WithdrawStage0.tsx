import React, {useState} from 'react';
import {Text, View, Button} from 'react-native-ui-lib';
import styles from '../../style/style';
import ChangingBalanceCard from '../../components/Balances/ChangingBalanceCard';
import NumberKeyboard from '../../components/NumberKeyboard/NumberKeyboard';

// Select the amount
const WithdrawStage0 = ({
  nextStage,
  coins_to_withdraw,
  setCoinsToWithdraw,
}: {
  nextStage: React.Dispatch<void>;
  coins_to_withdraw: number;
  setCoinsToWithdraw: React.Dispatch<React.SetStateAction<number>>;
}) => {
  const [valid, setValid] = useState(false);

  return (
    <View flex marginH-10>
      <View marginV-10>
        <Text text40 style={styles.title}>
          Make a Withdrawal
        </Text>
        <Text text70>
          Withdraw RCoin into Rand, deposited into your chosen bank account.
        </Text>
      </View>

      <View>
        <ChangingBalanceCard increment={-coins_to_withdraw} />
      </View>

      <View flex bottom marginV-10>
        <NumberKeyboard
          style={{
            borderTopLeftRadius: 10,
            borderTopRightRadius: 10,
            borderBottomLeftRadius: 0,
            borderBottomRightRadius: 0,
          }}
          number={coins_to_withdraw}
          setNumber={x => {
            setCoinsToWithdraw(x);
          }}
          setValid={setValid}
          limit_to_balance={true}
        />
        <Button
          style={{
            borderTopLeftRadius: 0,
            borderTopRightRadius: 0,
            borderBottomLeftRadius: 10,
            borderBottomRightRadius: 10,
          }}
          onPress={() => {
            nextStage();
          }}
          label="Continue to Select Bank Account"
          disabled={!valid}
          backgroundColor={styles.paystack}
        />
      </View>
    </View>
  );
};

export default WithdrawStage0;
