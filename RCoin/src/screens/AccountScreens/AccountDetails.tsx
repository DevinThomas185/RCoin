import React from 'react';
import {useAuth} from '../../contexts/Auth';
import EmailDetail from '../../components/AccountDetails/Email';
import NameDetail from '../../components/AccountDetails/Name';
import BankAccounts from '../../components/AccountDetails/BankAccounts';
import {ScrollView} from 'react-native';
import {Wallet} from '../../components/AccountDetails/Wallet';
import PinSettings from '../../components/AccountDetails/PinSettings';

const AccountDetails = () => {
  const auth = useAuth();

  return (
    <ScrollView contentContainerStyle={{flexGrow: 1}}>
      <NameDetail />
      <EmailDetail />
      <Wallet />
      <BankAccounts />
      <PinSettings />
    </ScrollView>
  );
};

export default AccountDetails;
