import React, {useState} from 'react';
import {Text, View, Image} from 'react-native-ui-lib';
import styles from '../../style/style';

// Select the amount
const BalanceFormat = ({token_balance}: {token_balance: number}) => {
  const [timeUpdated, setTimeUpdated] = useState(0.0);

  const numberWithCommas = (x: number) => {
    const options = {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    };
    return Number(x).toLocaleString('en', options);
  };

  return (
    <View style={{flexDirection: 'row'}} center>
      <Image
        source={require('../../style/Logo.png')}
        style={styles.balanceLogo}
      />
      <Text text30 grey10 left>
        {numberWithCommas(token_balance)}
      </Text>
    </View>
  );
};

export default BalanceFormat;
