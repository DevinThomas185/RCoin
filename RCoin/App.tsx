import React, { useEffect, useState } from 'react';

import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from './src/screens/HomeScreen';
import DepositScreen from './src/screens/DepositScreen';
import TransferScreen from './src/screens/TransferScreen';
import LoginScreen from './src/screens/LoginScreen';
import { Text, TextInput, TouchableOpacity, View } from 'react-native';
import { AuthProvider, useAuth } from './src/contexts/Auth';


const Tab = createBottomTabNavigator();

const App = () => {
  // const [isAuth, setIsAuth] = useState(false);
  // const [isLoadingAuth, setIsLoadingAuth] = useState(true);

  // useEffect(() => {
  //   const requestOptions = {
  //     method: 'POST',
  //     headers: {
  //       'Content-Type': 'application/json',
  //     },
  //   };

  //   fetch('http://10.0.2.2:8000/api/authenticated', requestOptions)
  //     .then(res => res.json())
  //     .then(data => {
  //       setIsAuth(data['authenticated']);
  //       setIsLoadingAuth(false);
  //     });
  // }, []);

  const AuthRouter = ({ children }: { children: React.ReactNode }) => {
    const { authData, loading } = useAuth();

    if (loading) {
      // Have a loading component
      return <Text>Loading</Text>;
    }

    return (
      <NavigationContainer>
        {authData ? children : <LoginScreen />}
      </NavigationContainer>
    );
  };

  return (
    <AuthProvider>
      <AuthRouter>
        <Tab.Navigator>
          <Tab.Screen name="Home" component={HomeScreen} />
          <Tab.Screen name="Deposit" component={DepositScreen} />
          <Tab.Screen name="Transfer" component={TransferScreen} />
        </Tab.Navigator>
      </AuthRouter>
    </AuthProvider>
  );
  // } else {
  //   return <LoginScreen setIsAuth={setIsAuth} />;
  // }
};

export default App;
