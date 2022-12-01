import React, {useState} from 'react';
import {Card, Text, View} from 'react-native-ui-lib';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {useAuth} from '../../contexts/Auth';
import {useKeypair} from '../../contexts/Keypair';
import {KeyImportScreen} from './KeyImportScreen';
import {Mnemonic} from './Mnemonic';

export const Wallet = () => {
  const [open, setOpen] = useState(false);
  const [keyExists, setKeyExsts] = useState(true);
  const auth = useAuth();
  const keyPair = useKeypair();
  keyPair
    .secretKeyExists(auth.authData?.token_info.wallet_id!)
    .then((exists: boolean) => {
      setKeyExsts(exists);
    });

  return (
    <Card
      style={{marginBottom: 15}}
      onPress={() => {
        setOpen(!open);
      }}
      enableShadow>
      <View margin-20 spread row centerV>
        <Text text60 $textDefault>
          Wallet
        </Text>
        <Text text70 $textDefault style={{width: '60%'}}>
          {auth.authData?.token_info.wallet_id}
        </Text>
        <Ionicons size={30} name={open ? 'chevron-up' : 'chevron-down'} />
      </View>
      {open ? (
        <>{keyExists ? <Mnemonic /> : <KeyImportScreen setOpen={setOpen} />}</>
      ) : (
        <></>
      )}
    </Card>
  );
};
