import React from 'react';
import {Text, TouchableOpacity, View} from 'react-native-ui-lib';
import Style from '../../style/style';

const NumberButton = ({
  current_number,
  style,
  label,
  dot_present,
  decimals,
  setNumberString,
  setDecimals,
}: {
  current_number: string;
  style: {[key: string]: any};
  label: string;
  dot_present: boolean;
  decimals: number;
  setNumberString: React.Dispatch<React.SetStateAction<string>>;
  setDecimals: React.Dispatch<React.SetStateAction<number>>;
}) => {
  return (
    <TouchableOpacity
      onPress={() => {
        if (dot_present && decimals < 2) {
          setNumberString(current_number + label);
          setDecimals(decimals + 1);
        } else if (!dot_present && current_number != '0') {
          setNumberString(current_number + label);
        }
      }}>
      <View center style={style}>
        <Text text40 center color={Style.white}>
          {label}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

export default NumberButton;
