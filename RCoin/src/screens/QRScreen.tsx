import React, {useState} from 'react';
import {Image, Text, Button, View} from 'react-native-ui-lib';
import ServiceLink from '../components/ServiceLink';
import style from '../style/style';
import {NavigationScreenProp} from 'react-navigation';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import QRCodeScanner from 'react-native-qrcode-scanner';
import {Dimensions} from 'react-native';
const Stack = createNativeStackNavigator();
import QRCode from 'react-native-qrcode-svg';
import {useAuth} from '../contexts/Auth';
import Config from 'react-native-config';

var width = Dimensions.get('window').width;
var height = Dimensions.get('window').height;

const AccountScreen = ({
  navigation,
}: {
  navigation: NavigationScreenProp<any, any>;
}) => {
  const [showCode, setShowCode] = useState(true);
  const [data, setData] = useState('');
  const [amount, setAmount] = useState(0);
  const [merchant, setMerchant] = useState('');
  const auth = useAuth();

  function TopMessage() {
    if (showCode) {
      return 'Present your code to the sender';
    }
    return 'Please move your camera over the QR Code';
  }

  function BottomMessage() {
    if (showCode) {
      return 'Scan a Code';
    }
    return 'Show my Code';
  }

  async function getMerchantTransaction(transaction_id: string): Promise<void> {
    fetch(
      `${Config.API_URL}/api/complete_merchant_transaction?transaction_id=` +
        transaction_id,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${auth.authData?.token}`,
        },
      },
    )
      .then(res => res.json())
      .then(data => {
        setAmount(data['amount']);
        setMerchant(data['merchant']);
        console.log('navigate were here: ' + transaction_id);
        navigation.navigate('MerchantTransfer', {
          qr_amount: data['amount'],
          qr_recipient: data['merchant'],
          transaction_id: transaction_id,
        });
      })
      .catch(error => {
        console.log(error);
      });
  }

  async function onlyMerchantEmail(merchant: string): Promise<void> {
    setMerchant(merchant);
    navigation.navigate('Transfer', {
      qr_amount: 0,
      qr_recipient: merchant,
    });
  }

  return (
    <View flex>
      <View center marginV-10 height={50}>
        <Text text60 color={style.rcoin}>
          {TopMessage()}
        </Text>
      </View>
      <QRCodeScanner
        customMarker={
          <View
            style={{
              width: width * 0.9,
              height: width * 0.9,
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <QRCode
              size={width * 0.8}
              color="#ffffff"
              backgroundColor={style.rcoin}
              value={'EMAIL' + auth.authData?.token_info.email}
              logo={require('../style/Logo.png')}
              logoSize={width * 0.8 * 0.2}
              quietZone={20}
            />
          </View>
        }
        reactivate={true}
        showMarker={showCode}
        ref={node => {
          // console.log(node);
          console.log(amount + ' & ' + merchant);
        }}
        onRead={async contents => {
          //Only if we are in scanning mode and the QR code has changed
          console.log(contents.data);
          console.log(data);
          console.log(showCode);
          if (!showCode && contents.data != data) {
            setData(contents.data);
            console.log('data straight from QR Code: ' + contents.data);
            if (contents.data.startsWith('EMAIL')) {
              console.log('Dealing with an email @@@@@@');
              await onlyMerchantEmail(contents.data.substring(5));
            } else if (contents.data.startsWith('ID')) {
              console.log('Dealing with an id !!!!!!');
              await getMerchantTransaction(contents.data).then(() =>
                console.log('amount: ' + amount + ' sent to ' + merchant),
              );

              // console.log('amount: ' + amount + ' sent to ' + merchant);
            }
          }
        }}
        // topContent={
        //   <View>
        //     <Text text50 color={style.rcoin}>
        //       {TopMessage()}
        //     </Text>
        //   </View>
        // }
        // bottomContent={
        //   <View>
        //     <Button
        //       onPress={() => {
        //         setShowCode(!showCode);
        //       }}
        //       label={BottomMessage()}
        //       backgroundColor={style.rcoin}
        //     />
        //   </View>
        // }
      />
      <View margin-10>
        <Button
          onPress={() => {
            setShowCode(!showCode);
          }}
          label={BottomMessage()}
          backgroundColor={style.rcoin}
        />
      </View>
    </View>
  );
};

export default AccountScreen;
