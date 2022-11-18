import React, {useEffect, useState} from 'react';
import {View, Image, LoaderScreen} from 'react-native-ui-lib';
import {useAuth} from '../../contexts/Auth';
import BalanceFormat from './BalanceFormat';
import styles from '../../style/style';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {useBalance} from '../../contexts/BalanceContext';

const ChangingBalance = ({deduction}: {deduction: number}) => {
  const auth = useAuth();
  const balance_context = useBalance();

  if (balance_context.loading) {
    return (
      <View center marginH-20 height={200}>
        <LoaderScreen
          margin-30
          message={'Loading Balance'}
          color={styles.rcoin}
        />
      </View>
    );
  } else {
    return (
      <View centerV center row>
        <View center marginH-20 height={200}>
          <BalanceFormat token_balance={balance_context.balance} />
          <View center>
            {deduction > 0 ? (
              <Image
                source={require('../../style/red-arrow-down.png')}
                style={{width: 40, height: 40}}
              />
            ) : (
              <Image
                source={require('../../style/green-arrow-down.png')}
                style={{width: 40, height: 40}}
              />
            )}
          </View>
          <BalanceFormat token_balance={balance_context.balance - deduction} />
        </View>
        <Ionicons.Button
          name="refresh-outline"
          color={styles.rcoin}
          backgroundColor="none"
          onPress={balance_context.refresh}
        />
      </View>
    );
  }
};

export default ChangingBalance;
