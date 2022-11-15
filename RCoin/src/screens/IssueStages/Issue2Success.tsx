import React from "react";
import { Text, View, Button } from "react-native-ui-lib";
import styles from "../../style/style"

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
      <Text text40 blue10 margin-30>
        Confirmation
      </Text>
      <View margin-30>
        <Text>
          Your payment has been successful.
          {'\n'}
          {'\n'}
          We have received {rand_to_pay} Rand and are now processing your deposit. {'\n'}
        </Text>
      </View>
      <View flex bottom marginH-10 marginB-10>
        <Button onPress={() => { setStage(0) }} label="Continue" backgroundColor={Colors.blue10} />
      </View>
      <View flex bottom marginH-10 marginB-10>
        <Button onPress={() => { setStage(1) }} label="Back" />
      </View>
    </View>
  );
}

export default IssueSuccess
