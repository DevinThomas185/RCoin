import React from 'react';
import {Card, Image, Text, View} from 'react-native-ui-lib';
import styles from '../../style/style';

const IssueReceipt = ({
  coins_to_issue,
  rand_to_pay,
}: {
  coins_to_issue: number;
  rand_to_pay: number;
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
        <View marginH-5 marginV-10>
          <Text text60 center color={styles.rcoin}>
            You are converting
          </Text>
          <Text text60 center color={styles.rcoin}>
            ZAR {numberWithCommas(rand_to_pay)}
          </Text>
        </View>
        <Image
          source={require('../../style/ZAR-RCoin.png')}
          style={{width: '60%', height: 130 * 0.6}}
        />
        <View>
          <Text text60 center color={styles.rcoin}>
            into
          </Text>
        </View>
        <View marginH-5 marginB-10 row center>
          <Image
            source={require('../../style/Logo.png')}
            style={{width: 40, height: 40}}
          />
          <Text text60 color={styles.rcoin}>
            {numberWithCommas(coins_to_issue)}
          </Text>
        </View>
      </View>
    </Card>
  );
};

export default IssueReceipt;
