import React, {useState} from 'react';
import {Text, View, Button} from 'react-native-ui-lib';
import ChangingBalance from '../../components/Balances/ChangingBalance';
import TransferReceipt from './TransferReciept';
import styles from '../../style/style';
import {useAuth} from '../../contexts/Auth';
import {useKeypair} from '../../contexts/Keypair';
import {Message, Transaction} from '@solana/web3.js';
import nacl from 'tweetnacl';
import PasswordPopup from '../../components/PasswordPopup';

const Transfer2Confirm = ({
  nextStage,
  amount,
  recipient,
  setTransactionId,
}: {
  nextStage: React.Dispatch<void>;
  amount: number;
  recipient: string;
  setTransactionId: React.Dispatch<React.SetStateAction<string>>;
}) => {
  const auth = useAuth();
  const keyPair = useKeypair();

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [secretKey, setSecretKey] = useState<Uint8Array>();

  const handleSend = (secretKey: Uint8Array) => {
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

          if (secretKey !== undefined) {
            // Make signature
            const message: Message = transaction.compileMessage();
            const signData = message.serialize();
            const signature = nacl.sign.detached(signData, secretKey);

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
                  setTransactionId(data['signature']);
                  nextStage();
                }
              })
              .catch(error => console.log(error));
          }
        }
      })
      .catch(error => console.log(error));
  };

  return (
    <View flex>
      <Text text40 style={styles.title} margin-30>
        Confirm your transaction
      </Text>
      <View marginH-30>
        <ChangingBalance deduction={amount} />
        <TransferReceipt email={recipient} amount={amount} />
      </View>

      <View flex bottom marginH-30 marginB-10>
        <Button
          onPress={() => setIsModalVisible(true)}
          label="Transfer RCoin"
          backgroundColor={styles.rcoin}
        />
      </View>
      <PasswordPopup
        isVisible={isModalVisible}
        setIsVisible={setIsModalVisible}
        onSuccess={handleSend}
      />
    </View>
  );
};

export default Transfer2Confirm;
