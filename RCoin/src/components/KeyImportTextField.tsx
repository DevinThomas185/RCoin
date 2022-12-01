import React from 'react';
import {StyleSheet} from 'react-native';
import {Incubator} from 'react-native-ui-lib'; //eslint-disable-line
const {TextField} = Incubator;
export const KeyImportTextField = ({
  pos,
  setArrayLoc,
}: {
  pos: number;
  setArrayLoc: (pos: number, text: string) => void;
}) => {
  return (
    <TextField
      placeholder={`${pos + 1}.      `}
      placeholderTextColor="grey"
      style={styles.inputField}
      autoCapitalize="none"
      onChangeText={(text: string) => setArrayLoc(pos, text)}
    />
  );
};

const styles = StyleSheet.create({
  inputField: {
    padding: 20,
    fontSize: 17,
    width: '100%',
    justifyContent: 'center',
    alignSelf: 'center',
  },
});
