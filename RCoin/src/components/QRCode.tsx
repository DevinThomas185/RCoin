import React from 'react';
import {Text, View, Image} from 'react-native-ui-lib';
import style from '../style/style';

const Service = ({title, message}: {title: string; message: string}) => {
  return (
    <View>
      <View marginH-30 marginV-20 style={{flexDirection: 'row'}}>
        <View>
          <Image
            style={style.qrIcon}
            source={require('../style/QR-Icon.png')}
          />
        </View>
        <View marginT-15>
          <Text text60>QR Code</Text>
          <Text>View and scan codes for easy transactions</Text>
        </View>
      </View>
    </View>
  );
};

export default Service;
