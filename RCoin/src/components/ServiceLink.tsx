import React from 'react';
import {Text, View, Image} from 'react-native-ui-lib';
import style from '../style/style';

const Service = ({title, message}: {title: string; message: string}) => {
  return (
    <View>
      <View marginH-30 marginV-20 style={{flexDirection: 'row'}}>
        <View>
          <Text text60>{title}</Text>
          <Text>{message}</Text>
        </View>
        <View style={style.arrow}>
          <Image source={require('../style/Arrow.png')} />
        </View>
      </View>
    </View>
  );
};

export default Service;
