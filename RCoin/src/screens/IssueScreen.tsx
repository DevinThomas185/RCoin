import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import React from 'react';
import MakingADeposit from './IssueStages/MakingADeposit'
import PaymentSummary from './IssueStages/PaymentSummary'
import PaymentConfirmation from './IssueStages/PaymentConfirmation'

const Tab = createMaterialTopTabNavigator();

const IssueScreen = () => {
  return (
    <Tab.Navigator>
      <Tab.Screen name="Making A Deposit" component={MakingADeposit} />
      <Tab.Screen name="Payment Summary" component={PaymentSummary} />
      <Tab.Screen name="Payment Confirmation" component={PaymentConfirmation} />
    </Tab.Navigator>
  );
};

export default IssueScreen;