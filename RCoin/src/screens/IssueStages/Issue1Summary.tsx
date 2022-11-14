import { Text, View, Button, Colors } from "react-native-ui-lib";
import ChangingBalance from "../../components/Balances/ChangingBalance";

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

  return (
    <View flex>
      <Text text40 blue10 margin-30>
        Payment Summary
      </Text>
      <ChangingBalance deduction={-coins_to_issue} />
      <View margin-30>
        <Text>
          You are purchasing {'\n'}
          {coins_to_issue} RCoin {'\n'}
          for {'\n'}
          {rand_to_pay} Rand {'\n'}
        </Text>
      </View>

      <View flex bottom marginH-30 marginB-50>
        <Button onPress={() => { setStage(2) }} label="Continue" backgroundColor={Colors.blue10} />
      </View>
      <View flex bottom marginH-10 marginB-10>
        <Button onPress={() => { setStage(0) }} label="Back" />
      </View>
    </View>
  );
}

export default IssueSummary
