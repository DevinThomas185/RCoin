import React, {useEffect} from 'react';
import {
  LoaderScreen,
  Card,
  View,
  TouchableOpacity,
  Text,
  Image,
} from 'react-native-ui-lib';
import styles from '../../style/style';
import {useBalance} from '../../contexts/BalanceContext';
import BalanceCardBase from './BalanceCardBase';

const ChangingBalanceCard = ({increment}: {increment: number}) => {
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
      <View center>
        <LoaderScreen message={'Loading Balance'} color={styles.rcoin} />
      </View>
    );
  } else {
    return (
      <TouchableOpacity
        onPress={() => {
          balance_context.refresh();
        }}>
        <View marginB-5>
          <BalanceCardBase
            amount={balance_context.balance}
            subtext="Old RCoin Balance"
          />
        </View>
        {/* <View center marginV-10>
          {increment < 0 ? (
            <Image
              source={require('../../style/red-arrow-down.png')}
              style={{width: 40, height: 40}}
            />
          ) : (
            <Image
              source={require('../../style/green-arrow-up.png')}
              style={{width: 40, height: 40}}
            />
          )}
        </View> */}
        <BalanceCardBase
          amount={balance_context.balance + increment}
          subtext="New RCoin Balance"
        />
      </TouchableOpacity>
    );
  }
};

export default ChangingBalanceCard;
