import React from 'react';
import { View } from "react-native-ui-lib";
import { useAuth } from '../../contexts/Auth';
import EmailDetail from "../../components/AccountDetails/Email"
import NameDetail from '../../components/AccountDetails/Name';
import BankAccounts from '../../components/AccountDetails/BankAccounts';

const AccountDetails = () => {

  const auth = useAuth();

  return (
    <View flex>
       <NameDetail />
       <EmailDetail />
       <BankAccounts />
    </View>
  )
}

export default AccountDetails;
