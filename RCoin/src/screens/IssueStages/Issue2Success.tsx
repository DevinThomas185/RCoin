import React from 'react';
import {Text, View, Button, Image} from 'react-native-ui-lib';
import styles from '../../style/style';

// Confirm the issue
const IssueSuccess = ({
  nextStage,
  rand_to_pay,
}: {
  nextStage: React.Dispatch<void>;
  rand_to_pay: number;
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
        <Text text60 center marginB-20>
          Your payment has been successful!
        </Text>
        <Text center>
          We have received R{rand_to_pay} and are now processing your deposit.
        </Text>
      </View>
      <View flex bottom marginH-30 marginB-20>
        <Text style={styles.buttonCaption}>
          You can now see your updated balance on the dashboard
        </Text>
        <Button
          onPress={nextStage} //nagivate to dashboard page
          label="RCoin Dashboard"
          backgroundColor={styles.rcoin}
        />
      </View>
      <View flex bottom marginH-30 marginB-50>
        <Button
          onPress={() => {}} //navigate to transfer page
          label="Make a transfer"
          backgroundColor={styles.rcoin}
        />
      </View>
    </View>
  );
};

export default IssueSuccess;
