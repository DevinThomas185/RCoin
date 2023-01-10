import AsyncStorage from '@react-native-async-storage/async-storage';
import React, {useState} from 'react';
import ReactNativeBiometrics from 'react-native-biometrics';
// import {Button, TextInput, View} from 'react-native';

import {View, Text, Image} from 'react-native-ui-lib'; //eslint-disable-line
import {NavigationScreenProp} from 'react-navigation';
import {PinKeyboard} from '../../components/NumberKeyboard/PinKeyboard';
import {useAuth} from '../../contexts/Auth';
import {AuthData} from '../../services/authService';
import Style from '../../style/style';
import BioPopup from './BioPopup';
const CryptoJS = require('crypto-js');

export const PinSetupScreen2 = ({
  navigation,
  route,
}: {
  navigation: NavigationScreenProp<any, any>;
  route: any; //add proper type maybe
}) => {
  const [amount, setAmount] = useState(0);
  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const auth = useAuth();

  const rnBiometrics = new ReactNativeBiometrics();

  const onPinEntered = async (numberString: string) => {
    if (numberString === route.params.pin1) {
      const {available} = await rnBiometrics.isSensorAvailable();
      if (available) {
        setIsPopupVisible(true);
      } else {
        onSuccess();
      }
    } else {
      navigation.goBack();
    }
  };

  const onSuccess = () => {
    auth.setPin(route.params.pin1);
  };

  return (
    <View flex backgroundColor={Style.rcoin}>
      <View center>
        <Image
          source={require('../../style/Logo.png')}
          style={{height: 100, width: 100}}
        />
      </View>
      <View flex center>
        <Text text40 marginB-10 center color={Style.white}>
          Confirm Pin
        </Text>
      </View>
      <View bottom marginH-10>
        <PinKeyboard
          style={{
            borderTopLeftRadius: 10,
            borderTopRightRadius: 10,
            borderBottomLeftRadius: 0,
            borderBottomRightRadius: 0,
          }}
          number={amount}
          setNumber={x => {
            setAmount(x);
            console.log(x);
          }}
          onPinEntered={onPinEntered}
        />
        <BioPopup
          isVisible={isPopupVisible}
          setIsVisible={setIsPopupVisible}
          onClose={onSuccess}
          onBioEnabled={auth.createBio}
        />
      </View>
    </View>
  );
};
