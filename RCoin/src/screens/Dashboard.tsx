import React from 'react';
import {Text, View, Image, TouchableOpacity, Button} from 'react-native-ui-lib';
import {RefreshControl, ScrollView} from 'react-native';
import Balance from '../components/Balances/Balance';
import ServiceLink from '../components/ServiceLink';
import MessagelessServiceLink from '../components/MessagelessServiceLink';
import Code from '../components/QRCode';
import style from '../style/style';
import {NavigationScreenProp} from 'react-navigation';
import {Linking} from 'react-native';
import Config from 'react-native-config';
import BalanceCard from '../components/Balances/BalanceCard';
import AuditCard from '../components/Balances/AuditCard';
import TransactionHistory from './TransactionHistory';
import FriendsWidget from '../components/FriendsWidget/FriendsWidget';

const Dashboard = ({
  navigation,
}: {
  navigation: NavigationScreenProp<any, any>;
}) => {
  const divider = <View style={style.thinDivider} />;

  return (
    <View>
      <View
        row
        centerV
        paddingH-30
        paddingV-10
        style={{justifyContent: 'space-between'}}>
        <View flexG paddingR-10>
          <BalanceCard />
        </View>
        <View flexS>
          <TouchableOpacity onPress={() => navigation.navigate('Code')}>
            <Image
              style={style.qrIcon}
              source={require('../style/QR-Icon.png')}
            />
          </TouchableOpacity>
        </View>
      </View>
      <View
        paddingH-30
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
        }}>
        <View flex>
          <Button
            margin-5
            label="Top Up"
            backgroundColor={style.rcoin}
            onPress={() => {
              navigation.navigate('Deposit');
            }}
          />
        </View>
        <View flex>
          <Button
            margin-5
            label="Withdraw"
            backgroundColor={style.rcoin}
            onPress={() => {
              navigation.navigate('Withdraw');
            }}
          />
        </View>
      </View>
      <View
        paddingH-30
        style={{flexDirection: 'row', justifyContent: 'space-between'}}>
        <View flex>
          <Button
            margin-5
            label="Send Money"
            backgroundColor={style.rcoin}
            onPress={() => {
              navigation.navigate('Transfer');
            }}
          />
        </View>
        <View flex>
          <Button
            margin-5
            label="Request Payment"
            backgroundColor={style.rcoin}
            onPress={() => {
              navigation.navigate('Merchant');
            }}
          />
        </View>
      </View>
      <AuditCard />
      <FriendsWidget navigation={navigation} />
      <TransactionHistory />
    </View>
    // <ScrollView>
    //   <TouchableOpacity onPress={() => navigation.navigate('Balance')}>
    //     <View marginH-30 marginT-15>
    //       <Text text40>RCoin Balance</Text>
    //       <Balance margin-30 />
    //       <View style={style.divider}>
    //         <Image source={require('../style/Divider.png')} />
    //       </View>
    //     </View>
    //   </TouchableOpacity>

    //   <TouchableOpacity onPress={() => navigation.navigate('Code')}>
    //     <Code title="QR Code" message={'View your own QR Code'} />
    //   </TouchableOpacity>

    //   <Text marginH-30 text40>
    //     Services
    //   </Text>
    //   <View style={style.divider}>
    //     <Image source={require('../style/Divider.png')} />
    //   </View>

    //   <ScrollView
    //   // refreshControl={
    //   //   <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
    //   // }
    //   >
    //     <TouchableOpacity onPress={() => Linking.openURL(Config.AUDIT_URL!)}>
    //       <MessagelessServiceLink title="View Real Time Audit" />
    //     </TouchableOpacity>
    //     {divider}
    //     <TouchableOpacity onPress={() => navigation.navigate('Merchant')}>
    //       <MessagelessServiceLink title="Request Payment" />
    //     </TouchableOpacity>
    //     {divider}
    //     <TouchableOpacity onPress={() => navigation.navigate('Deposit')}>
    //       <MessagelessServiceLink title="Deposit" />
    //     </TouchableOpacity>
    //     {divider}
    //     <TouchableOpacity onPress={() => navigation.navigate('Transfer')}>
    //       <MessagelessServiceLink title="Transfer" />
    //     </TouchableOpacity>
    //     {divider}
    //     <TouchableOpacity onPress={() => navigation.navigate('Withdraw')}>
    //       <MessagelessServiceLink title="Withdraw" />
    //     </TouchableOpacity>
    //     {divider}
    //   </ScrollView>
    // </ScrollView>
  );
};

export default Dashboard;
