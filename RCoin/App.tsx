import React, {useState, useEffect} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import IssueScreen from './src/screens/IssueScreen';
import TransferScreen from './src/screens/TransferScreen';
import WithdrawScreen from './src/screens/WithdrawScreen';
import AccountScreen from './src/screens/AccountScreen';
import QRScreen from './src/screens/QRScreen';
import {AuthProvider, useAuth} from './src/contexts/Auth';
import {AuthStack} from './src/routes/AuthStack';
import {KeypairProvider} from './src/contexts/Keypair';
import Ionicons from 'react-native-vector-icons/Ionicons';
import styles from './src/style/style';
import {Image, LoaderScreen} from 'react-native-ui-lib';
import Home from './src/screens/Home';
import {BalanceProvider} from './src/contexts/BalanceContext';
import {NotificationContainer} from './src/components/NotificationContainer';
import {LogBox} from 'react-native';

const Tab = createBottomTabNavigator();
LogBox.ignoreLogs(['Invalid prop textStyle of type array supplied to Cell']);

const App = () => {
  const AuthRouter = ({children}: {children: JSX.Element}) => {
    const {authData, loading} = useAuth();
    if (loading) {
      return (
        <LoaderScreen
          overlay
          backgroundColor={styles.rcoin}
          loaderColor="white"
          message="Loading Dashboard"
          messageStyle={{color: 'white'}}
        />
      );
    }

    return (
      <NavigationContainer>
        {authData ? (
          <NotificationContainer>{children}</NotificationContainer>
        ) : (
          <AuthStack />
        )}
      </NavigationContainer>
    );
  };

  return (
    <KeypairProvider>
      <AuthProvider>
        <BalanceProvider>
          <AuthRouter>
            <Tab.Navigator
              screenOptions={({route}) => ({
                tabBarIcon: ({focused, color, size}) => {
                  let iconName;

                  if (route.name === 'Home') {
                    iconName = focused ? 'home' : 'home-outline';
                  } else if (route.name === 'Deposit') {
                    iconName = focused ? 'card' : 'card-outline';
                  } else if (route.name === 'Transfer') {
                    iconName = focused ? 'send' : 'send-outline';
                  } else if (route.name === 'Withdraw') {
                    iconName = focused ? 'cash' : 'cash-outline';
                  } else if (route.name === 'Account') {
                    iconName = focused ? 'person' : 'person-outline';
                  }

                  return <Ionicons name={iconName} size={size} color={color} />;
                },
                headerLeft: () => (
                  <Image
                    source={require('./src/style/Logo.png')}
                    style={styles.balanceLogo}
                  />
                ),
                // headerRight: (props) => (
                //   <TouchableOpacity
                //     onPress={() =>
                //       // navigation.navigate('Home')
                //       console.log('need to navigate to qr code page')
                //     }>
                //     <Image
                //       source={require('./src/style/QR-Icon.png')}
                //       style={styles.qrLogo}
                //     />
                //   </TouchableOpacity>
                // ),
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
              })}>
              <Tab.Screen name="Home" component={Home} />
              <Tab.Screen name="Deposit" component={IssueScreen} />
              <Tab.Screen
                name="Transfer"
                component={TransferScreen}
                initialParams={{
                  qr_amount: 0,
                  qr_recipient: '',
                }}
              />
              <Tab.Screen name="Withdraw" component={WithdrawScreen} />
              <Tab.Screen name="Account" component={AccountScreen} />
            </Tab.Navigator>
          </AuthRouter>
        </BalanceProvider>
      </AuthProvider>
    </KeypairProvider>
  );
};

export default App;
