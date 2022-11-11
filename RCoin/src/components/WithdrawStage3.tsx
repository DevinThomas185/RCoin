import React, { useEffect, useState } from "react";
import { Text, View, Card, Button, Colors, Incubator } from "react-native-ui-lib";
const { TextField } = Incubator

// Success
const WithdrawStage3 = ({
  nextStage,
  coins_to_withdraw,
  rands_being_credited,
  bank_account,
}: {
  nextStage: React.Dispatch<void>;
  coins_to_withdraw: number;
  rands_being_credited: number;
  bank_account: {[key: string]: string};
}) => {

  return (
    <View flex>
      <Text text40 blue10 margin-30>
        Success
      </Text>
      <View margin-30>
        <Text text60 grey10 center>
          R{rands_being_credited} has been successfully redeemed!
        </Text>
      </View>
      <View flex bottom marginH-30 marginB-50>
        <Button label="Back to Dashboard" backgroundColor={Colors.blue10} />
        <Button marginT-10 onPress={nextStage} label="Make Another Withdrawal" backgroundColor={Colors.blue10} />
      </View>
    </View>
  );
}

export default WithdrawStage3