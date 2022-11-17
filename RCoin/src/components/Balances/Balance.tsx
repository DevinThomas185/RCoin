import React, {useEffect} from 'react';
import {LoaderScreen, Text, View} from 'react-native-ui-lib';
import BalanceFormat from './BalanceFormat';
import styles from '../../style/style';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {useBalance} from '../../contexts/BalanceContext';

const Balance = () => {
  const balance_context = useBalance();

  useEffect(() => {
    balance_context.refresh();
  }, []);

  if (balance_context.loading) {
    return (
      <View center marginV-20 height={100}>
        <LoaderScreen message={'Loading Balance'} color={styles.rcoin} />
      </View>
    );
  } else {
    return (
      <View height={100} center marginV-20>
        <Text>Current RCoin Balance</Text>
        <View row style={{justifyContent: 'center', alignItems: 'center'}}>
          <BalanceFormat token_balance={balance_context.balance} />
          <Ionicons.Button
            name="refresh-outline"
            color={styles.rcoin}
            backgroundColor="none"
            onPress={balance_context.refresh}
          />
        </View>
        {/* <Text>{balance_context.time_since_updated_string}</Text> */}
      </View>
    );
  }
};

export default Balance;
