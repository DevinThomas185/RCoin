import { Text, View, Button, Colors } from "react-native-ui-lib";
import ChangingBalance from "../../components/Balances/ChangingBalance";
import styles from "../../style/style";
import IssueReceipt from "./IssueReceipt";

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

  return (
    <View flex>
      <Text text40 blue10 margin-30>
        Payment Summary
      </Text>
      <ChangingBalance deduction={-coins_to_issue} />
      <View margin-30>
        <IssueReceipt rand_to_pay={rand_to_pay} coins_to_issue={coins_to_issue}/>
      </View>

      <View flex bottom marginH-30 marginB-50>
        <Button onPress={nextStage} label="Purchase RCoin" backgroundColor={styles.rcoin} />
      </View>
    </View>
  );
}

export default IssueSummary
