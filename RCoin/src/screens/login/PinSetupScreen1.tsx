import React, {useState} from 'react';
// import {Button, TextInput, View} from 'react-native';

import {View, Text, Image} from 'react-native-ui-lib'; //eslint-disable-line
import {NavigationScreenProp} from 'react-navigation';
import {PinKeyboard} from '../../components/NumberKeyboard/PinKeyboard';
import {useAuth} from '../../contexts/Auth';
import Style from '../../style/style';

export const PinSetupScreen1 = ({
  navigation,
}: {
  navigation: NavigationScreenProp<any, any>;
}) => {
  const [valid, setValid] = useState(false);
  const [amount, setAmount] = useState(0);
  const auth = useAuth();

  const onPinEntered = (numberString: string) => {
    navigation.navigate('Step 2', {pin1: numberString});

    setAmount(0);
  };

  return (
    <View flex backgroundColor={Style.rcoin}>
      <View center>
        <Image
          source={require('../../style/Logo.png')}
          style={{height: 100, width: 100}}
        />
      </View>
      <View flex center>
        <Text text40 marginB-10 center color={Style.white}>
          Please enter a new pin
        </Text>
        <Text text50 center color={Style.white}>
          This will allow you to quickly log back in
        </Text>
      </View>
      <View bottom marginH-10>
        <PinKeyboard
          style={{
            borderTopLeftRadius: 10,
            borderTopRightRadius: 10,
            borderBottomLeftRadius: 0,
            borderBottomRightRadius: 0,
          }}
          number={amount}
          setNumber={x => {
            setAmount(x);
            console.log(x);
          }}
          onPinEntered={onPinEntered}
        />
      </View>
    </View>
  );
};
