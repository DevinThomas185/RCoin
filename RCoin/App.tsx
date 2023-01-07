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
import {
  Image,
  LoaderScreen,
  Text,
  Button,
  View,
  TouchableOpacity,
} from 'react-native-ui-lib';
import Home from './src/screens/Home';
import {BalanceProvider} from './src/contexts/BalanceContext';
import Style from './src/style/style';
import SpinningRCoin from './src/style/SpinningRCoin';
import {NotificationContainer} from './src/components/NotificationContainer';
import {LogBox} from 'react-native';
import {AuditProvider} from './src/contexts/AuditContext';
import {FriendProvider} from './src/contexts/FriendContext';

const Tab = createBottomTabNavigator();
LogBox.ignoreLogs(['Invalid prop textStyle of type array supplied to Cell']);

// Text.defaultProps = Text.defaultProps || {};
// Text.defaultProps.style = {fontFamily: 'monospace'};

const App = () => {
  const AuthRouter = ({children}: {children: JSX.Element}) => {
    const {authData, loading} = useAuth();

    if (authData?.token_info.suspended) {
      return (
        <View flex center>
          <Image
            source={require('./src/style/Logo.png')}
            style={{width: 100, height: 100}}
          />
          <Text center text10 color={Style.rcoin} margin-10>
            Hey{' '}
            {authData?.token_info.name.substring(
              0,
              authData?.token_info.name.indexOf(' '),
            )}
            !
          </Text>
          <Text center text40 color={Style.rcoin} margin-10>
            Please do not be alarmed
          </Text>
          <Text center text60 color={Style.rcoin} margin-10>
            Your account has been temporarily suspended due to a suspected
            fraudulent transaction.
          </Text>
          <Text center text60 color={Style.rcoin} margin-10>
            You will be contacted by a member of the RCoin team shortly to help
            to resolve this and hopefully get you back online with RCoin!
          </Text>
          <Image href="./src/style/Logo.png" />
        </View>
      );
    }

    if (loading) {
      return <SpinningRCoin />;
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
          <FriendProvider>
            <AuditProvider>
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

                      return (
                        <Ionicons name={iconName} size={size} color={color} />
                      );
                    },
                    // headerLeft: () => (
                    //   <Image
                    //     source={require('./src/style/Logo.png')}
                    //     style={styles.balanceLogo}
                    //   />
                    // ),
                    header: () => (
                      <View center backgroundColor={styles.rcoin}>
                        <Image
                          source={require('./src/style/Logo.png')}
                          style={styles.balanceLogo}
                        />
                      </View>
                    ),
                    // headerRight: props => (
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
                    // headerStyle: {
                    //   backgroundColor: styles.rcoin,
                    // },
                    // headerTintColor: 'white',
                    // headerTitleStyle: {
                    //   fontWeight: 'bold',
                    // },
                    // headerTitleAlign: 'center',
                    // headerShown: false,
                    unmountOnBlur: true,
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
            </AuditProvider>
          </FriendProvider>
        </BalanceProvider>
      </AuthProvider>
    </KeypairProvider>
  );
};

export default App;
