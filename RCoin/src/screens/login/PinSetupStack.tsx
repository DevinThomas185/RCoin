import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import {PinSetupScreen1} from './PinSetupScreen1';
import {PinSetupScreen2} from './PinSetupScreen2';

const Stack = createStackNavigator();

export const PinSetupStack = () => {
  return (
    <Stack.Navigator
      initialRouteName={'Step 1'}
      screenOptions={{
        headerShown: false,
      }}>
      <Stack.Screen name="Step 1" component={PinSetupScreen1} />
      <Stack.Screen name="Step 2" component={PinSetupScreen2} />
    </Stack.Navigator>
  );
};
