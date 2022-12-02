import React, {useState} from 'react';
import {Text, View, Button, LoaderScreen} from 'react-native-ui-lib';
import ChangingBalance from '../../components/Balances/ChangingBalance';
import TransferReceipt from './TransferReciept';
import styles from '../../style/style';
import {useAuth} from '../../contexts/Auth';
import {useKeypair} from '../../contexts/Keypair';
import {Message, Transaction} from '@solana/web3.js';
import nacl from 'tweetnacl';
import PasswordPopup from '../../components/PasswordPopup';
import PendingLoader from '../../components/PendingLoader';
import Config from 'react-native-config';
import SuspectedFraudError from '../../errors/SuspectedFraudError';

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

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [secretKey, setSecretKey] = useState<Uint8Array>();
  const [loading, setLoading] = useState(false);
  const [confirm_clicked, setConfirmClicked] = useState(false);
  const [response_state, setResponseState] = useState(0);
  const [loading_page_message, setLoadingPageMessage] = useState(
    'Initiating Transfer',
  );

  const handleSend = (secretKey: Uint8Array) => {
    setLoading(true);
    setConfirmClicked(true);
    setResponseState(0);
    fetch(`${Config.API_URL}:8000/api/trade`, {
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
        if (res.status == 409) {
          throw new SuspectedFraudError();
        } else if (!res.ok) {
          throw new Error('Initial Trade Failed');
        }
        return res.json();
      })
      .then(data => {
        setLoadingPageMessage('Signing Transaction');
        if (data['success']) {
          const transaction = Transaction.from(
            new Uint8Array(data['transaction_bytes']),
          );

          if (secretKey !== undefined) {
            // Make signature
            const message: Message = transaction.compileMessage();
            const signData = message.serialize();
            const signature = nacl.sign.detached(signData, secretKey);

            fetch(`${Config.API_URL}:8000/api/complete-trade`, {
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
                  throw new Error('Complete redeem failed');
                }
                return res.json();
              })
              .then(data => {
                setLoadingPageMessage('Transfer Successful!');
                if (data['success']) {
                  setTransactionId(data['signature']);
                  setLoading(false);
                  setConfirmClicked(false);
                  setResponseState(0);
                  nextStage();
                }
              })
              .catch(error => {
                setResponseState(-1);
                setLoading(false);
                console.log(error);
              });
          }
        }
      })
      .catch(error => {
        if (error instanceof SuspectedFraudError) {
          setResponseState(-2);
        } else {
          setResponseState(-1);
        }
        setLoading(false);
        console.log(error);
      });
  };

  return (
    <View flex>
      <Text text40 style={styles.title} margin-30>
        Confirm your transaction
      </Text>
      <View margin-30>
        <ChangingBalance deduction={amount} />
        <TransferReceipt email={recipient} amount={amount} />
      </View>
      <PendingLoader
        loading={loading}
        show={confirm_clicked}
        response_state={response_state}
        loading_page_message={loading_page_message}
        custom_fail_message="Transfer failed, please confirm again"
      />
      <View flex bottom marginH-30 marginB-50>
        <Button
          onPress={() => setIsModalVisible(true)}
          label={
            loading
              ? 'Loading'
              : response_state == -2
              ? 'Account Suspended'
              : 'Confirm Transfer'
          }
          disabled={loading || response_state == -2}
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
