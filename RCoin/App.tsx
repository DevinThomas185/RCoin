import React, {useEffect, useState} from 'react';

import {NavigationContainer} from '@react-navigation/native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import HomeScreen from './src/screens/HomeScreen';
import DepositScreen from './src/screens/DepositScreen';
import TransferScreen from './src/screens/TransferScreen';
import {Text, TextInput, TouchableOpacity, View} from 'react-native';
import {AuthProvider, useAuth} from './src/contexts/Auth';
import {AuthStack} from './src/routes/AuthStack';
import WithdrawScreen from './src/screens/WithdrawScreen';
import IssueScreen from './src/screens/IssueScreen';
import {KeypairProvider} from './src/contexts/Keypair';

const Tab = createBottomTabNavigator();

const App = () => {
  const AuthRouter = ({children}: {children: React.ReactNode}) => {
    const {authData, loading} = useAuth();

    if (loading) {
      // Have a loading component
      return <Text>Loading</Text>;
    }

    return (
      <NavigationContainer>
        {authData ? children : <AuthStack />}
      </NavigationContainer>
    );
  };

  return (
    <KeypairProvider>
      <AuthProvider>
        <AuthRouter>
          <Tab.Navigator>
            <Tab.Screen name="Home" component={HomeScreen} />
            <Tab.Screen name="Issue" component={IssueScreen} />
            <Tab.Screen name="Deposit" component={DepositScreen} />
            <Tab.Screen name="Transfer" component={TransferScreen} />
            <Tab.Screen name="Withdraw" component={WithdrawScreen} />
          </Tab.Navigator>
        </AuthRouter>
      </AuthProvider>
    </KeypairProvider>
  );
  // } else {
  //   return <LoginScreen setIsAuth={setIsAuth} />;
  // }
};

export default App;
