import React from 'react';
import {Text, View, Button, Incubator, Image} from 'react-native-ui-lib';
const {TextField} = Incubator;
import styles from '../../style/style';

// Select the recipient
const Transfer0Email = ({
  nextStage,
  setRecipient,
}: {
  nextStage: React.Dispatch<void>;
  setRecipient: React.Dispatch<React.SetStateAction<string>>;
}) => {
  return (
    <View flex>
      <Text text40 style={styles.title}>
        Make a Transfer
      </Text>
      <View style={{marginHorizontal: 30}}>
        <Text>
          You can send RCoin to any other user. Simply enter the email of the
          recipient and choose the amount.
          {'\n'}
          {'\n'}
          The transaction will appear in both of your transaction histories as
          well as the Real-Time Audit.
        </Text>
      </View>

      <Image
        source={require('../../style/RCoin-RCoin.png')}
        style={{width: '100%', height: 130}}
      />

      <View margin-30>
        <Text>Who would you like to send RCoin to?</Text>
        <TextField
          placeholder="Email of Recipient"
          style={styles.input}
          validationMessage={['Email is required']}
          keyboardType="email"
          onChangeText={(email: string) => {
            setRecipient(email);
          }}
        />
      </View>
      <View flex bottom marginH-30 marginB-50>
        <Button
          onPress={nextStage}
          label="Continue to Choose Amount"
          backgroundColor={styles.rcoin}
        />
      </View>
    </View>
  );
};

export default Transfer0Email;
