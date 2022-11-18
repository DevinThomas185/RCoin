import React from 'react';
import {Text, View, Image, TouchableOpacity} from 'react-native-ui-lib';
import Balance from '../components/Balances/Balance';
import ServiceLink from '../components/ServiceLink';
import style from '../style/style';
import {NavigationScreenProp} from 'react-navigation';

const HomeScreen = ({
  navigation,
}: {
  navigation: NavigationScreenProp<any, any>;
}) => {
  const divider = <View style={style.thinDivider} />;

  return (
    <View flex>
      <TouchableOpacity onPress={() => navigation.navigate('Balance')}>
        <View marginH-30 marginV-10>
          <Text text40>RCoin Balance</Text>
          <Balance marginH-30 />
          <View style={style.divider}>
            <Image source={require('../style/Divider.png')} />
          </View>
        </View>
      </TouchableOpacity>

      <Text marginH-30 text40 marginB-20>
        Services
      </Text>

      {divider}
      <TouchableOpacity onPress={() => navigation.navigate('Deposit')}>
        <ServiceLink
          title="Deposit"
          message={
            'Make a payment to acquire your RCoin.\nCompleted securely through Paystack.'
          }
        />
      </TouchableOpacity>
      {divider}
      <TouchableOpacity onPress={() => navigation.navigate('Transfer')}>
        <ServiceLink
          title="Transfer"
          message={
            'Send your RCoin to another user.\nYour transfer will be signed on the blockchain.'
          }
        />
      </TouchableOpacity>
      {divider}
      <TouchableOpacity onPress={() => navigation.navigate('Withdraw')}>
        <ServiceLink
          title="Withdraw"
          message={
            'Withdraw your RCoin as Rand.\nCompleted securely through Paystack.'
          }
        />
      </TouchableOpacity>
      {divider}
    </View>
  );
};

export default HomeScreen;
