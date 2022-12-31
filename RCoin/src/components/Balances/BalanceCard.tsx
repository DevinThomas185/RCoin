import React, {useEffect} from 'react';
import {
  LoaderScreen,
  Card,
  View,
  Image,
  TouchableOpacity,
} from 'react-native-ui-lib';
import styles from '../../style/style';
import {useBalance} from '../../contexts/BalanceContext';
import Ionicons from 'react-native-vector-icons/Ionicons';

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
        <Card
          enableShadow
          style={{flexDirection: 'row'}}
          activeOpacity={1}
          selectionOptions={{
            color: styles.rcoin,
            indicatorSize: 25,
            borderWidth: 3,
          }}>
          <Card.Section
            center
            imageSource={require('../../style/Logo.png')}
            imageStyle={{
              width: 70,
              height: 70,
            }}
          />
          <Card.Section
            center
            content={[
              {
                text: numberWithCommas(balance_context.balance),
                text30: true,
                $textDefault: true,
              },
              {
                text: 'RCoin Balance',
                text90: true,
                $textDisabled: true,
              },
            ]}
          />
        </Card>
      </TouchableOpacity>
    );
  }
};

export default BalanceCard;
