import React from 'react';
import { Text, View, Button } from 'react-native-ui-lib';
import ChangingBalance from '../../components/Balances/ChangingBalance';
import styles from '../../style/style';
import WithdrawReciept from './WithdrawReciept';
import { useAuth } from '../../contexts/Auth';
import { useKeypair } from '../../contexts/Keypair';
import { Message, Transaction } from '@solana/web3.js';
import nacl from 'tweetnacl';

// Confirmation
const WithdrawStage1 = ({
  nextStage,
  token_balance,
  coins_to_withdraw,
  rands_being_credited,
  current_bank_account,
  setTransactionId,
}: {
  nextStage: React.Dispatch<void>;
  token_balance: number;
  coins_to_withdraw: number;
  rands_being_credited: number;
  current_bank_account: { [key: string]: string };
  setTransactionId: React.Dispatch<React.SetStateAction<string>>;
}) => {
  const auth = useAuth();
  const keyPair = useKeypair();
  const new_balance = token_balance - coins_to_withdraw;

  const handleSend = () => {
    fetch('http://10.0.2.2:8000/api/redeem', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${auth.authData?.token}`,
      },
      body: JSON.stringify({ amount_in_coins: coins_to_withdraw }, null, 2),
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

              fetch('http://10.0.2.2:8000/api/complete-redeem', {
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
                    setTransactionId(data['transaction_id']);
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
      <Text text40 style={styles.title}>
        Confirm your transaction
      </Text>
      <View>
        <ChangingBalance deduction={coins_to_withdraw} />
        <WithdrawReciept
          coins={coins_to_withdraw}
          rands={rands_being_credited}
          bank_account={current_bank_account}
        />
      </View>
      <View flex bottom marginH-30 marginB-5>
        <Button
          onPress={nextStage}
          label="Account Settings"
          backgroundColor={styles.rcoin}
        />
      </View>
      <Text style={styles.buttonCaption}>
        Wrong bank info? Change in your account settings
      </Text>
      <View flex bottom marginH-30 marginB-10>
        <Button
          onPress={handleSend}
          label="Continue"
          backgroundColor={styles.rcoin}
        />
      </View>
    </View>
  );
};

export default WithdrawStage1;
