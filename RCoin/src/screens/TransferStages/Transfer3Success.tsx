import React from 'react';
import {Text, View, Button, Image} from 'react-native-ui-lib';
import {NavigationScreenProp} from 'react-navigation';
import {useFriends} from '../../contexts/FriendContext';
import styles from '../../style/style';

// Select the amount
const Transfer2Confirm = ({
  navigation,
  nextStage,
  amount,
  recipient,
  transactionId,
}: {
  navigation: NavigationScreenProp<any, any>;
  nextStage: React.Dispatch<void>;
  amount: number;
  recipient: string;
  transactionId: string;
}) => {
  const friends_context = useFriends();

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
          {numberWithCommas(amount)} RCoin has been sent to{' '}
          {friends_context.match_email(recipient)}
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
          label="Make another transfer"
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

export default Transfer2Confirm;
