import React, { useState } from "react";
import { Text, View, Button, Colors } from 'react-native-ui-lib';
import AmountEntry from '../../components/AmountEntry';
import styles from '../../style/style';
import Balance from '../../components/Balances/Balance';

const LEAST_LIMIT = 0;

// Select the amount
const Transfer1Amount = ({
  nextStage,
  setAmount,
}: {
  nextStage: React.Dispatch<void>;
  setAmount: React.Dispatch<React.SetStateAction<number>>;
}) => {
  const [valid, setValid] = useState(false);

  const continueButton = () => {
    if (valid) {
      return (
        <Button
          onPress={nextStage}
          label="Continue to Confirmation"
          backgroundColor={styles.rcoin}
        />
      );
    } else {
      return (
        <Button
          onPress={() => { }}
          label="Continue to Confirmation"
          backgroundColor={styles.grey}
        />
      );
    }
  }

  return (
    <View flex>
      <Text text40 style={styles.title} margin-30>
        Choose the Amount
      </Text>
      <View margin-20>
        <Balance />
      </View>
      <View marginH-30>
        <Text>How much would you like to send?</Text>
      </View>
      <View marginH-30>
        <AmountEntry setAmount={setAmount} least_limit={LEAST_LIMIT} max_limit={1000000} tellButton={setValid} />
      </View>
      <View flex bottom marginH-30 marginB-50 >
        {continueButton()}
      </View>
    </View>
  );
};

export default Transfer1Amount;
