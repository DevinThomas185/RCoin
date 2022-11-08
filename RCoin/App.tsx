import React from 'react';

import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from './Screens/HomeScreen';
import DepositScreen from './Screens/DepositScreen';
import TransferScreen from './Screens/TransferScreen';

const Tab = createBottomTabNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Tab.Navigator>
        <Tab.Screen name="Home" component={HomeScreen} />
        <Tab.Screen name="Deposit" component={DepositScreen} />
        <Tab.Screen name="Transfer" component={TransferScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}

export default App;