import AsyncStorage from '@react-native-async-storage/async-storage';
import React, {useEffect, useState} from 'react';
import {Image} from 'react-native';
import {Text, TouchableOpacity, View} from 'react-native-ui-lib';
import Style from '../../style/style';

const BioButton = ({
  style,
  checkBio,
}: {
  style: {[key: string]: any};
  checkBio?: () => Promise<void>;
}) => {
  const [hasBio, setHasBio] = useState(false);
  const checkHasBio = async () => {
    const hasBioToken = await AsyncStorage.getItem('@BioToken');
    if (hasBioToken) {
      setHasBio(true);
    }
  };

  useEffect(() => {
    checkHasBio();
  });

  if (!checkBio || !hasBio) {
    return <View center style={style}></View>;
  }

  return (
    <TouchableOpacity
      onPress={() => {
        checkBio();
      }}>
      <View center style={style}>
        <Image
          style={{
            width: 30,
            height: 30,
            tintColor: Style.rcoin,
          }}
          source={{
            uri: 'data:image/png;base64,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',
          }}></Image>
      </View>
    </TouchableOpacity>
  );
};

export default BioButton;
