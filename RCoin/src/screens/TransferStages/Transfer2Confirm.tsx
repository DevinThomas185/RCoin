import React from 'react';
import {Text, View, Button} from 'react-native-ui-lib';
import ChangingBalance from '../../components/Balances/ChangingBalance';
import Reciept from './TransferReciept';
import styles from '../../style/style';
import {useAuth} from '../../contexts/Auth';
import {useKeypair} from '../../contexts/Keypair';
import {Message, Transaction} from '@solana/web3.js';
import nacl from 'tweetnacl';

// Select the amount
const Transfer2Confirm = ({
  nextStage,
  amount,
  recipient,
}: {
  nextStage: React.Dispatch<void>;
  amount: number;
  recipient: string;
}) => {
  const auth = useAuth();
  const keyPair = useKeypair();

  const handleSend = () => {
    fetch('http://10.0.2.2:8000/api/trade', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${auth.authData?.token}`,
      },
      body: JSON.stringify(
        {coins_to_transfer: amount, recipient_email: recipient},
        null,
        2,
      ),
    })
      .then(res => {
        if (!res.ok) {
          throw new Error('initial redeem failed');
        }
        return res.json();
      })
      .then(data => {
        if (data['success']) {
          const transaction = Transaction.from(
            new Uint8Array(data['transaction_bytes']),
          );

          keyPair.readPair('password').then(kp => {
            if (kp != undefined) {
              // Make signature
              const message: Message = transaction.compileMessage();
              const signData = message.serialize();
              const signature = nacl.sign.detached(signData, kp.secretKey);

              fetch('http://10.0.2.2:8000/api/complete-trade', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                  Authorization: `Bearer ${auth.authData?.token}`,
                },
                body: JSON.stringify(
                  {
                    signature: Array.from(signature),
                    transaction_bytes: Array.from(data['transaction_bytes']),
                  },
                  null,
                  2,
                ),
              })
                .then(res => {
                  if (!res.ok) {
                    throw new Error('Complete redem failed');
                  }
                  return res.json();
                })
                .then(data => {
                  if (data['success']) {
                    nextStage();
                  }
                })
                .catch(error => console.log(error));
            }
          });
        }
      })
      .catch(error => console.log(error));
  };

  return (
    <View flex>
      <Text text40 style={styles.title} margin-30>
        Confirm your transaction
      </Text>
      <View margin-30>
        <ChangingBalance deduction={amount} />
        <Reciept email={recipient} amount={amount} />
      </View>

      <View flex bottom marginH-30 marginB-50>
        <Button
          onPress={handleSend}
          label="Transfer RCoin"
          backgroundColor={styles.rcoin}
        />
      </View>
    </View>
  );
};

export default Transfer2Confirm;
