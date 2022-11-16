import React, {useRef} from 'react';
import {Paystack, paystackProps} from 'react-native-paystack-webview';
import {Text, View, Button} from 'react-native-ui-lib';
import ChangingBalance from '../../components/Balances/ChangingBalance';
import IssueReceipt from './IssueReceipt';
import styles from '../../style/style';
import {useAuth} from '../../contexts/Auth';

// Show the summary
const IssueSummary = ({
  setStage,
  coins_to_issue,
  rand_to_pay,
}: {
  setStage: React.Dispatch<React.SetStateAction<number>>;
  coins_to_issue: number;
  rand_to_pay: number;
}) => {
  const auth = useAuth();
  const paystackWebViewRef = useRef<paystackProps.PayStackRef>();

  return (
    <View flex>
      <Text text40 blue10 margin-30>
        Payment Summary
      </Text>
      <ChangingBalance deduction={-coins_to_issue} />
      <View margin-30>
        <IssueReceipt
          rand_to_pay={rand_to_pay}
          coins_to_issue={coins_to_issue}
        />
      </View>

      <Paystack
        billingEmail={auth.authData?.token_info.email}
        amount={rand_to_pay}
        paystackKey="pk_test_74b1d55fbad5fc6c5bb27a7d6030a0e575aa75f4"
        currency="ZAR"
        activityIndicatorColor={styles.rcoin}
        // This is used to hold user id because we can't pass in custom props
        billingName={auth.authData?.token_info.user_id}
        onCancel={() => {
          // handle response here
          setStage(1);
        }}
        onSuccess={() => {
          // handle response here
          setStage(2);
        }}
        ref={paystackWebViewRef}
      />

      <View flex bottom marginH-30 marginB-50>
        <Button
          onPress={() => paystackWebViewRef.current.startTransaction()}
          label="Pay with Paystack"
          backgroundColor={styles.paystack}
        />
      </View>
    </View>
  );
};

export default IssueSummary;
