import React from 'react';
import {Image, Text, TouchableOpacity, View} from 'react-native-ui-lib';
import ServiceLink from '../components/ServiceLink';
import style from '../style/style';
import {NavigationScreenProp} from 'react-navigation';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import AccountSelect from './AccountScreens/AccountSelectScreen';
import SupportScreen from './AccountScreens/SupportScreen';
import FAQScreen from './AccountScreens/FAQScreen';
import AccountDetails from './AccountScreens/AccountDetails';
import FriendsScreen from './AccountScreens/FriendsScreen';

const Stack = createNativeStackNavigator();

const AccountScreen = () => {
  return (
    <View flex>
      <Stack.Navigator>
        <Stack.Screen
          name="AccountSelect"
          component={AccountSelect}
          options={{headerShown: false}}
        />
        <Stack.Screen name="Quick Contacts" component={FriendsScreen} />
        <Stack.Screen name="FAQ" component={FAQScreen} />
        <Stack.Screen name="Support" component={SupportScreen} />
        <Stack.Screen name="Account Details" component={AccountDetails} />
      </Stack.Navigator>
    </View>
  );
};

export default AccountScreen;
