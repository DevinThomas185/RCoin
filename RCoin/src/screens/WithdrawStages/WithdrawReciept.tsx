import React, {useEffect, useState} from 'react';
import {
  Text,
  View,
  Card,
  Button,
  Colors,
  Incubator,
  Image,
} from 'react-native-ui-lib';
import {useAuth} from '../../contexts/Auth';
import styles from '../../style/style';
const {TextField} = Incubator;

// Select the amount
const Reciept = ({
  coins,
  bank_account,
}: {
  coins: number;
  bank_account: {[key: string]: string};
}) => {
  const numberWithCommas = (x: number) => {
    const options = {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    };
    return Number(x).toLocaleString('en', options);
  };

  return (
    <Card enableShadow>
      <View center padding-10>
        <View marginV-10>
          <Text text60 center color={styles.rcoin}>
            You are withdrawing
          </Text>
        </View>
        <View marginH-5 row center>
          <Image
            source={require('../../style/Logo.png')}
            style={{width: 40, height: 40}}
          />
          <Text text60 color={styles.rcoin}>
            {numberWithCommas(coins)}
          </Text>
        </View>
        <Image
          source={require('../../style/RCoin-ZAR.png')}
          style={{width: '60%', height: 130 * 0.6}}
        />
        <View marginH-5 marginV-10>
          <Text text60 center color={styles.rcoin}>
            as ZAR {numberWithCommas(coins)} into
          </Text>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <Text style={styles.bankDetails}>
              {bank_account['bank_account']}
              {'\n'}
              {bank_account['sort_code']}
            </Text>
            <Text style={styles.bankDetailsLabel}>
              Account Number
              {'\n'}
              Bank Code
            </Text>
          </View>
        </View>
      </View>
    </Card>
  );
};

export default Reciept;
