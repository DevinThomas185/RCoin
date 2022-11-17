import React, {useState} from 'react';
import {Text, View, Button, Incubator, Image} from 'react-native-ui-lib';
import {useAuth} from '../../contexts/Auth';
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
  const auth = useAuth();
  const [valid, setValid] = useState(false);

  function isEmailValid(email: string): Promise<boolean> {
    return fetch('http://10.0.2.2:8000/api/trade-email-valid', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${auth.authData?.token}`,
      },
      body: JSON.stringify({email: email}, null, 2),
    })
      .then(res => {
        if (!res.ok) {
          throw new Error('Could not make check email valid request');
        }
        return res.json();
      })
      .then(data => {
        console.log(data);
        setValid(data['valid']);
        return data['valid'];
      })
      .catch(error => {
        console.log(error);
        return false;
      });
  }

  const continueButton = () => {
    if (valid) {
      return (
        <Button
          onPress={nextStage}
          label="Continue to Choose Amount"
          backgroundColor={styles.rcoin}
        />
      );
    } else {
      return (
        <Button
          onPress={() => {}}
          label="Continue to Choose Amount"
          backgroundColor={styles.grey}
        />
      );
    }
  };

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
          keyboardType="email"
          onChangeText={(email: string) => {
            setRecipient(email);
          }}
          enableErrors
          validateOnBlur
          validationMessage={[
            'Email is required',
            'Email must be associated to an account',
          ]}
          validate={[
            'required',
            (email: string) => {
              return !isEmailValid(email).then(res => res);
            },
          ]}
        />
      </View>
      <View flex bottom marginH-30 marginB-50>
        {continueButton()}
      </View>
    </View>
  );
};

export default Transfer0Email;