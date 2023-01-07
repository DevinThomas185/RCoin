import React from 'react';
import {Text, View, Image} from 'react-native-ui-lib';
import style from '../style/style';

const PendingTransaction = ({type, rcoin}: {type: string; rcoin: number}) => {
  const amount = Math.abs(rcoin);

  const numberWithCommas = (x: number) => {
    const options = {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    };
    return Number(x).toLocaleString('en', options);
  };

  const deposit = (amount: number) => (
    <View style={{flexDirection: 'row'}} flexG>
      <Image
        source={require('../style/deposit.png')}
        style={style.transactionIcon}
      />
      <View flexG>
        <Text text70 grey10>
          {numberWithCommas(amount)} RCoin
        </Text>
        <Text text80 grey10 style={{fontWeight: 'bold'}}>
          Deposited
        </Text>
      </View>
    </View>
  );

  const withdraw = (amount: number) => (
    <View style={{flexDirection: 'row'}} flexG>
      <Image
        source={require('../style/withdraw.png')}
        style={style.transactionIcon}
      />
      <View flexG>
        <Text text70 grey10 left>
          {numberWithCommas(-amount)} RCoin
        </Text>
        <Text text80 grey10 left>
          <Text style={{fontWeight: 'bold'}}>Withdrawn</Text>
        </Text>
      </View>
    </View>
  );

  return (
    <View style={{flexDirection: 'row'}}>
      {/* <View> */}
      <>
        {type == 'issue' ? deposit(amount) : null}
        {type == 'redeem' ? withdraw(amount) : null}
      </>
    </View>
  );
};

export default PendingTransaction;
