import React, {useState, useEffect} from 'react';
import {Text, View, Wizard} from 'react-native-ui-lib';
import WithdrawStage0 from './WithdrawStages/WithdrawStage0';
import WithdrawStage1 from './WithdrawStages/WithdrawStage1';
import WithdrawStage2 from './WithdrawStages/WithdrawStage2';
import WithdrawStage3 from './WithdrawStages/WithdrawStage3';
import {useAuth} from '../contexts/Auth';
import {useBackHandler} from '../services/BackHandler';
import styles from '../style/style';
import Config from 'react-native-config';
import {useKeypair} from '../contexts/Keypair';
import MissingWallet from './MissingWallet';
import {NavigationScreenProp} from 'react-navigation';

const WithdrawScreen = ({
  navigation,
}: {
  navigation: NavigationScreenProp<any, any>;
}) => {
  const [stage, setStage] = useState(0);
  const [coins_to_withdraw, setCoinstoWithdraw] = useState(0.0);
  const [bank_account, setBankAccount] = useState<{[key: string]: string}>({
    bank_account: '',
    sort_code: '',
  });
  const [transactionId, setTransactionId] = useState('');
  const [keyExists, setKeyExsts] = useState(true);
  const auth = useAuth();
  const keyPair = useKeypair();

  keyPair
    .secretKeyExists(auth.authData?.token_info.wallet_id!)
    .then((exists: boolean) => {
      setKeyExsts(exists);
    });

  const backHandlerAction = () => {
    switch (stage) {
      case 1:
      case 2:
        setStage(stage - 1);
        return true;
      case 3:
        setStage(0);
        return true;
      default:
        return false;
    }
  };

  useBackHandler(backHandlerAction);

  const renderCurrentStage = () => {
    switch (stage) {
      case 0:
        return (
          <WithdrawStage0
            nextStage={() => {
              setStage(1);
            }}
            coins_to_withdraw={coins_to_withdraw}
            setCoinsToWithdraw={setCoinstoWithdraw}
          />
        );
      case 1:
        return (
          <WithdrawStage1
            nextStage={() => {
              setStage(2);
            }}
            setBankAccount={setBankAccount}
            current_bank_account={bank_account}
          />
        );
      case 2:
        return (
          <WithdrawStage2
            nextStage={() => {
              setStage(3);
            }}
            coins_to_withdraw={coins_to_withdraw}
            current_bank_account={bank_account}
            setTransactionId={setTransactionId}
          />
        );
      case 3:
        return (
          <WithdrawStage3
            navigation={navigation}
            nextStage={() => {
              setStage(0);
            }}
            coins_to_withdraw={coins_to_withdraw}
            bank_account={bank_account}
            transactionId={transactionId}
          />
        );
    }
  };

  const getStageState = (givenStage: number) => {
    let state = Wizard.States.DISABLED;
    if (stage > givenStage) {
      state = Wizard.States.COMPLETED;
    } else if (givenStage == stage) {
      state = Wizard.States.ENABLED;
    }

    return state;
  };

  return (
    <View flex>
      {keyExists ? (
        <>
          <Wizard activeIndex={stage}>
            <Wizard.Step
              state={getStageState(0)}
              label={'Make A Withdrawal'}
              circleColor={styles.rcoin}
              color={styles.rcoin}
            />
            <Wizard.Step
              state={getStageState(1)}
              label={'Select Bank Account'}
              circleColor={styles.rcoin}
              color={styles.rcoin}
            />
            <Wizard.Step
              state={getStageState(2)}
              label={'Confirmation'}
              circleColor={styles.rcoin}
              color={styles.rcoin}
            />
            <Wizard.Step
              state={getStageState(3)}
              label={'Success'}
              circleColor={styles.rcoin}
              color={styles.rcoin}
            />
          </Wizard>
          {renderCurrentStage()}
        </>
      ) : (
        <>
          <MissingWallet navigation={navigation} />
        </>
      )}
    </View>
  );
};

export default WithdrawScreen;
