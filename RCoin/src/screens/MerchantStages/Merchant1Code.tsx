import React, {useState} from 'react';
import {Text, View, Button, Incubator, Image} from 'react-native-ui-lib';
import Config from 'react-native-config';
import {useAuth} from '../../contexts/Auth';
import styles from '../../style/style';
import {Dimensions} from 'react-native';
import QRCode from 'react-native-qrcode-svg';

// Select the recipient
const Merchant1Code = ({
  nextStage,
  returnToTerminal,
  transactionId,
  amount,
}: {
  nextStage: React.Dispatch<void>;
  returnToTerminal: React.Dispatch<void>;
  transactionId: string;
  amount: number;
}) => {
  const auth = useAuth();
  var width = Dimensions.get('window').width;
  const [success, setSuccess] = useState(false);
  const [timedOut, setTimedOut] = useState(false);

  var timeout = 0;

  const max_timeout = 100;

  var check_interval = setInterval(() => {
    if (timeout < max_timeout && !success && transactionId != '') {
      getMerchantTransaction(transactionId);
    } else if (timeout > max_timeout) {
      setTimedOut(true);
    }
    timeout++;
  }, 2500);

  async function getMerchantTransaction(transaction_id: string): Promise<void> {
    if (timeout < max_timeout && !success && transactionId != '') {
      timeout += 1;
      console.log(timeout);
      console.log('>>>>>>' + transactionId);
      fetch(
        `${Config.API_URL}/api/merchant_transaction_status?transaction_id=` +
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
            clearInterval(check_interval);
            nextStage();
          }
        })
        .catch(error => {
          console.log('error' + error);
          clearInterval(check_interval);
        });
    } else if (timeout > max_timeout) {
      setTimedOut(true);
    }
  }

  return (
    <View flex marginH-10>
      <Text marginV-10 text40 style={styles.title}>
        Your Transaction Code
      </Text>
      <View marginV-10>
        <Text>Show the unique transaction code to your sender.</Text>
      </View>
      <View flex style={{alignItems: 'center', justifyContent: 'center'}}>
        {!timedOut ? (
          <>
            <QRCode
              size={width * 0.8}
              color="#ffffff"
              backgroundColor={styles.rcoin}
              value={'ID' + transactionId}
              logo={require('../../style/Logo.png')}
              logoSize={width * 0.8 * 0.2}
              quietZone={20}
            />
            <View marginV-10>
              <View center style={{flexDirection: 'row'}}>
                <Image
                  source={require('../../style/ThinRCoin.png')}
                  style={{width: 30, height: 40}} //width:height ~ 3:4
                />
                <Text style={styles.merchantAmount}>{amount}</Text>
              </View>
              <Text text60 color={styles.rcoin}>
                to pay
              </Text>
            </View>
          </>
        ) : (
          <View>
            <View flex centerV>
              <Text text30 color={styles.failed} style={{fontWeight: 'bold'}}>
                Transaction Timed Out
              </Text>
              <Text marginV-10 center text60 color={styles.failed}>
                Unfortunately this transaction took too long to complete and has
                been voided.
              </Text>
              <Text marginV-10 center text60 color={styles.failed}>
                Please generate a new transaction if you still require this
                transaction to be completed.
              </Text>
            </View>
            <View marginV-10 bottom>
              <Button
                marginV-10
                onPress={returnToTerminal} //navigate to transfer page
                label="Return to Merchant Terminal"
                backgroundColor={styles.rcoin}
              />
            </View>
          </View>
        )}
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
