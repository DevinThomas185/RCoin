import React, {useState} from 'react';
import {Text, View, Image} from 'react-native-ui-lib';
import style from '../style/style';
import {useAuth} from '../../src/contexts/Auth';
import {useFriends} from '../contexts/FriendContext';

const Transaction = ({
  type,
  rcoin,
  sender,
  recipient,
  user_email,
  date_time,
}: {
  type: string;
  rcoin: number;
  sender: string;
  recipient: string;
  user_email: string | undefined;
  date_time: number;
}) => {
  const amount = Math.abs(rcoin);
  const friends_context = useFriends();

  const date_time_string = new Date(date_time * 1000);
  const transaction_time = date_time_string.toLocaleString('en-GB', {
    // year: '2-digit',
    // month: '2-digit',
    // day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    // second: '2-digit',
    hour12: true,
  });

  const numberWithCommas = (x: number) => {
    const options = {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    };
    return Number(x).toLocaleString('en', options);
  };

  const deposit = (amount: number, sender: string, recipient: string) => (
    <View style={{flexDirection: 'row'}} flexG>
      <Image
        source={require('../style/deposit.png')}
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
        <View row>
          <View flexG>
            <Text text80 grey10 style={{fontWeight: 'bold'}}>
              Deposited
            </Text>
          </View>
          <View flexS>
            <Text text80 grey10>
              {transaction_time}
            </Text>
          </View>
        </View>
      </View>
    </View>
  );

  const send = (amount: number, sender: string, recipient: string) => (
    <View style={{flexDirection: 'row'}} flexG>
      <Image
        source={require('../style/transferTo.png')}
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
        <View row>
          <View flexG>
            <Text text80 grey10 left>
              <Text style={{fontWeight: 'bold'}}>Transfer</Text> to{' '}
              {friends_context.match_email(recipient)}
            </Text>
          </View>
          <View flexS>
            <Text text80 grey10>
              {transaction_time}
            </Text>
          </View>
        </View>
      </View>
    </View>
  );

  const recieve = (amount: number, sender: string, recipient: string) => (
    <View style={{flexDirection: 'row'}} flexG>
      <Image
        source={require('../style/transferFrom.png')}
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
        <View row>
          <View flexG>
            <Text text80 grey10 left>
              <Text style={{fontWeight: 'bold'}}>Transfer</Text> from{' '}
              {friends_context.match_email(sender)}
              {/* Should be sender here but for some reason it is recipient */}
            </Text>
          </View>
          <View flexS>
            <Text text80 grey10>
              {transaction_time}
            </Text>
          </View>
        </View>
      </View>
    </View>
  );

  const withdraw = (amount: number, sender: string, recipient: string) => (
    <View style={{flexDirection: 'row'}} flexG>
      <Image
        source={require('../style/withdraw.png')}
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
        <View row>
          <View flexG>
            <Text text80 grey10 left>
              <Text style={{fontWeight: 'bold'}}>Withdrawn</Text>
            </Text>
          </View>
          <View flexS>
            <Text text80 grey10>
              {transaction_time}
            </Text>
          </View>
        </View>
      </View>
    </View>
  );

  return (
    <View style={{flexDirection: 'row'}}>
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
