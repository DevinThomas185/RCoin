import React, {useEffect, useState} from 'react';
import {Text, View, Button, Image} from 'react-native-ui-lib';
import {NavigationScreenProp} from 'react-navigation';
import styles from '../../style/style';

// Success
const WithdrawStage3 = ({
  navigation,
  nextStage,
  coins_to_withdraw,
  bank_account,
  transactionId,
}: {
  navigation: NavigationScreenProp<any, any>;
  nextStage: React.Dispatch<void>;
  coins_to_withdraw: number;
  bank_account: {[key: string]: string};
  transactionId: string;
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
          {numberWithCommas(coins_to_withdraw)} RCoin has been withdrawn into
        </Text>
        <View
          marginV-10
          style={{
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <Text style={styles.bankDetails}>
            {bank_account.bank_account}
            {'\n'}
            {bank_account.sort_code}
          </Text>
          <Text style={styles.bankDetailsLabel}>
            Account Number
            {'\n'}
            Bank Code
          </Text>
        </View>
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
          label="Make another withdrawal"
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
    //       {coins_to_withdraw} RCoin has successfully been withdrawn from your
    //       account.
    //     </Text>
    //     <Text style={styles.buttonCaption}>
    //       You will receive R{coins_to_withdraw} to the bank account{' '}
    //       {bank_account.bank_account} {bank_account.sort_code}.
    //     </Text>
    //     <Text style={styles.buttonCaption}>
    //       Transaction ID = {transactionId}
    //     </Text>
    //   </View>
    //   <View flex bottom marginH-30 marginB-20>
    //     <Text style={styles.buttonCaption}>
    //       You can now see your updated balance on the dashboard
    //     </Text>
    //     <Button
    //       onPress={() => {
    //         navigation.navigate('Home');
    //         nextStage();
    //       }}
    //       label="RCoin Dashboard"
    //       backgroundColor={styles.rcoin}
    //     />
    //   </View>
    //   <View flex bottom marginH-30 marginB-50>
    //     <Button
    //       onPress={nextStage}
    //       label="Make another Withdrawal"
    //       backgroundColor={styles.rcoin}
    //     />
    //   </View>

    //   {/* <Text text40 blue10 margin-30>
    //     Success
    //   </Text>
    //   <View margin-30>
    //     <Text text60 grey10 center>
    //       R{rands_being_credited} has been successfully redeemed!
    //     </Text>
    //   </View>
    //   <View flex bottom marginH-30 marginB-50>
    //     <Button label="Back to Dashboard" backgroundColor={Colors.blue10} />
    //     <Button marginT-10 onPress={nextStage} label="Make Another Withdrawal" backgroundColor={Colors.blue10} />
    //   </View> */}
    // </View>
  );
};

export default WithdrawStage3;
