import React from 'react';
import {Text, View, Button, Image} from 'react-native-ui-lib';
import styles from '../../style/style';
import {NavigationScreenProp} from 'react-navigation';

// Confirm the issue
const IssueSuccess = ({
  navigation,
  nextStage,
  rand_to_pay,
  coins_to_issue,
}: {
  navigation: NavigationScreenProp<any, any>;
  nextStage: React.Dispatch<void>;
  rand_to_pay: number;
  coins_to_issue: number;
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
          We have received R{rand_to_pay} and are now depositing{' '}
          {coins_to_issue} RCoin in your wallet.
        </Text>
      </View>
      <View flex bottom marginH-30>
        <Text style={styles.buttonCaption}>
          You can now see your updated balance on the dashboard
        </Text>
        <Button
          onPress={() => {
            navigation.navigate('Home');
            nextStage();
          }} //navigate to dashboard page
          label="RCoin Dashboard"
          backgroundColor={styles.rcoin}
        />
      </View>
      <View flex bottom marginH-30>
        <Button
          onPress={nextStage} //navigate to transfer page
          label="Make another deposit"
          backgroundColor={styles.rcoin}
        />
      </View>
      <View flex bottom marginH-30 marginB-50>
        <Button
          onPress={() => {
            navigation.navigate('Transfer');
            nextStage();
          }} //navigate to transfer page
          label="Make a transfer"
          backgroundColor={styles.rcoin}
        />
      </View>
    </View>
  );
};

export default IssueSuccess;
