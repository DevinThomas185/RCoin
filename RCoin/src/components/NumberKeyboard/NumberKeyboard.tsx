import React, {useEffect, useState} from 'react';
import {useWindowDimensions} from 'react-native';
import {Image, Text, TouchableOpacity, View} from 'react-native-ui-lib';
import {useBalance} from '../../contexts/BalanceContext';
import Style from '../../style/style';
import DecimalButton from './DecimalButton';
import DeleteButton from './DeleteButton';
import NumberButton from './NumberButton';

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
      <View row style={{justifyContent: 'space-between'}}>
        {['1', '2', '3'].map(label => (
          <NumberButton
            key={label}
            current_number={numberString}
            style={button_style}
            label={label}
            dot_present={dot_present}
            decimals={decimals}
            setNumberString={setNumberString}
            setDecimals={setDecimals}
          />
        ))}
      </View>
      <View row style={{justifyContent: 'space-between'}}>
        {['4', '5', '6'].map(label => (
          <NumberButton
            key={label}
            current_number={numberString}
            style={button_style}
            label={label}
            dot_present={dot_present}
            decimals={decimals}
            setNumberString={setNumberString}
            setDecimals={setDecimals}
          />
        ))}
      </View>
      <View row style={{justifyContent: 'space-between'}}>
        {['7', '8', '9'].map(label => (
          <NumberButton
            key={label}
            current_number={numberString}
            style={button_style}
            label={label}
            dot_present={dot_present}
            decimals={decimals}
            setNumberString={setNumberString}
            setDecimals={setDecimals}
          />
        ))}
      </View>
      <View row style={{justifyContent: 'space-between'}}>
        <DecimalButton
          current_number={numberString}
          style={button_style}
          dot_present={dot_present}
          setNumberString={setNumberString}
          setDotPresent={setDotPresent}
        />
        <NumberButton
          current_number={numberString}
          style={button_style}
          label="0"
          dot_present={dot_present}
          decimals={decimals}
          setNumberString={s => {
            if (numberString != '0') {
              setNumberString(s);
            }
          }}
          setDecimals={setDecimals}
        />
        <DeleteButton
          current_number={numberString}
          style={button_style}
          dot_present={dot_present}
          decimals={decimals}
          setNumberString={setNumberString}
          setDotPresent={setDotPresent}
          setDecimals={setDecimals}
        />
      </View>
    </View>
  );
};

export default NumberKeyboard;
