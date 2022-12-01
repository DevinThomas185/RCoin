import React, {useState} from 'react';
import {StyleSheet} from 'react-native';
import {Button, Incubator, Text, View} from 'react-native-ui-lib';
import {useAuth} from '../../contexts/Auth';
import {useKeypair} from '../../contexts/Keypair';
import {Table, Rows} from 'react-native-table-component';

const {TextField} = Incubator;

export const Mnemonic = () => {
  const [walletPass, setWalletPass] = useState('');
  const [mnemonic, setMnemonic] = useState('');
  const [tableData, setTableData] = useState<string[][]>([]);

  const keyPair = useKeypair();
  const auth = useAuth();

  const handleSubmit = async () => {
    const mnem = await keyPair.readMnemonic(
      walletPass,
      auth.authData?.token_info.wallet_id!,
    );

    if (mnem !== undefined) {
      setMnemonic(mnem);
      const tableData_: string[][] = [];
      const mnemonicArray = mnem.split(' ');
      const NUM_ROWS = 4;
      const NUM_COLS = 3;
      for (var i = 0; i < NUM_ROWS; ++i) {
        const row: string[] = [];
        for (let j = 0; j < NUM_COLS; ++j) {
          row.push(
            `${i * NUM_COLS + j + 1}. ${mnemonicArray[i * NUM_COLS + j]}`,
          );
        }
        tableData_.push(row);
      }
      setTableData(tableData_);
    }
  };

  return (
    <View style={styles.screen}>
      {mnemonic === '' ? (
        <>
          <Text style={styles.title}>View Secret Phrase</Text>
          <TextField
            margin-10
            placeholder={'Wallet Password'}
            placeholderTextColor={'gray'}
            onChangeText={(password: string) => setWalletPass(password)}
            secureTextEntry
            style={styles.inputField}
          />

          <Button
            label="Submit"
            onPress={handleSubmit}
            disabled={walletPass === ''}
          />
        </>
      ) : (
        <>
          <Text style={styles.title}>Secret Phrase</Text>
          <Table borderStyle={{borderWidth: 2, borderColor: '#c8e1ff'}}>
            <Rows data={tableData} textStyle={styles.text} />
          </Table>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  title: {
    fontWeight: 'bold',
    fontSize: 30,
    textAlign: 'left',
  },
  text: {color: 'black', margin: 6},
  inputField: {
    padding: 14,
    fontSize: 18,
    height: 50,
    textAlign: 'left',
    backgroundColor: '#f5f5f5',
    borderColor: '#d1d1d1',
    borderWidth: 1,
    borderRadius: 5,
    marginTop: 10,
    marginBottom: 10,
  },
  screen: {
    marginStart: 20,
    marginEnd: 20,
    marginBottom: 20,
  },
});
