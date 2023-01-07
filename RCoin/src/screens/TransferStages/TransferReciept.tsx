import React from 'react';
import {Card, Image, Text, View} from 'react-native-ui-lib';
import {useFriends} from '../../contexts/FriendContext';
import styles from '../../style/style';

const TransferReciept = ({email, amount}: {email: string; amount: number}) => {
  const numberWithCommas = (x: number) => {
    const options = {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    };
    return Number(x).toLocaleString('en', options);
  };

  const friends_context = useFriends();

  return (
    <Card enableShadow>
      <View center padding-10>
        <View marginH-5 marginV-10>
          <Text text60 center color={styles.rcoin}>
            You are sending
          </Text>
          <View marginH-5 row center>
            <Image
              source={require('../../style/Logo.png')}
              style={{width: 40, height: 40}}
            />
            <Text text60 color={styles.rcoin}>
              {numberWithCommas(amount)}
            </Text>
          </View>
        </View>
        <Image
          source={require('../../style/RCoin-RCoin.png')}
          style={{width: '60%', height: 130 * 0.6}}
        />
        <View marginB-10>
          <Text text60 center color={styles.rcoin}>
            to
          </Text>
          <Text text60 center color={styles.rcoin}>
            {friends_context.match_email(email)}
          </Text>
        </View>
      </View>
    </Card>
  );
};

export default TransferReciept;
