import React, {useState} from 'react';
import {Text, View, Button} from 'react-native-ui-lib';
import ChangingBalance from '../../components/Balances/ChangingBalance';
import styles from '../../style/style';
import WithdrawReciept from './WithdrawReciept';
import {useAuth} from '../../contexts/Auth';
import {useKeypair} from '../../contexts/Keypair';
import {Message, Transaction} from '@solana/web3.js';
import nacl from 'tweetnacl';
import PasswordPopup from '../../components/PasswordPopup';
import PendingLoader from '../../components/PendingLoader';
import Config from 'react-native-config';
import SuspectedFraudError from '../../errors/SuspectedFraudError';
import ChangingBalanceCard from '../../components/Balances/ChangingBalanceCard';

// Confirmation
const WithdrawStage2 = ({
  nextStage,
  coins_to_withdraw,
  current_bank_account,
  setTransactionId,
}: {
  nextStage: React.Dispatch<void>;
  coins_to_withdraw: number;
  current_bank_account: {[key: string]: string};
  setTransactionId: React.Dispatch<React.SetStateAction<string>>;
}) => {
  const auth = useAuth();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [confirm_clicked, setConfirmClicked] = useState(false);
  const [response_state, setResponseState] = useState(0);
  const [loading_page_message, setLoadingPageMessage] = useState(
    'Initiating Withdraw',
  );

  const handleSend = (secretKey: Uint8Array) => {
    setLoading(true);
    setConfirmClicked(true);
    setResponseState(0);
    fetch(`${Config.API_URL}/api/redeem`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${auth.authData?.token}`,
      },
      body: JSON.stringify({amount_in_coins: coins_to_withdraw}, null, 2),
    })
      .then(res => {
        if (res.status == 409) {
          throw new SuspectedFraudError();
        } else if (!res.ok) {
          throw new Error('Initial Withdraw Failed');
        }
        return res.json();
      })
      .then(data => {
        setLoadingPageMessage('Signing Withdrawal');
        if (data['success']) {
          const transaction = Transaction.from(
            new Uint8Array(data['transaction_bytes']),
          );

          if (secretKey != undefined) {
            // Make signature
            const message: Message = transaction.compileMessage();
            const signData = message.serialize();
            const signature = nacl.sign.detached(signData, secretKey);

            fetch(`${Config.API_URL}/api/complete-redeem`, {
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
                  throw new Error('Complete Withdraw failed');
                }
                return res.json();
              })
              .then(data => {
                setLoadingPageMessage('Withdraw Successful!');
                if (data['success']) {
                  setTransactionId(data['transaction_id']);
                  setLoading(false);
                  setConfirmClicked(false);
                  setResponseState(0);
                  nextStage();
                } else {
                  throw new Error('Confirm Withdraw Failed');
                }
              })
              .catch(error => {
                setResponseState(-1);
                setLoading(false);
                console.log(error);
              });
          }
        } else {
          throw new Error('Initial Withdraw Failed');
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
    <View flex marginH-10>
      <Text text40 style={styles.title}>
        Confirm Withdraw
      </Text>

      <View marginV-10>
        <WithdrawReciept
          coins={coins_to_withdraw}
          bank_account={current_bank_account}
        />
      </View>

      <View flex>
        {confirm_clicked ? (
          <PendingLoader
            loading={loading}
            show={confirm_clicked}
            response_state={response_state}
            loading_page_message={loading_page_message}
            custom_fail_message="Withdraw failed, please try again later"
          />
        ) : (
          <ChangingBalanceCard increment={-coins_to_withdraw} />
        )}
      </View>

      <View bottom marginV-10>
        <Button
          onPress={() => {
            setIsModalVisible(true);
          }}
          disabled={loading}
          label="Confirm Withdrawal"
          backgroundColor={styles.rcoin}
        />
        <PasswordPopup
          isVisible={isModalVisible}
          setIsVisible={setIsModalVisible}
          onSuccess={handleSend}
        />
      </View>
    </View>
  );
};

export default WithdrawStage2;
