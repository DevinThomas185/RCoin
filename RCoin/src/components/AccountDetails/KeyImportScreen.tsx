import React, {useState} from 'react';
import {StyleSheet} from 'react-native';
import {
  Spacings,
  View,
  Incubator,
  Button,
  Text,
  Card,
} from 'react-native-ui-lib';
const {TextField} = Incubator;
import {NavigationScreenProp} from 'react-navigation';
import {KeyImportTextField} from '../KeyImportTextField';
import {useKeypair} from '../../contexts/Keypair';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {useAuth} from '../../contexts/Auth';
import {Table, TableWrapper, Cell} from 'react-native-table-component';
import Style from '../../style/style';

export const KeyImportScreen = ({
  setOpen,
}: {
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const [mnemArray, setMnemArray] = useState(new Array(12).fill(''));
  const [walletPass, _setWalletPass] = useState('');
  const [isDisabled, setIsDisabled] = useState(true);
  const [failed, setFailed] = useState(false);
  const keypair = useKeypair();
  const auth = useAuth();
  const pk: string = auth.authData?.token_info.wallet_id.toString()!;

  const handleIsDisabled = (pass: string, arr: string[]) => {
    setIsDisabled(
      arr.find((t: string) => {
        return t === '';
      }) !== undefined || pass === '',
    );
  };

  const setWalletPass = (password: string) => {
    _setWalletPass(password);
    handleIsDisabled(password, mnemArray);
  };

  const setArrayLoc = (pos: number, text: string) => {
    const temp: string[] = [...mnemArray];
    temp[pos] = text.trim().toLowerCase();
    setMnemArray(temp);
    handleIsDisabled(walletPass, temp);
  };

  const handleSubmit = async () => {
    const mnemonic: string = mnemArray.reduce((prev: string, curr: string) => {
      return `${prev} ${curr}`;
    });
    const success = await keypair.restoreSecretKey(mnemonic, walletPass, pk);
    setFailed(!success);
    if (success) {
      setOpen(false);
    }
  };

  const cell = (pos: number) => {
    return <KeyImportTextField pos={pos} setArrayLoc={setArrayLoc} />;
  };

  const NUM_COLS: number = 3;
  const tableData: string[][] = [
    ['', '', ''],
    ['', '', ''],
    ['', '', ''],
    ['', '', ''],
  ];

  return (
    <View style={styles.screen}>
      <Text style={styles.title}>Restore Key</Text>
      <Text style={styles.subtext}>Please enter your secret phrase</Text>
      <View style={{height: '50%'}}>
        <Table borderStyle={{borderWidth: 2, borderColor: '#c8e1ff'}}>
          {tableData.map((rowData: string[], index: number) => (
            <TableWrapper key={index} style={styles.row}>
              {rowData.map((_, cellIndex: number) => (
                <Cell
                  key={cellIndex}
                  data={cell(cellIndex + index * NUM_COLS)}
                  textStyle={styles.subtext}
                />
              ))}
            </TableWrapper>
          ))}
        </Table>

        {failed ? (
          <View style={{width: '80%'}}>
            <Text style={styles.error_text}>
              The secret phase and/or password provided do not match the key of
              this account
            </Text>
          </View>
        ) : (
          <>
            <Text />
            <Text />
          </>
        )}
        <TextField
          margin-10
          placeholder={'Wallet Password'}
          placeholderTextColor={'gray'}
          onChangeText={(password: string) => setWalletPass(password)}
          secureTextEntry
          style={styles.inputField}
        />
      </View>

      <Button
        backgroundColor={Style.rcoin}
        label="Submit"
        onPress={handleSubmit}
        disabled={isDisabled}
        style={styles.button}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  title: {
    fontWeight: 'bold',
    fontSize: 30,
    textAlign: 'left',
    marginLeft: 20,
  },

  subtext: {
    padding: 20,
    color: 'grey',
  },

  error_text: {
    color: 'red',
  },

  inputField: {
    padding: 14,
    fontSize: 18,
    height: 50,
    textAlign: 'left',
    backgroundColor: '#f5f5f5',
    borderColor: '#d1d1d1',
    borderWidth: 1,
    borderRadius: 5,
  },

  button: {
    marginTop: 20,
    width: '90%',
    justifyContent: 'center',
    alignSelf: 'center',
  },

  screen: {
    marginStart: 20,
    marginEnd: 20,
  },

  row: {
    flexDirection: 'row',
    alignSelf: 'center',
  },
});
