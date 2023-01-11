import React, {useState} from 'react';
import {Text, View, Button} from 'react-native-ui-lib';
import TransferReceipt from '../TransferStages/TransferReciept';
import styles from '../../style/style';
import {useAuth} from '../../contexts/Auth';
import {useKeypair} from '../../contexts/Keypair';
import {Message, Transaction} from '@solana/web3.js';
import nacl from 'tweetnacl';
import PasswordPopup from '../../components/PasswordPopup';
import PendingLoader from '../../components/PendingLoader';
import Config from 'react-native-config';
import BalanceCard from '../../components/Balances/BalanceCard';

const QR0Confirm = ({
  nextStage,
  amount,
  recipient,
  transaction_id,
  setTransactionId,
}: {
  nextStage: React.Dispatch<void>;
  amount: number;
  recipient: string;
  transaction_id: string;
  setTransactionId: React.Dispatch<React.SetStateAction<string>>;
}) => {
  const auth = useAuth();
  const keyPair = useKeypair();

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [secretKey, setSecretKey] = useState<Uint8Array>();
  const [loading, setLoading] = useState(false);
  const [confirm_clicked, setConfirmClicked] = useState(false);
  const [response_state, setResponseState] = useState(0);
  const [loading_page_message, setLoadingPageMessage] = useState(
    'Initiating Transfer',
  );

  function sign_merchant_transaction(
    transactionId: string,
    signatureId: string,
  ): Promise<void> {
    console.log(transactionId + ' ~~~~ ' + signatureId);
    console.log(
      JSON.stringify(
        {transaction_id: transactionId, signature: signatureId},
        null,
        2,
      ),
    );

    return fetch(`${Config.API_URL}/api/sign_merchant_transaction`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${auth.authData?.token}`,
      },
      body: JSON.stringify(
        {transaction_id: transactionId, signature: signatureId},
        null,
        2,
      ),
    })
      .then(res => res.json())
      .then(data => {
        if (data['success']) {
          setLoading(false);
          setConfirmClicked(false);
          setResponseState(0);
          nextStage();
        }
      })
      .catch(error => {
        console.log('HEH');
        console.log(error);
      });
  }

  const handleSend = (secretKey: Uint8Array) => {
    setLoading(true);
    setConfirmClicked(true);
    setResponseState(0);

    fetch(`${Config.API_URL}/api/trade`, {
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

            fetch(`${Config.API_URL}/api/complete-trade`, {
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
                  // Post request to the redis to confirm the transaction for use of the merchant
                  sign_merchant_transaction(transaction_id, data['signature']);
                  setLoading(false);
                  setConfirmClicked(false);
                  setResponseState(0);
                  // nextStage(); is done inside sign_merchant_transaction
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
        setResponseState(-1);
        setLoading(false);
        console.log(error);
      });
  };

  return (
    <View flex marginH-10>
      <Text text40 style={styles.title}>
        Confirm Payment
      </Text>
      <View marginV-10>
        <TransferReceipt email={recipient} amount={amount} />
      </View>
      <View>
        {loading ? (
          <PendingLoader
            loading={loading}
            show={confirm_clicked}
            response_state={response_state}
            loading_page_message={loading_page_message}
            custom_fail_message="Transfer failed, please confirm again"
          />
        ) : (
          <BalanceCard />
        )}
      </View>
      <View flex bottom marginV-10>
        <Button
          onPress={() => setIsModalVisible(true)}
          label="Confirm Transfer"
          disabled={loading}
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

export default QR0Confirm;
