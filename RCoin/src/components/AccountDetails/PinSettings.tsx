import {Card, Text, View, Incubator, Button, Switch} from 'react-native-ui-lib';
import {useAuth} from '../../contexts/Auth';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {useEffect, useState} from 'react';
import styles from '../../style/style';
const {TextField} = Incubator;
import Config from 'react-native-config';
import ReactNativeBiometrics from 'react-native-biometrics';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Style from '../../style/style';

const PinSettings = () => {
  const auth = useAuth();

  const [open, setOpen] = useState(false);
  const [bioSensorExists, setBioSensorExists] = useState(false);
  const [bioKeyExists, setBioKeyExists] = useState(false);

  const rnBiometrics = new ReactNativeBiometrics();

  const checkBioAvailable = async () => {
    const {available} = await rnBiometrics.isSensorAvailable();
    const enabled = await AsyncStorage.getItem('@BioToken');

    setBioSensorExists(available);
    if (enabled) {
      setBioKeyExists(true);
    } else {
      setBioKeyExists(false);
    }
  };

  useEffect(() => {
    checkBioAvailable();
  });

  const handleValueChange = async () => {
    if (bioKeyExists) {
      await AsyncStorage.removeItem('@BioToken');
    } else {
      await auth.createBio();
    }
    checkBioAvailable();
  };

  return (
    <Card
      style={{marginBottom: 15}}
      onPress={() => {
        setOpen(!open);
      }}
      enableShadow>
      <View margin-20 spread row centerV>
        <Text text60 $textDefault>
          Pin Settings
        </Text>
        <Ionicons size={30} name={open ? 'chevron-up' : 'chevron-down'} />
      </View>
      {open ? (
        <View spread centerV marginH-10>
          <Button
            label="Change Pin"
            backgroundColor={Style.rcoin}
            onPress={auth.changePin}
            marginB-20
          />
          <View row>
            <Text text70 color={bioSensorExists ? Style.black : Style.grey}>
              Biometrics
            </Text>
            <Switch
              value={bioKeyExists || !bioSensorExists}
              onValueChange={handleValueChange}
              disabled={!bioSensorExists}
              marginB-20
              marginL-10
              onColor={Style.rcoin}
            />
          </View>
        </View>
      ) : (
        <></>
      )}
    </Card>
  );
};

export default PinSettings;
