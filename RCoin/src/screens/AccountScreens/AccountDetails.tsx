import React from 'react';
import {View} from 'react-native-ui-lib';
import {useAuth} from '../../contexts/Auth';
import EmailDetail from '../../components/AccountDetails/Email';
import NameDetail from '../../components/AccountDetails/Name';
import BankAccounts from '../../components/AccountDetails/BankAccounts';
import {ScrollView} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {Wallet} from '../../components/AccountDetails/Wallet';

const AccountDetails = () => {
  const auth = useAuth();

  return (
    <ScrollView contentContainerStyle={{flexGrow: 1}}>
      <Wallet />
      <NameDetail />
      <EmailDetail />
      <BankAccounts />
    </ScrollView>
  );
};

export default AccountDetails;
