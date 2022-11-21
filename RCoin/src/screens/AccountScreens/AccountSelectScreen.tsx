import React from 'react';
import {Image, Text, TouchableOpacity, View} from 'react-native-ui-lib';
import ServiceLink from '../../components/ServiceLink';
import style from '../../style/style';
import {NavigationScreenProp} from 'react-navigation';
import {useAuth} from '../../contexts/Auth';

const AccountSelect = ({
  navigation,
}: {
  navigation: NavigationScreenProp<any, any>;
}) => {
  const auth = useAuth();

  const divider = <View style={style.thinDivider} />;

  return (
    <View flex>
      <View marginV-50 center>
        <Text marginV-10 text40>
          {auth.authData?.token_info.name}
        </Text>
        <Text text70>{auth.authData?.token_info.email}</Text>
      </View>

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
        <TouchableOpacity onPress={() => navigation.navigate('FAQ')}>
          <ServiceLink
            title="Frequently Asked Questions"
            message={'Find FAQs here'}
          />
        </TouchableOpacity>
        {divider}
        <TouchableOpacity onPress={() => navigation.navigate('Support')}>
          <ServiceLink
            title="Support"
            message={'Is RCoin causing an issue? Contact us here!'}
          />
        </TouchableOpacity>
        {divider}
      </View>
    </View>
  );
};

export default AccountSelect;
