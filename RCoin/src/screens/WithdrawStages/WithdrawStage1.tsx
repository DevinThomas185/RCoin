import React, {useEffect, useState} from 'react';
import {Text, View, Button, Incubator, Card} from 'react-native-ui-lib';

import {useAuth} from '../../contexts/Auth';
import styles from '../../style/style';
import Config from 'react-native-config';
import {Picker} from 'react-native-wheel-pick';

// Select Account
const WithdrawStage1 = ({
  nextStage,
  setBankAccount,
  current_bank_account,
}: {
  nextStage: React.Dispatch<void>;
  setBankAccount: React.Dispatch<React.SetStateAction<{[key: string]: string}>>;
  current_bank_account: {[key: string]: string};
}) => {
  const auth = useAuth();

  const [bank_accounts, setBankAccounts] = useState<any[]>([]);

  let bank_account_items = bank_accounts.map(
    (item: {[key: string]: string}, i: number) => ({
      label:
        'Account ' + (i + 1) + ': ' + item.bank_account + ' ' + item.sort_code,
      value: item.bank_account + '|' + item.sort_code,
      align: Incubator.WheelPickerAlign.RIGHT,
    }),
  );

  useEffect(() => {
    fetch(`${Config.API_URL}:8000/api/get_default_bank_account`, {
      method: 'GET',
      headers: {
        'Content-type': 'application/json',
        Authorization: `Bearer ${auth.authData?.token}`,
      },
    })
      .then(res => res.json())
      .then(data => {
        console.log(data);
        setBankAccount(data);
      })
      .catch(error => {
        console.log(error);
      });

    fetch(`${Config.API_URL}:8000/api/get_bank_accounts`, {
      method: 'GET',
      headers: {
        'Content-type': 'application/json',
        Authorization: `Bearer ${auth.authData?.token}`,
      },
    })
      .then(res => res.json())
      .then(data => {
        console.log(data);
        setBankAccounts(data['bank_accounts']);
      })
      .catch(error => {
        console.log(error);
      });
  }, []);

  return (
    <View flex marginH-10>
      <View marginV-10>
        <Text text40 style={styles.title}>
          Choose Bank Account
        </Text>
        <Text text70>Choose the bank account to deposit the Rand into.</Text>
      </View>

      <View flex centerV>
        <View center>
          <Text text50>Selected Bank Account</Text>
        </View>
        <View
          marginV-10
          style={{
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <Text style={styles.bankDetails}>
            {current_bank_account['bank_account']}
            {'\n'}
            {current_bank_account['sort_code']}
          </Text>
          <Text style={styles.bankDetailsLabel}>
            Account Number
            {'\n'}
            Bank Code
          </Text>
        </View>
        <Card
          enableShadow
          center
          style={{flexDirection: 'row'}}
          activeOpacity={1}
          selectionOptions={{
            color: styles.rcoin,
            indicatorSize: 25,
            borderWidth: 3,
          }}>
          {/* <Incubator.WheelPicker
            initialValue={
              current_bank_account['bank_account'] +
              ' ' +
              current_bank_account['sort_code']
            }
            activeTextColor={styles.success}
            inactiveTextColor={styles.grey}
            items={bank_account_items}
            onChange={(new_bank_account: string) => {
              let split = new_bank_account.split('|');
              setBankAccount({
                bank_account: split[0],
                sort_code: split[1],
              });
            }}
          /> */}
          {current_bank_account.bank_account != '' && (
            <Picker
              style={{backgroundColor: 'white', width: 300, height: 215}}
              selectedValue={
                current_bank_account.bank_account +
                ' ' +
                current_bank_account.sort_code
              }
              pickerData={bank_accounts.map(
                bank_account =>
                  bank_account.bank_account + ' ' + bank_account.sort_code,
              )}
              onValueChange={(new_bank_account: string) => {
                let split = new_bank_account.split(' ');
                setBankAccount({
                  bank_account: split[0],
                  sort_code: split[1],
                });
              }}
            />
          )}
        </Card>
      </View>

      <View bottom marginV-10>
        <Button
          onPress={nextStage}
          label="Continue"
          backgroundColor={styles.rcoin}
        />
      </View>
    </View>
  );
};

export default WithdrawStage1;
