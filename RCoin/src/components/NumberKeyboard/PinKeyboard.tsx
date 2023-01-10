import React, {useEffect, useState} from 'react';
import {useWindowDimensions} from 'react-native';
import {Image, Text, TouchableOpacity, View} from 'react-native-ui-lib';
import {useAuth} from '../../contexts/Auth';
import {useBalance} from '../../contexts/BalanceContext';
import {AuthData} from '../../services/authService';
import Style from '../../style/style';
import {Numpad} from './NumPad';

const LEAST_LIMIT = 0;
const MAX_LIMIT = 100000000000;

export const PinKeyboard = ({
  style,
  number,
  setNumber,
  onPinEntered,
  checkBio,
}: {
  style: {[key: string]: any};
  number: number;
  setNumber: React.Dispatch<React.SetStateAction<number>>;
  onPinEntered: (numberString: string) => void;
  checkBio?: () => Promise<void>;
}) => {
  const [dot_present, setDotPresent] = useState(false);
  const [decimals, setDecimals] = useState(0);

  const {width} = useWindowDimensions();
  const button_width = (width - 20) / 3;

  const button_style = {
    height: 50,
    width: button_width,
    backgroundColor: 'white',
    color: Style.rcoin,
  };
  const {balance} = useBalance();

  const numberString: string = number === 0 ? '' : number.toString();

  useEffect(() => {
    const n = number;
    setNumber(n);
    if (n >= 1000) {
      onPinEntered(numberString);
    }
  }, [numberString]);

  const formatNumberString = () => {
    var n = number;
    var res = '';
    while (n > 0) {
      n = Math.floor(n / 10);
      res += '. ';
    }

    return res;
  };

  return (
    <View backgroundColor={Style.white} style={style}>
      <View row center backgroundColor={Style.light_grey} style={style}>
        <Text center text30 color={Style.rcoin}>
          {formatNumberString()}
        </Text>
      </View>
      <Numpad
        numberString={numberString}
        button_style={button_style}
        dot_present={false}
        decimals={0}
        checkBio={checkBio}
        hasPoint={false}
        setNumberString={_str => {
          const str: string = _str.toString();
          if (str == '') {
            setNumber(0);
            return;
          }

          const num: number = Number.parseInt(str);

          if (num <= 9999) {
            setNumber(num);
          }
        }}
        setDecimals={setDecimals}
        setDotPresent={setDotPresent}
      />
    </View>
  );
};
