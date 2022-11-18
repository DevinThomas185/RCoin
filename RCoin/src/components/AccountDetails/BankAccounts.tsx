import {Card, Text, View, Incubator, Button, Modal} from 'react-native-ui-lib';
import {useAuth} from '../../contexts/Auth';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {useEffect, useState} from 'react';
import styles from '../../style/style';
const {TextField} = Incubator;

const BankAccounts = () => {
  const auth = useAuth();

  const [open, setOpen] = useState(false);

  const initArr: any[] = [];
  const [bank_accounts, setBankAccounts] = useState<any[]>(initArr);
  const [default_bank_account, setDefaultBankAccount] = useState({
    bank_account: '',
    sort_code: '',
  });

  useEffect(() => {
    fetch('http://10.0.2.2:8000/api/get_bank_accounts', {
      method: 'GET',
      headers: {
        'Content-type': 'application/json',
        Authorization: `Bearer ${auth.authData?.token}`,
      },
    })
      .then(res => res.json())
      .then(data => {
        setBankAccounts(data['bank_accounts']);
      })
      .catch(error => {
        console.log(error);
      });

    fetch('http://10.0.2.2:8000/api/get_default_bank_account', {
      method: 'GET',
      headers: {
        'Content-type': 'application/json',
        Authorization: `Bearer ${auth.authData?.token}`,
      },
    })
      .then(res => res.json())
      .then(data => {
        setDefaultBankAccount(data);
      })
      .catch(error => {
        console.log(error);
      });
  }, []);

  const deleteBankAccount = ({
    account,
  }: {
    account: {[key: string]: string};
  }) => {};

  const deletePopup = ({account}: {account: {[key: string]: string}}) => {
    <View></View>;
  };

  return (
    <Card
      style={{marginBottom: 15}}
      onPress={() => {
        setOpen(!open);
      }}
      enableShadow>
      <View margin-20 spread row centerV>
        <Text text60 $textDefault>
          Bank Accounts
        </Text>
        <Ionicons size={30} name={open ? 'chevron-up' : 'chevron-down'} />
      </View>
      {open ? (
        <View spread centerV>
          {bank_accounts.map((acc, i) => (
            <View row spread marginH-20 marginV-5 centerV key={i}>
              <Ionicons
                size={30}
                name="checkmark-circle-outline"
                color={
                  acc.bank_account == default_bank_account.bank_account
                    ? styles.success
                    : styles.grey
                }
              />
              <Text text70>Account {i + 1}</Text>
              <Text>{acc.bank_account}</Text>
              <Text>{acc.sort_code}</Text>
              <Ionicons
                size={30}
                name="trash-outline"
                onPress={() => {
                  deletePopup(acc);
                }}
                color={styles.failed}
              />
            </View>
          ))}
        </View>
      ) : (
        <></>
      )}
    </Card>
  );
};

export default BankAccounts;
