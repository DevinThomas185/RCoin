import React, {useState} from 'react';
import {Text, View, Image} from 'react-native-ui-lib';
import style from '../style/style';
import {useAuth} from '../../src/contexts/Auth';

const Transaction = ({
  type,
  rcoin,
  sender,
  recipient,
  user_email,
}: {
  type: string;
  rcoin: number;
  sender: string;
  recipient: string;
  user_email: string | undefined;
}) => {
  const {authData} = useAuth();

  const amount = Math.abs(rcoin);

  const numberWithCommas = (x: number) => {
    const options = {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    };
    return Number(x).toLocaleString('en', options);
  };

  const deposit = (amount: number, sender: string, recipient: string) => (
    <View style={{flexDirection: 'row'}}>
      <Image
        source={require('../style/deposit.png')}
        style={style.balanceLogo}
      />
      <View style={{}}>
        <Text text70 grey10 left>
          {numberWithCommas(amount)} RCoin
        </Text>
        <Text text80 grey10 left style={{fontWeight: 'bold'}}>
          Deposited
        </Text>
      </View>
    </View>
  );

  const send = (amount: number, sender: string, recipient: string) => (
    <View style={{flexDirection: 'row'}}>
      <Image
        source={require('../style/transferTo.png')}
        style={style.balanceLogo}
      />
      <View>
        <Text text70 grey10 left>
          {numberWithCommas(-amount)} RCoin
        </Text>
        <Text text80 grey10 left>
          <Text style={{fontWeight: 'bold'}}>Transfer</Text> to {recipient}
        </Text>
      </View>
    </View>
  );

  const recieve = (amount: number, sender: string, recipient: string) => (
    <View style={{flexDirection: 'row'}}>
      <Image
        source={require('../style/transferFrom.png')}
        style={style.balanceLogo}
      />
      <View>
        <Text text70 grey10 left>
          {numberWithCommas(amount)} RCoin
        </Text>
        <Text text80 grey10 left>
          <Text style={{fontWeight: 'bold'}}>Transfer</Text> from {recipient}
          {/* Should be sender here but for some reason it is recipient */}
        </Text>
      </View>
    </View>
  );

  const withdraw = (amount: number, sender: string, recipient: string) => (
    <View style={{flexDirection: 'row'}}>
      <Image
        source={require('../style/withdraw.png')}
        style={style.balanceLogo}
      />
      <View>
        <Text text70 grey10 left>
          {numberWithCommas(-amount)} RCoin
        </Text>
        <Text text80 grey10 left style={{fontWeight: 'bold'}}>
          Withdrawn
        </Text>
      </View>
    </View>
  );

  return (
    <View marginH-30 marginV-20 style={{flexDirection: 'row'}}>
      {/* <View> */}
      <>
        {type == 'deposit' ? deposit(amount, sender, recipient) : null}
        {type == 'withdraw' ? withdraw(amount, sender, recipient) : null}
        {type == 'send' ? send(amount, sender, recipient) : null}
        {type == 'recieve' ? recieve(amount, sender, recipient) : null}
      </>
    </View>
  );
};

export default Transaction;
