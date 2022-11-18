import React from 'react';
import {Text, View, Button, Image} from 'react-native-ui-lib';
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
      <View marginT-30 style={{alignSelf: 'center'}}>
        <Image source={require('../../style/Success.png')} />
      </View>
      <Text
        text40
        color={styles.rcoin}
        style={{
          textAlign: 'center',
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        Successful
      </Text>

      <View margin-30>
        <Text style={styles.buttonCaption}>
          {amount} RCoin has successfully been sent to {recipient}
        </Text>
        <Text>Transaction ID = {transactionId}</Text>
      </View>
      <View flex bottom marginH-30 marginB-20>
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
