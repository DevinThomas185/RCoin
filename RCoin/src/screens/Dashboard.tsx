import React from 'react';
import {View, Image, TouchableOpacity, Button, Text} from 'react-native-ui-lib';
import style from '../style/style';
import {NavigationScreenProp} from 'react-navigation';
import BalanceCard from '../components/Balances/BalanceCard';
import AuditCard from '../components/Balances/AuditCard';
import TransactionHistory from './TransactionHistory';
import FriendsWidget from '../components/FriendsWidget/FriendsWidget';
import {useAuth} from '../contexts/Auth';

const Dashboard = ({
  navigation,
}: {
  navigation: NavigationScreenProp<any, any>;
}) => {
  const auth = useAuth();
  return (
    <View flex>
      <View row centerV margin-10 style={{justifyContent: 'space-between'}}>
        <View flexG marginR-5>
          <BalanceCard />
        </View>
        <View flexS marginL-5>
          <TouchableOpacity onPress={() => navigation.navigate('Code')}>
            <Image
              style={style.qrIcon}
              source={require('../style/QR-Icon.png')}
            />
          </TouchableOpacity>
        </View>
      </View>
      <View
        style={{flexDirection: 'row', justifyContent: 'space-between'}}
        margin-10>
        <View flex marginR-5>
          <Button
            label="Top Up"
            backgroundColor={style.rcoin}
            onPress={() => {
              navigation.navigate('Deposit');
            }}
          />
        </View>
        {auth.authData?.token_info.is_merchant && (
          <View flex marginL-5>
            <Button
              label="Merchant Terminal"
              backgroundColor={style.rcoin}
              onPress={() => {
                navigation.navigate('Merchant');
              }}
            />
          </View>
        )}
      </View>
      <View margin-10>
        <AuditCard />
      </View>
      <View margin-10>
        {/* <Text text50 marginB-5>
          Quick Contacts
        </Text> */}
        <FriendsWidget navigation={navigation} />
      </View>
      <View margin-10 flex>
        {/* <Text text50 marginB-5>
          Transaction History
        </Text> */}
        <TransactionHistory />
      </View>
    </View>
  );
};

export default Dashboard;
