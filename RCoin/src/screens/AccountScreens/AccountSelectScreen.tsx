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
        <Image
          source={require('../../style/deposit.png')}
          style={{width: 100, height: 100, borderRadius: 50}}
        />
        <Text marginV-10 text40>
          {auth.authData?.token_info.name}
        </Text>
        <Text text70>{auth.authData?.token_info.email}</Text>
        {auth.authData?.token_info.trust_score == undefined ? (
          <Text>Undefined</Text>
        ) : auth.authData.token_info.trust_score > 1.04 ? (
          <Text>Min</Text>
        ) : auth.authData.token_info.trust_score > 1.03 ? (
          <Text>Low</Text>
        ) : auth.authData.token_info.trust_score > 1.02 ? (
          <Text>Mid</Text>
        ) : auth.authData.token_info.trust_score > 1.01 ? (
          <Text>High</Text>
        ) : auth.authData.token_info.trust_score > 1 ? (
          <Text>Max</Text>
        ) : (
          <></>
        )}
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
        <TouchableOpacity onPress={() => navigation.navigate('Common Payees')}>
          <ServiceLink
            title="Edit Common Payees"
            message={'View and edit your common payees'}
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
