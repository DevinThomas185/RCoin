import React, { useEffect, useState } from "react";
import { Text, View, Card, Button, Colors, Incubator, Picker } from "react-native-ui-lib";
import { useAuth } from "../contexts/Auth";
const { TextField } = Incubator;
import styles from "../style/style"
import Balance from "../components/Balances/Balance"
import AmountEntry from "./AmountEntry";

// Select Account
const WithdrawStage1 = ({
  nextStage,
  setCoinsToWithdraw,
  setRandsBeingCredited,
  setBankAccount,
}: {
  nextStage: React.Dispatch<void>;
  setCoinsToWithdraw: React.Dispatch<React.SetStateAction<number>>;
  setRandsBeingCredited: React.Dispatch<React.SetStateAction<number>>;
  setBankAccount: React.Dispatch<React.SetStateAction<{ [key: string]: string }>>;
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
        data.forEach((element: { [key: string]: string }) => {
          setBankAccount(data[0])
        });
      })
      .catch(error => {
        console.log(error);
      });
  }, []);

  return (
    <View flex>
      <Text text40 style={styles.title}>
        Choose an Amount
      </Text>
      <View margin-20>
        <Balance />
      </View>

      <View margin-30>
        <Text>
          How much would you like to send?
        </Text>
        <AmountEntry setAmount={setCoinsToWithdraw} least_limit={0}/>
      </View>

      {/* <View margin-30>
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
        </Picker>
      </View> */}
      <View flex bottom marginH-30 marginB-20>
        <Button onPress={nextStage} label="Continue" backgroundColor={styles.rcoin} />
      </View>
    </View>
  );
}

export default WithdrawStage1