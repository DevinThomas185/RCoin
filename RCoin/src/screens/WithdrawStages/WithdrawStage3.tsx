import React from "react";
import { Text, View, Button } from "react-native-ui-lib";
import { Svg, Circle, Path } from 'react-native-svg';
import styles from "../../style/style"

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
  bank_account: { [key: string]: string };
}) => {

  return (
    <View flex>
      <View marginT-30 style={{ alignSelf: "center" }}>
        <Svg height="100" width="100" >
          <Circle cx="43.5" cy="43.5" r="43.5" fill="#5DB075" />
          <Path d="M27.6818 43.4999L38.2148 55.3635L59.3181 31.6362" stroke="white" stroke-width="15" stroke-linecap="round" stroke-linejoin="round" />
        </Svg>
      </View>
      <Text text40 color={styles.rcoin} style={{
        textAlign: 'center',
        justifyContent: 'center',
        alignItems: 'center'
      }}>Successful</Text>

      <View margin-30>
        <Text style={styles.buttonCaption}>
          {rands_being_credited} RCoin has successfuly been withdrawn from your account {'\n'}
          Transaction ID = asdkljf238ak92p3jhk239asdfih2lir3
        </Text>
      </View>
      <View flex bottom marginH-30 marginB-20>
        <Text style={styles.buttonCaption}>
          You can now see your updated balance on the dashboard
        </Text>
        <Button onPress={nextStage} label="RCoin Dashboard" backgroundColor={styles.rcoin} />
      </View>
      <View flex bottom marginH-30 marginB-50>
        <Button onPress={nextStage} label="Make another Withdrawal" backgroundColor={styles.rcoin} />
      </View>



      {/* <Text text40 blue10 margin-30>
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
      </View> */}
    </View>
  );
}

export default WithdrawStage3