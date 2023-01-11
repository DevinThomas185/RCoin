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
  const numberWithCommas = (x: number) => {
    const options = {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    };
    return Number(x).toLocaleString('en', options);
  };

  return (
    <View flex marginH-10>
      <View style={{alignSelf: 'center'}} marginV-10>
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
        Success!
      </Text>

      <View marginV-10>
        <Text text50 center>
          We have received ZAR {numberWithCommas(rand_to_pay)} and are now
          depositing {numberWithCommas(coins_to_issue)} RCoin in your wallet.
        </Text>
      </View>
      <View marginV-20>
        <Text text60 center>
          It may take a few minutes for your balance to update.
        </Text>
      </View>
      <View flex bottom>
        <Button
          marginV-10
          onPress={nextStage} //navigate to transfer page
          label="Make another deposit"
          backgroundColor={styles.rcoin}
        />
        <Button
          marginV-10
          onPress={() => {
            navigation.navigate('Home');
            nextStage();
          }} //navigate to dashboard page
          label="Back to Dashboard"
          backgroundColor={styles.rcoin}
        />
      </View>
    </View>
  );
};

export default IssueSuccess;
