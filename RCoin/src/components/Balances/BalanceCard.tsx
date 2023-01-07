import React, {useEffect} from 'react';
import {LoaderScreen, Card, View, TouchableOpacity} from 'react-native-ui-lib';
import styles from '../../style/style';
import {useBalance} from '../../contexts/BalanceContext';
import BalanceCardBase from './BalanceCardBase';

const BalanceCard = () => {
  const balance_context = useBalance();

  const numberWithCommas = (x: number) => {
    const options = {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    };
    return Number(x).toLocaleString('en', options);
  };

  useEffect(() => {
    balance_context.refresh();
  }, []);

  if (balance_context.loading) {
    return (
      <View center height={100}>
        <LoaderScreen message={'Loading Balance'} color={styles.rcoin} />
      </View>
    );
  } else {
    return (
      <TouchableOpacity
        onPress={() => {
          balance_context.refresh();
        }}>
        <BalanceCardBase
          amount={balance_context.balance}
          subtext="RCoin Balance"
        />
      </TouchableOpacity>
    );
  }
};

export default BalanceCard;
