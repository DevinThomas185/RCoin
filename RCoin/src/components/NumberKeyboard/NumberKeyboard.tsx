import React, {useEffect, useState} from 'react';
import {useWindowDimensions} from 'react-native';
import {Image, Text, TouchableOpacity, View} from 'react-native-ui-lib';
import {useBalance} from '../../contexts/BalanceContext';
import Style from '../../style/style';
import {Numpad} from './NumPad';

const LEAST_LIMIT = 0;
const MAX_LIMIT = 100000000000;

const NumberKeyboard = ({
  style,
  number,
  setNumber,
  setValid,
  limit_to_balance = false,
}: {
  style: {[key: string]: any};
  number: number;
  setNumber: React.Dispatch<React.SetStateAction<number>>;
  setValid: React.Dispatch<React.SetStateAction<boolean>>;
  limit_to_balance: boolean;
}) => {
  const [numberString, setNumberString] = useState('');
  const [dot_present, setDotPresent] = useState(false);
  const [decimals, setDecimals] = useState(0);

  const {width} = useWindowDimensions();
  const button_width = (width - 20) / 3;

  const button_style = {height: 50, width: button_width};
  const {balance} = useBalance();

  const validate = (numberString: string) => {
    const n = Number(numberString);
    let valid = false;
    if (n > LEAST_LIMIT && n < MAX_LIMIT) {
      valid = true;
    }

    if (limit_to_balance && n > balance) {
      valid = false;
    }

    setValid(valid);
  };

  useEffect(() => {
    validate(numberString);
    setNumber(Number(numberString));
  }, [numberString]);

  const formatNumberString = () => {
    const options = {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    };
    let x = Number(number).toLocaleString('en', options);
    if (dot_present && decimals == 0) {
      x = x + '.';
    }

    if (numberString == '') {
      return '';
    } else {
      return x;
    }
  };

  return (
    <View backgroundColor={Style.rcoin} style={style}>
      <View row center backgroundColor="white" style={style}>
        <Image
          source={require('../../style/Logo.png')}
          style={Style.balanceLogo}
        />
        <Text center text30 color={Style.rcoin}>
          {formatNumberString()}
        </Text>
      </View>
      <Numpad
        hasPoint={true}
        numberString={numberString}
        button_style={button_style}
        dot_present={dot_present}
        decimals={decimals}
        setNumberString={setNumberString}
        setDecimals={setDecimals}
        setDotPresent={setDotPresent}
      />
    </View>
  );
};

export default NumberKeyboard;
