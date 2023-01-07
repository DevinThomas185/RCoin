import React, {useState} from 'react';
import {Text, TouchableOpacity, View} from 'react-native-ui-lib';
import ServiceLink from '../../components/ServiceLink';
import style from '../../style/style';
import {NavigationScreenProp} from 'react-navigation';
import {useAuth} from '../../contexts/Auth';
import {launchImageLibrary} from 'react-native-image-picker';
import Config from 'react-native-config';
import FriendAvatar from '../../components/FriendAvatar';
import {ScrollView} from 'react-native';

const AccountSelect = ({
  navigation,
}: {
  navigation: NavigationScreenProp<any, any>;
}) => {
  const auth = useAuth();

  const divider = <View style={style.thinDivider} />;

  let names = ['A', 'Z'];
  let initials = 'AZ';
  if (auth.authData) {
    names = auth.authData?.token_info.name.split(' ');
    initials = names[0].charAt(0) + names[1].charAt(0);
  }

  return (
    <View flex>
      <View marginV-50 center>
        {auth.authData ? (
          <FriendAvatar
            size={100}
            first_name={names[0]}
            last_name={names[1]}
            wallet_id={auth.authData.token_info.wallet_id}
          />
        ) : (
          <></>
        )}
        <Text marginV-10 text40>
          {auth.authData?.token_info.name}
        </Text>
        <Text text70>{auth.authData?.token_info.email}</Text>
      </View>
      <ScrollView>
        <View flex>
          {divider}
          <TouchableOpacity
            onPress={() => navigation.navigate('Account Details')}>
            <ServiceLink
              title="Account Details"
              message={'View and change your account details'}
            />
          </TouchableOpacity>
          {divider}
          <TouchableOpacity
            onPress={() => navigation.navigate('Quick Contacts')}>
            <ServiceLink
              title="Edit Quick Contacts"
              message={'View and edit your quick contacts'}
            />
          </TouchableOpacity>
          {divider}
          <TouchableOpacity onPress={() => navigation.navigate('FAQ')}>
            <ServiceLink
              title="Frequently Asked Questions"
              message={'Find FAQs here'}
            />
          </TouchableOpacity>
          {divider}
          {/* <TouchableOpacity onPress={() => navigation.navigate('Support')}>
            <ServiceLink
              title="Support"
              message={'Is RCoin causing an issue? Contact us here!'}
            />
          </TouchableOpacity>
          {divider} */}
        </View>
      </ScrollView>
    </View>
  );
};

export default AccountSelect;
