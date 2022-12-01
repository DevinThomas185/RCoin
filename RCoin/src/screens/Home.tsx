import React, {useEffect, useState} from 'react';
import Dashboard from './Dashboard';
import TransactionHistory from './TransactionHistory';
import QRCode from './QRScreen';
import MerchantScreen from './MerchantScreen';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import MerchantTransferScreen from './MerchantTransferScreen';
const Stack = createNativeStackNavigator();

const Home = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Dashboard"
        component={Dashboard}
        options={{headerShown: false}}
      />
      <Stack.Screen name="Balance" component={TransactionHistory} />
      <Stack.Screen
        name="Code"
        component={QRCode}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="Merchant"
        component={MerchantScreen}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="MerchantTransfer"
        component={MerchantTransferScreen}
        initialParams={{
          qr_amount: 0,
          qr_recipient: '',
        }}
      />
    </Stack.Navigator>
  );
};

export default Home;
