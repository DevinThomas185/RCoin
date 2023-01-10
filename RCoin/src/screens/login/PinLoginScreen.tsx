import AsyncStorage from '@react-native-async-storage/async-storage';
import React, {useEffect, useRef, useState} from 'react';
import {AppState} from 'react-native';
import ReactNativeBiometrics from 'react-native-biometrics';
import {color} from 'react-native-reanimated';
// import {Button, TextInput, View} from 'react-native';

import {View, Text, Image, Button} from 'react-native-ui-lib'; //eslint-disable-line
import {PinKeyboard} from '../../components/NumberKeyboard/PinKeyboard';
import {useAuth} from '../../contexts/Auth';
import {AuthData} from '../../services/authService';
import Style from '../../style/style';
const CryptoJS = require('crypto-js');

export const PinLoginScreen = ({authDataLocal}: {authDataLocal: AuthData}) => {
  const [valid, setValid] = useState(false);
  const [amount, setAmount] = useState(0);
  const [isWrongPasswod, setIsWrongPassword] = useState(false);
  const auth = useAuth();

  const onPinEntered = async (numberString: string) => {
    const correct = await auth.pinLogin(numberString, authDataLocal);

    setIsWrongPassword(!correct);

    if (!correct) {
      setAmount(0);
    }
  };

  const rnBiometrics = new ReactNativeBiometrics();

  const checkBio = async () => {
    const encryptedToken = await AsyncStorage.getItem('@BioToken');

    if (encryptedToken) {
      const payload = 'password' + auth.authDataLocal!.token_info.user_id;
      console.log('payload', payload);

      try {
        const {signature} = await rnBiometrics.createSignature({
          promptMessage: 'Sign in',
          payload: payload,
        });

        const decryptedToken = await CryptoJS.AES.decrypt(
          encryptedToken,
          signature,
        ).toString(CryptoJS.enc.Utf8);

        auth.tokenLogin(decryptedToken, authDataLocal);
      } catch (_) {}
    }
  };

  const appState = useRef(AppState.currentState);
  const [appStateVisible, setAppStateVisible] = useState(appState.current);

  useEffect(() => {
    const subscription = AppState.addEventListener('change', nextAppState => {
      if (
        appState.current.match(/inactive|background/) &&
        nextAppState === 'active'
      ) {
        checkBio();
      }

      appState.current = nextAppState;
      setAppStateVisible(appState.current);
    });

    return () => {
      subscription.remove();
    };
  }, []);

  return (
    <View backgroundColor={Style.rcoin} flex>
      <View center>
        <Image
          source={require('../../style/Logo.png')}
          style={{height: 100, width: 100}}
        />
      </View>

      <View flex center>
        <Text center text30 color={Style.white}>
          Welcome back,
        </Text>
        <Text center text30 color={Style.white}>
          {authDataLocal.token_info.name.substring(
            0,
            authDataLocal.token_info.name.indexOf(' '),
          )}
        </Text>
      </View>
      {isWrongPasswod && (
        <Text marginB-10 color={Style.red}>
          Wrong pin. Please try again
        </Text>
      )}
      <View marginH-10 bottom>
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
          checkBio={checkBio}
        />
      </View>

      <View marginH-10 marginB-10>
        <Button
          style={{
            borderTopLeftRadius: 0,
            borderTopRightRadius: 0,
            borderBottomLeftRadius: 10,
            borderBottomRightRadius: 10,
          }}
          onPress={auth.signOut}
          label="Forgot Pin? / Switch User"
          backgroundColor={Style.red}
        />
      </View>
    </View>
  );
};
