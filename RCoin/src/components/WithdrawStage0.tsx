import React, { useEffect, useState } from "react";
import { Text, View, Card, Button, Colors, Incubator, Image } from "react-native-ui-lib";
import { useAuth } from "../contexts/Auth";
const { TextField } = Incubator
import styles from "../style/style"

const LEAST_LIMIT = 0

// Select the amount
const WithdrawStage0 = ({
  nextStage,
}: {
  nextStage: React.Dispatch<void>;
}) => {
  return (
    <View flex>
      <Text text40 style={styles.title}>
        Make a Withdrawal
      </Text>
      <View style={{ marginHorizontal: 30 }}>
        <Text>
          You can withdraw RCoin as Rand at any time.
          {'\n'}
          {'\n'}
          The transaction will appear on both your accounts as well as the real time audit.
        </Text>
      </View>

      <Image
        source={require('../style/RCoin-ZAR.png')}
        style={{ width: '100%', height: 130, marginVertical: 30 }}
      />

      <View flex bottom marginH-30 marginB-20>
        <Button onPress={nextStage} label="Continue" backgroundColor={styles.rcoin} />
      </View>
    </View>
  );
}

export default WithdrawStage0