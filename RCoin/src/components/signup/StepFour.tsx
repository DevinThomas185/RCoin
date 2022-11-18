import {useEffect, useState} from 'react';
import {StyleSheet} from 'react-native';
import {View, Button, Incubator, Text, LoaderScreen} from 'react-native-ui-lib'; //eslint-disable-line
import {UserSignUp} from '../../types/SignUp';
const {TextField} = Incubator;
import {NavigationScreenProp} from 'react-navigation';

// https://github.com/uuidjs/uuid/issues/416
import {v4 as uuidv4} from 'uuid'; // Very important, do not remove plz!!!!!

import {useKeypair} from '../../contexts/Keypair';
import {
  Transaction,
  Connection,
  sendAndConfirmTransaction,
  Keypair,
  Signer,
  PublicKey,
} from '@solana/web3.js';

export const StepFour = ({
  navigation,
  signUpDetails,
  setSignUpDetails,
}: {
  navigation: NavigationScreenProp<any, any>;
  signUpDetails: UserSignUp;
  setSignUpDetails: React.Dispatch<React.SetStateAction<UserSignUp>>;
}) => {
  const [loading, setLoading] = useState(true);
  const keyPair = useKeypair();

  useEffect(() => {
    const kp = Keypair.generate();

    keyPair.writePair(kp, signUpDetails.encryption_password);
    // console.log(keyPair.keypairData);

    fetch('http://10.0.2.2:8000/api/signup', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(
        {
          email: signUpDetails.email,
          password: signUpDetails.password,
          first_name: signUpDetails.firstName,
          last_name: signUpDetails.lastName,
          wallet_id: kp.publicKey,
          bank_account: signUpDetails.bankAccountNumber,
          sort_code: signUpDetails.bankCode,
          document_number: signUpDetails.IDNumber,
          recipient_code: '',
        },
        null,
        2,
      ),
    })
      .then(res => {
        if (!res.ok) {
          throw new Error('signup failed');
        }
        return res.json();
      })
      .then(data => {
        if (data['success']) {
          // Wait some time before switching?
          setLoading(false);
          navigation.navigate('Login');
        }
      })
      .catch(error => console.log(error));
  }, []);

  return (
    <>
      {loading && <LoaderScreen message={'Signing Up'} />}
      {!loading && <Text>Done</Text>}
    </>
  );
};

const styles = StyleSheet.create({
  inputField: {
    padding: 14,
    fontSize: 18,
    width: '80%',
    justifyContent: 'center',
    alignSelf: 'center',
  },

  button: {
    padding: 14,
    margin: 20,
    width: '80%',
    justifyContent: 'center',
    alignSelf: 'center',
  },

  signup: {
    justifyContent: 'center',
    alignSelf: 'center',
  },
});
