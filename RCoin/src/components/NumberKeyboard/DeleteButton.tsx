import React from 'react';
import {Text, TouchableOpacity, View} from 'react-native-ui-lib';
import Style from '../../style/style';

const DeleteButton = ({
  current_number,
  style,
  dot_present,
  decimals,
  setNumberString,
  setDotPresent,
  setDecimals,
}: {
  current_number: string;
  style: {[key: string]: any};
  dot_present: boolean;
  decimals: number;
  setNumberString: React.Dispatch<React.SetStateAction<string>>;
  setDotPresent: React.Dispatch<React.SetStateAction<boolean>>;
  setDecimals: React.Dispatch<React.SetStateAction<number>>;
}) => {
  var textColor = 'white';

  if ('color' in style) {
    textColor = style.color;
  }
  return (
    <TouchableOpacity
      onPress={() => {
        if (current_number.length == 0) {
          return;
        }

        const last = current_number.slice(-1);

        if (last == '.') {
          setDotPresent(false);
        }

        if (dot_present) {
          setDecimals(Math.max(0, decimals - 1));
        }

        setNumberString(current_number.slice(0, -1));
      }}>
      <View center style={style}>
        <Text text40 center color={textColor}>
          ←
        </Text>
      </View>
    </TouchableOpacity>
  );
};

export default DeleteButton;
