import React from 'react';
import {Text, View} from 'react-native';
import {Paystack} from 'react-native-paystack-webview';

const DepositScreen = () => {
  return (
    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
      <Paystack
        billingEmail={'email@email.com'}
        amount={'1000.00'}
        paystackKey="pk_test_74b1d55fbad5fc6c5bb27a7d6030a0e575aa75f4"
        currency="ZAR"
        activityIndicatorColor="blue"
        autoStart={true}
      />
    </View>
  );
};

export default DepositScreen;
