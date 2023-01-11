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
        source={require('../style/pending.png')}
        style={style.transactionIcon}
      />
      <View flexG>
        <View row centerV>
          <Image
            source={require('../style/ThinRCoin.png')}
            style={{width: 9, height: 12}}
          />
          <Text text70 grey10>
            {numberWithCommas(amount)}
          </Text>
        </View>
        <Text text80 grey10 style={{fontWeight: 'bold'}}>
          Deposited
        </Text>
      </View>
    </View>
  );

  const withdraw = (amount: number) => (
    <View style={{flexDirection: 'row'}} flexG>
      <Image
        source={require('../style/pending.png')}
        style={style.transactionIcon}
      />
      <View flexG>
        <View row centerV>
          <Text text70 grey10>
            -
          </Text>
          <Image
            source={require('../style/ThinRCoin.png')}
            style={{width: 9, height: 12}}
          />
          <Text text70 grey10>
            {numberWithCommas(amount)}
          </Text>
        </View>
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
