import React, {useState} from 'react';
import {Text, View, Button, Incubator, Image} from 'react-native-ui-lib';
import Config from 'react-native-config';
import {useAuth} from '../../contexts/Auth';
const {TextField} = Incubator;
import styles from '../../style/style';
import {Dimensions} from 'react-native';
import QRCode from 'react-native-qrcode-svg';

// Select the recipient
const Merchant1Code = ({
  nextStage,
  transactionId,
  amount,
}: {
  nextStage: React.Dispatch<void>;
  transactionId: string;
  amount: number;
}) => {
  const auth = useAuth();
  var width = Dimensions.get('window').width;
  var height = Dimensions.get('window').height;
  const [success, setSuccess] = useState(false);

  var timeout = 0;

  setInterval(() => {
    if (timeout < 20 && !success && transactionId != '') {
      getMerchantTransaction(transactionId);
    }
    timeout++;
  }, 2500);

  async function getMerchantTransaction(transaction_id: string): Promise<void> {
    if (timeout < 20 && !success && transactionId != '') {
      timeout += 1;
      console.log(timeout);
      console.log('>>>>>>' + transactionId);
      fetch(
        `${Config.API_URL}:8000/api/merchant_transaction_status/?transaction_id=` +
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
          console.log(data);
          console.log('yeah' + data['complete']);
          if (data['complete'] == 'true') {
            setSuccess(true);
            nextStage();
          }
        })
        .catch(error => {
          console.log('error' + error);
        });
    }
  }

  return (
    <View flex>
      <Text text40 style={styles.title}>
        Your transaction Code
      </Text>
      <View marginH-30 marginV-20>
        <Text>Show the unique transaction code to your sender.</Text>
      </View>
      <View style={{alignItems: 'center', justifyContent: 'center'}}>
        <QRCode
          size={width * 0.8}
          color="#ffffff"
          backgroundColor={styles.rcoin}
          value={'ID' + transactionId}
          logoSize={width * 0.8 * 0.2}
          quietZone={20}
        />
      </View>
      <View
        style={{alignItems: 'center', justifyContent: 'center', marginTop: 20}}>
        <View style={{flexDirection: 'row'}}>
          <Image
            source={require('../../style/ThinRCoin.png')}
            style={{width: 30, height: 40, marginTop: 7}} //width:height ~ 3:4
          />
          <Text style={styles.merchantAmount}>{amount}</Text>
        </View>
        <Text>to pay</Text>
      </View>
      {/* For testing purposes, will make the transaction successful
       <Button 
        onPress={() => {
          console.log('I will make the transaction valid');
          setSuccess(true);
          nextStage();
        }}>
        <Text>yeah</Text>
      </Button> */}
    </View>
  );
};

export default Merchant1Code;
