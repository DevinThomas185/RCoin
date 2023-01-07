import React, {useState} from 'react';
import {Text, View, Button} from 'react-native-ui-lib';
import styles from '../../style/style';
import {useFriends} from '../../contexts/FriendContext';
import NumberKeyboard from '../../components/NumberKeyboard/NumberKeyboard';
import ChangingBalanceCard from '../../components/Balances/ChangingBalanceCard';

// Select the amount
const Transfer1Amount = ({
  amount,
  nextStage,
  setAmount,
  recipient,
}: {
  amount: number;
  nextStage: React.Dispatch<void>;
  setAmount: React.Dispatch<React.SetStateAction<number>>;
  recipient: string;
}) => {
  const [valid, setValid] = useState(false);
  const friends_context = useFriends();

  return (
    <View flex marginH-10>
      <View marginV-10>
        <Text text40 style={styles.title}>
          Choose the Amount
        </Text>
        <Text text70>
          How many RCoin would you like to send to{' '}
          {friends_context.match_email(recipient)}?
        </Text>
      </View>

      <View>
        <ChangingBalanceCard increment={-amount} />
      </View>

      <View flex bottom marginV-10>
        <NumberKeyboard
          style={{
            borderTopLeftRadius: 10,
            borderTopRightRadius: 10,
            borderBottomLeftRadius: 0,
            borderBottomRightRadius: 0,
          }}
          number={amount}
          setNumber={x => {
            setAmount(x);
          }}
          setValid={setValid}
          limit_to_balance={true}
        />
        <Button
          style={{
            borderTopLeftRadius: 0,
            borderTopRightRadius: 0,
            borderBottomLeftRadius: 10,
            borderBottomRightRadius: 10,
          }}
          onPress={() => {
            nextStage();
          }}
          label="Continue to Confirmation"
          disabled={!valid}
          backgroundColor={styles.paystack}
        />
      </View>
    </View>
  );
};

export default Transfer1Amount;
