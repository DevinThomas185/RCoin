import {useEffect, useState} from 'react';
import {StyleSheet} from 'react-native';
import {View, Button, Incubator, Text, LoaderScreen} from 'react-native-ui-lib'; //eslint-disable-line
import {Table, Row, Rows} from 'react-native-table-component';
import {UserSignUp} from '../../types/SignUp';
const {TextField} = Incubator;
import {NavigationScreenProp} from 'react-navigation';
import Config from 'react-native-config';
import * as bip39 from '../../best_practice_here/bip39';

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
  const [tableData, setTableData] = useState<string[][]>([]);

  useEffect(() => {
    const mnemonic = bip39.generateMnemonic();

    const publicKey: Promise<PublicKey> = keyPair.writePair(
      mnemonic,
      signUpDetails.encryption_password,
    );
    const tableData_: string[][] = [];
    const mnemonicArray = mnemonic.split(' ');
    const NUM_ROWS = 4;
    const NUM_COLS = 3;
    for (var i = 0; i < NUM_ROWS; ++i) {
      const row: string[] = [];
      for (let j = 0; j < NUM_COLS; ++j) {
        row.push(`${i * NUM_COLS + j + 1}. ${mnemonicArray[i * NUM_COLS + j]}`);
      }
      tableData_.push(row);
    }
    setTableData(tableData_);

    publicKey.then((pk: PublicKey | undefined) => {
      fetch(`${Config.API_URL}:8000/api/signup`, {
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
            wallet_id: pk,
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
          }
        })
        .catch(error => console.log(error));
    });
  }, []);

  return (
    <>
      {loading ? (
        <LoaderScreen message={'Signing Up'} />
      ) : (
        <View>
          <Text>
            Please write down your recovery phrase. It can be used to recover
            your account in case you lose your phone.
          </Text>
          <Table borderStyle={{borderWidth: 2, borderColor: '#c8e1ff'}}>
            <Rows data={tableData} textStyle={styles.text} />
          </Table>
          <Button label={'Done'} onPress={() => navigation.navigate('Login')} />
        </View>
      )}
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
  text: {color: 'black', margin: 6},
  head: {height: 40, backgroundColor: '#f1f8ff'},
});
