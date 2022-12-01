import React, {useState} from 'react';
import {Text, View, Button, Incubator, Image} from 'react-native-ui-lib';
const {TextField} = Incubator;
import styles from '../../style/style';
import AmountEntry from '../../components/AmountEntry';

// Select the recipient
const Merchant0Amount = ({
  nextStage,
  setAmount,
}: {
  nextStage: React.Dispatch<void>;
  setAmount: React.Dispatch<React.SetStateAction<number>>;
}) => {
  const [valid, setValid] = useState(false);

  return (
    <View flex>
      <Text text40 style={styles.title}>
        Requesting a Transfer
      </Text>
      <View marginH-30 marginV-20>
        <Text>
          While in merchant mode easily request a transfer by entering the
          amount and generate a code for your customer to scan.
        </Text>
      </View>

      <View marginH-30>
        <View>
          <Text>How much would you like to recieve?</Text>
        </View>
        <View>
          <AmountEntry
            setAmount={setAmount}
            least_limit={5}
            max_limit={1000000}
            tellButton={setValid}
          />
        </View>
      </View>
      <Image
        source={require('../../style/RCoin-RCoin.png')}
        style={{width: '100%', height: 130}}
      />
      <View flex bottom marginH-30 marginB-50>
        <Button
          onPress={nextStage}
          disabled={!valid}
          label="Continue to Choose Amount"
          backgroundColor={styles.rcoin}
        />
      </View>
    </View>
  );
};

export default Merchant0Amount;
