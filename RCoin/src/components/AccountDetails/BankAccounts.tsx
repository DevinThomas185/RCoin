import {
  Card,
  Text,
  View,
  Incubator,
  Button,
  TouchableOpacity,
} from 'react-native-ui-lib';
import {useAuth} from '../../contexts/Auth';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {useEffect, useState} from 'react';
import styles from '../../style/style';
const {TextField} = Incubator;
import Config from 'react-native-config';
import DeleteBankAccount from './DeleteBankAccount';

const BankAccounts = () => {
  const auth = useAuth();

  const [open, setOpen] = useState(false);
  const [deleteVisible, setDeleteVisible] = useState(false);
  const [toDeleteBankAccount, setToDeleteBankAccount] = useState('');
  const [toDeleteSortcode, setToDeleteSortcode] = useState('');

  const [newBankAccount, setNewBankAccount] = useState('');
  const [newSortcode, setNewSortcode] = useState('');
  const [responded, setResponded] = useState(false);
  const [success, setSuccess] = useState(false);

  const initArr: any[] = [];
  const [bank_accounts, setBankAccounts] = useState<any[]>(initArr);
  const [default_bank_account, setDefaultBankAccount] = useState({
    bank_account: '',
    sort_code: '',
  });

  const refresh = () => {
    fetch(`${Config.API_URL}/api/get_bank_accounts`, {
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

    fetch(`${Config.API_URL}/api/get_default_bank_account`, {
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
  };

  useEffect(() => {
    refresh();
  }, []);

  const setNewDefaultBankAccount = (
    bank_account: string,
    sort_code: string,
  ) => {
    fetch(`${Config.API_URL}/api/set_default_bank_account`, {
      method: 'POST',
      headers: {
        'Content-type': 'application/json',
        Authorization: `Bearer ${auth.authData?.token}`,
      },
      body: JSON.stringify(
        {
          user_id: auth.authData?.token_info.user_id,
          bank_account: bank_account,
          sort_code: sort_code,
        },
        null,
        2,
      ),
    })
      .then(res => {
        if (res.status == 200) {
          refresh();
        }
      })
      .catch(error => {
        console.log(error);
        refresh();
      });
  };

  const addBankAccount = () => {
    fetch(`${Config.API_URL}/api/add_bank_account`, {
      method: 'POST',
      headers: {
        'Content-type': 'application/json',
        Authorization: `Bearer ${auth.authData?.token}`,
      },
      body: JSON.stringify(
        {
          user_id: auth.authData?.token_info.user_id,
          bank_account: newBankAccount,
          sort_code: newSortcode,
          recipient_code: '',
          default: false,
        },
        null,
        2,
      ),
    })
      .then(res => {
        setResponded(true);
        if (res.status == 200) {
          setSuccess(true);
          refresh();
        }
      })
      .catch(error => {
        console.log(error);
        refresh();
      });
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
                onPress={() => {
                  setNewDefaultBankAccount(acc.bank_account, acc.sort_code);
                }}
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
                  if (acc.bank_account != default_bank_account.bank_account) {
                    setToDeleteBankAccount(acc.bank_account);
                    setToDeleteSortcode(acc.sort_code);
                    setDeleteVisible(true);
                  }
                }}
                color={
                  acc.bank_account == default_bank_account.bank_account
                    ? styles.grey
                    : styles.failed
                }
              />
            </View>
          ))}
          <View spread centerV>
            <TextField
              marginV-5
              placeholder="Account Number"
              style={styles.input}
              onChangeText={(value: string) => {
                setNewBankAccount(value);
              }}
              marginH-10
            />
            <TextField
              placeholder="Sortcode"
              style={styles.input}
              onChangeText={(value: string) => {
                setNewSortcode(value);
              }}
              marginH-10
            />
            <View center marginB-5>
              {responded ? (
                success ? (
                  <Text color={styles.success}>Bank Account Added!</Text>
                ) : (
                  <Text color={styles.failed}>Bank Account Not Added</Text>
                )
              ) : (
                <></>
              )}
            </View>
            <Button
              marginH-10
              marginB-10
              onPress={addBankAccount}
              label="Add Bank Account"
              backgroundColor={styles.rcoin}
            />
          </View>
        </View>
      ) : (
        <></>
      )}
      <DeleteBankAccount
        bank_account={toDeleteBankAccount}
        sort_code={toDeleteSortcode}
        isVisible={deleteVisible}
        setIsVisible={setDeleteVisible}
        onSuccess={refresh}
      />
    </Card>
  );
};

export default BankAccounts;
