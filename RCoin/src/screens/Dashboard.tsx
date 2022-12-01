import React from 'react';
import {Text, View, Image, TouchableOpacity} from 'react-native-ui-lib';
import {RefreshControl, ScrollView} from 'react-native';
import Balance from '../components/Balances/Balance';
import ServiceLink from '../components/ServiceLink';
import Code from '../components/QRCode';
import style from '../style/style';
import {NavigationScreenProp} from 'react-navigation';
import {Linking} from 'react-native';
import Config from 'react-native-config';

const HomeScreen = ({
  navigation,
}: {
  navigation: NavigationScreenProp<any, any>;
}) => {
  const divider = <View style={style.thinDivider} />;

  return (
    <ScrollView>
      <TouchableOpacity onPress={() => navigation.navigate('Balance')}>
        <View marginH-30 marginT-15>
          <Text text40>RCoin Balance</Text>
          <Balance margin-30 />
          <View style={style.divider}>
            <Image source={require('../style/Divider.png')} />
          </View>
        </View>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate('Code')}>
        <Code title="QR Code" message={'View your own QR Code'} />
      </TouchableOpacity>

      <Text marginH-30 text40>
        Services
      </Text>
      <View style={style.divider}>
        <Image source={require('../style/Divider.png')} />
      </View>

      <ScrollView
      // refreshControl={
      //   <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      // }
      >
        <TouchableOpacity onPress={() => navigation.navigate('Merchant')}>
          <ServiceLink
            title="Request a transfer"
            message={
              'A quick and easy way to accept payments. Enter the amount and show your sender the code.'
            }
          />
        </TouchableOpacity>
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
        <TouchableOpacity onPress={() => Linking.openURL(Config.AUDIT_URL!)}>
          <ServiceLink
            title="View Audit"
            message={
              'Visit our Audit website to ensure the each RCoin is backed up by a ZAR'
            }
          />
        </TouchableOpacity>
        {divider}
      </ScrollView>
    </ScrollView>
  );
};

export default HomeScreen;
