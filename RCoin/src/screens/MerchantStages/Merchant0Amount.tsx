import React, {useState} from 'react';
import {Text, View, Button, Incubator, Image} from 'react-native-ui-lib';
const {TextField} = Incubator;
import styles from '../../style/style';
import AmountEntry from '../../components/AmountEntry';
import ChangingBalanceCard from '../../components/Balances/ChangingBalanceCard';
import NumberKeyboard from '../../components/NumberKeyboard/NumberKeyboard';

// Select the recipient
const Merchant0Amount = ({
  nextStage,
  setAmount,
  amount,
}: {
  nextStage: React.Dispatch<void>;
  setAmount: React.Dispatch<React.SetStateAction<number>>;
  amount: number;
}) => {
  const [valid, setValid] = useState(false);

  return (
    <View flex marginH-10>
      <View marginV-10>
        <Text text40 style={styles.title}>
          Choose the Amount
        </Text>
        <Text text70>How many RCoin is the transaction worth?</Text>
      </View>

      <View flex center>
        <Image
          source={require('../../style/RCoin-RCoin.png')}
          style={{width: '100%', height: 130}}
        />
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
          limit_to_balance={false}
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
          label="Generate QR Code"
          disabled={!valid}
          backgroundColor={styles.paystack}
        />
      </View>
    </View>
  );
};

export default Merchant0Amount;
