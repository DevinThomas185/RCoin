import React, { useRef } from 'react';
import { Paystack, paystackProps } from 'react-native-paystack-webview';
import { Text, View, Button, Colors } from "react-native-ui-lib";
import ChangingBalance from "../../components/Balances/ChangingBalance";
import { TouchableOpacity } from 'react-native';

// Show the summary
const IssueSummary = ({
  nextStage,
  coins_to_issue,
  rand_to_pay,
}: {
  nextStage: React.Dispatch<void>;
  coins_to_issue: number;
  rand_to_pay: number;
}) => {

  const paystackWebViewRef = useRef<paystackProps.PayStackRef>();
  return (
    <View flex>
      <Text text40 blue10 margin-30>
        Payment Summary
      </Text>
      <ChangingBalance deduction={-coins_to_issue} />
      <View margin-30>
        <IssueReceipt rand_to_pay={rand_to_pay} coins_to_issue={coins_to_issue}/>
      </View>

      <Paystack
        billingEmail={'email@email.com'}
        amount={'1000.00'}
        paystackKey="pk_test_74b1d55fbad5fc6c5bb27a7d6030a0e575aa75f4"
        currency="ZAR"
        activityIndicatorColor="blue"
        onCancel={(e) => {
          // handle response here
          setStage(1)
        }}
        onSuccess={(res) => {
          // handle response here
          setStage(2)
        }}
        ref={paystackWebViewRef}
      />

      <View flex bottom marginH-10 marginB-10>
        <Button onPress={() => paystackWebViewRef.current.startTransaction()} label="Pay Now" />
      </View>
      <View flex bottom marginH-10 marginB-10>
        <Button onPress={() => { setStage(0) }} label="Back" />
      </View>
    </View>
  );
}

export default IssueSummary
