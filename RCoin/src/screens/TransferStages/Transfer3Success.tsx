import React from 'react';
import {Text, View, Button} from 'react-native-ui-lib';
import styles from '../../style/style';

// Select the amount
const Transfer2Confirm = ({
  nextStage,
  amount,
  recipient,
  transactionId,
}: {
  nextStage: React.Dispatch<void>;
  amount: number;
  recipient: string;
  transactionId: string;
}) => {
  return (
    <View flex>
      <Text text40 color={styles.rcoin} style={{}} margin-30>
        Successful ✅
      </Text>
      <View margin-30>
        <Text style={styles.buttonCaption}>
          {amount} Rcoin has successfuly been sent to {recipient}
        </Text>
        <Text>Transaction ID = {transactionId}</Text>
      </View>
      <View flex bottom marginH-30-0>
        <Text style={styles.buttonCaption}>
          You can now see your updated balance on the dashboard
        </Text>
        <Button
          onPress={nextStage}
          label="RCoin Dashboard"
          backgroundColor={styles.rcoin}
        />
      </View>
      <View flex bottom marginH-30 marginB-50>
        <Button
          onPress={nextStage}
          label="Make another Transfer"
          backgroundColor={styles.rcoin}
        />
      </View>
    </View>
  );
};

export default Transfer2Confirm;
