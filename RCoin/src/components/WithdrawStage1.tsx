import React, { useEffect, useState } from "react";
import { Text, View, Card, Button, Colors, Incubator, Picker } from "react-native-ui-lib";
import { useAuth } from "../contexts/Auth";
const { TextField } = Incubator;

// Select Account
const WithdrawStage1 = ({
  nextStage,
  coins_to_withdraw,
  rands_being_credited,
  current_bank_account,
  setBankAccount,
}: {
  nextStage: React.Dispatch<void>;
  coins_to_withdraw: number;
  rands_being_credited: number;
  current_bank_account: {[key: string]: string};
  setBankAccount: React.Dispatch<React.SetStateAction<{[key: string]: string}>>;
}) => {

  const auth = useAuth();

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
      data.forEach((element: {[key: string]: string}) => {
        setBankAccount(data[0])
      });
    })
    .catch(error => {
      console.log(error);
    });
  }, []);

  return (
    <View flex>
      <Text text40 blue10 margin-30>
        Select Account
      </Text>
      <View margin-30>
        <Text text60 grey10>
          Select which account you'd like to be paid into
        </Text>
        <Text text70 marginT-20>
          Bank Account: {current_bank_account["bank_account"]}
        </Text>
        <Text text70 marginT-20>
          Sort Code: {current_bank_account["sort_code"]}
        </Text>
        {/* <Picker
          migrateTextField
          useWheelPicker
          value={current_bank_account["bank_account"]}
          onChange={(account: string) => {setBankAccount(account)}}  
        >
          {bank_accounts.map((account) => {
            return <Picker.Item 
                      key={account["bank_account"]}
                      value={account["bank_account"]}
                      label={"Account: " + account["bank_account"]}
                    />
          })}
        </Picker> */}
      </View>
      <View flex bottom marginH-30 marginB-50>
        <Button onPress={nextStage} label="Confirm Account" backgroundColor={Colors.blue10} />
      </View>
    </View>
  );
}

export default WithdrawStage1