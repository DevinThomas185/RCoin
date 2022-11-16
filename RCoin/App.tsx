import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Dashboard from './src/screens/Dashboard';
import TransferScreen from './src/screens/TransferScreen';
import {AuthProvider, useAuth} from './src/contexts/Auth';
import {AuthStack} from './src/routes/AuthStack';
import WithdrawScreen from './src/screens/WithdrawScreen';
import IssueScreen from './src/screens/IssueScreen';
import {KeypairProvider} from './src/contexts/Keypair';
import Ionicons from 'react-native-vector-icons/Ionicons';
import styles from './src/style/style'
import { LoaderScreen } from 'react-native-ui-lib';

const Tab = createBottomTabNavigator();

const App = () => {
  const AuthRouter = ({ children }: { children: React.ReactNode }) => {
    const { authData, loading } = useAuth();

    if (loading) {
      return (
        <LoaderScreen 
          overlay
          backgroundColor={styles.rcoin}
          loaderColor='white'
          message="Loading Dashboard"
          messageStyle={{color: 'white'}}
        />
      );
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
          <Tab.Navigator
            screenOptions={({ route }) => ({
              tabBarIcon: ({ focused, color, size }) => {
                let iconName;
    
                if (route.name === 'Home') {
                  iconName = focused
                    ? 'home'
                    : 'home-outline';
                } else if (route.name === 'Deposit') {
                  iconName = focused 
                    ? 'card'
                    : 'card-outline';
                } else if (route.name === 'Transfer') {
                  iconName = focused
                    ? 'send'
                    : 'send-outline';
                } else if (route.name === 'Withdraw') {
                  iconName = focused
                    ? 'cash'
                    : 'cash-outline';
                }
    
                return <Ionicons name={iconName} size={size} color={color} />;
              },
              tabBarActiveTintColor: styles.success,
              tabBarInactiveTintColor: styles.rcoin,
              headerStyle: {
                backgroundColor: styles.rcoin,
              },
              headerTintColor: 'white',
              headerTitleStyle: {
                fontWeight: 'bold',
              },
              headerTitleAlign: 'center',
              // headerShown: false,
            })}
          >
            <Tab.Screen name="Home" component={Dashboard} />
            <Tab.Screen name="Deposit" component={IssueScreen} />
            <Tab.Screen name="Transfer" component={TransferScreen} />
            <Tab.Screen name="Withdraw" component={WithdrawScreen} />
          </Tab.Navigator>
        </AuthRouter>
      </AuthProvider>
    </KeypairProvider>
  );
};

export default App;
