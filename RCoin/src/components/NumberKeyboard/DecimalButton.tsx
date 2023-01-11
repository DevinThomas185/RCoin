import React from 'react';
import {Text, TouchableOpacity, View} from 'react-native-ui-lib';
import Style from '../../style/style';

const DecimalButton = ({
  current_number,
  style,
  dot_present,
  setNumberString,
  setDotPresent,
}: {
  current_number: string;
  style: {[key: string]: any};
  dot_present: boolean;
  setNumberString: React.Dispatch<React.SetStateAction<string>>;
  setDotPresent: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  return (
    <TouchableOpacity
      onPress={() => {
        if (!dot_present && current_number != '') {
          setNumberString(current_number + '.');
          setDotPresent(true);
        }
      }}>
      <View center style={style}>
        <Text text40 center color={Style.white}>
          .
        </Text>
      </View>
    </TouchableOpacity>
  );
};

export default DecimalButton;
