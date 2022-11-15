import React from 'react';
import {Text, View, Button} from 'react-native-ui-lib';
import ChangingBalance from '../../components/Balances/ChangingBalance';
import styles from '../../style/style';
import WithdrawReciept from './WithdrawReciept';

// Confirmation
const WithdrawStage1 = ({
  nextStage,
  token_balance,
  coins_to_withdraw,
  rands_being_credited,
  current_bank_account,
}: {
  nextStage: React.Dispatch<void>;
  token_balance: number;
  coins_to_withdraw: number;
  rands_being_credited: number;
  current_bank_account: {[key: string]: string};
}) => {
  const new_balance = token_balance - coins_to_withdraw;

  return (
    <View flex>
      <Text text40 style={styles.title}>
        Confirm your transaction
      </Text>
      <View margin-30>
        <ChangingBalance deduction={coins_to_withdraw} />
        <WithdrawReciept
          coins={coins_to_withdraw}
          rands={rands_being_credited}
          bank_account={current_bank_account}
        />
      </View>
      <View flex bottom marginH-30 marginB-5>
        <Button
          onPress={nextStage}
          label="Account Settings"
          backgroundColor={styles.rcoin}
        />
      </View>
      <Text style={styles.buttonCaption}>
        Wrong bank info? Change in your account settings
      </Text>
      <View flex bottom marginH-30 marginB-50>
        <Button
          onPress={nextStage}
          label="Continue"
          backgroundColor={styles.rcoin}
        />
      </View>
    </View>
  );
};

export default WithdrawStage1;
