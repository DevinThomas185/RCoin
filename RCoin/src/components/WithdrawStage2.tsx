import React, { useEffect, useState } from "react";
import { Text, View, Card, Button, Colors, Incubator } from "react-native-ui-lib";
const { TextField } = Incubator

// Confirmation
const WithdrawStage1 = ({
  nextStage,
  token_balance,
  coins_to_withdraw,
  rands_being_credited,
}: {
  nextStage: React.Dispatch<void>;
  token_balance: number;
  coins_to_withdraw: number;
  rands_being_credited: number;
}) => {

  const new_balance = token_balance - coins_to_withdraw;

  return (
    <View flex>
      <Text text40 blue10 margin-30>
        Confirmation
      </Text>
      <View margin-30>
        <Text text60 grey10>
          You are withdrawing {coins_to_withdraw} RCoin
        </Text>
        <Text text60T grey10 marginT-20>
          You will be credited with R{rands_being_credited} to your chosen account
        </Text>
      </View>
      <View margin-30>
        <Text text50 center>
          Your balance will decrease to {new_balance} RCoin
        </Text>
      </View>
      <View flex bottom marginH-30 marginB-50>
        <Button onPress={nextStage} label="Confirm Withdrawal" backgroundColor={Colors.blue10} />
      </View>
    </View>
  );
}

export default WithdrawStage1