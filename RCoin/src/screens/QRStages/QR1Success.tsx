import React from 'react';
import {Text, View, Button, Image} from 'react-native-ui-lib';
import {NavigationScreenProp} from 'react-navigation';
import styles from '../../style/style';

// Select the amount
const QR1Success = ({
  nextStage,
  amount,
  recipient,
  transactionId,
  navigation,
}: {
  nextStage: React.Dispatch<void>;
  amount: number;
  recipient: string;
  transactionId: string;
  navigation: NavigationScreenProp<any, any>;
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
          {numberWithCommas(amount)} RCoin has been sent to {recipient}
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
          onPress={() => {
            navigation.navigate('Dashboard');
            nextStage();
          }} //navigate to dashboard page
          label="Back to Dashboard"
          backgroundColor={styles.rcoin}
        />
      </View>
    </View>
    // <View flex>
    //   <View marginT-30 style={{alignSelf: 'center'}}>
    //     <Image source={require('../../style/Success.png')} />
    //   </View>
    //   <Text
    //     text40
    //     color={styles.rcoin}
    //     style={{
    //       textAlign: 'center',
    //       justifyContent: 'center',
    //       alignItems: 'center',
    //     }}>
    //     Successful
    //   </Text>

    //   <View margin-30>
    //     <Text style={styles.buttonCaption}>
    //       {amount} RCoin has successfully been sent to {recipient}
    //     </Text>
    //     <Text>Transaction ID = {transactionId}</Text>
    //   </View>
    //   <View flex bottom marginH-30 marginB-20>
    //     <Text style={styles.buttonCaption}>
    //       You can now see your updated balance on the dashboard
    //     </Text>
    //     <Button
    //       onPress={nextStage}
    //       label="RCoin Dashboard"
    //       backgroundColor={styles.rcoin}
    //     />
    //   </View>
    //   <View flex bottom marginH-30 marginB-50>
    //     <Button
    //       onPress={nextStage}
    //       label="Make another Transfer"
    //       backgroundColor={styles.rcoin}
    //     />
    //   </View>
    // </View>
  );
};

export default QR1Success;
