import React, {useState} from 'react';
import {Text, View, Wizard} from 'react-native-ui-lib';
import TransferEmail from './TransferStages/Transfer0Email';
import TransferAmount from './TransferStages/Transfer1Amount';
import TransferConfirm from './TransferStages/Transfer2Confirm';
import TransferSuccess from './TransferStages/Transfer3Success';
import {useBackHandler} from '../services/BackHandler';
import styles from '../style/style';
import {RouteProp} from '@react-navigation/native';
import {useAuth} from '../contexts/Auth';
import {useKeypair} from '../contexts/Keypair';
import MissingWallet from './MissingWallet';
import {NavigationScreenProp} from 'react-navigation';

type RootStackParamList = {
  MerchantTransaction: {qr_recipient: string; qr_amount: number};
};

const TransferScreen = ({
  navigation,
  route,
}: {
  navigation: NavigationScreenProp<any, any>;
  route: RouteProp<RootStackParamList, 'MerchantTransaction'>;
}) => {
  const [stage, setStage] = useState(0);
  const [recipient, setRecipient] = useState('');
  const [amount, setAmount] = useState(0.0);

  const [recipient2, setRecipient2] = useState('');
  const [amount2, setAmount2] = useState(0.0);

  const [transactionId, setTransactionId] = useState('');

  console.log('stage was: ' + stage);
  console.log('PARAMS: ' + route.params.qr_amount + route.params.qr_recipient);
  console.log('PARAMS2: ' + amount2 + recipient2);
  console.log('vvvvvvvvvvvvvv');
  // When someone just scans an email to send to
  if (route.params.qr_recipient != recipient2) {
    // console.log(route.params.qr_recipient);
    setStage(1);
    setAmount2(route.params.qr_amount);
    setAmount(route.params.qr_amount);
    setRecipient2(route.params.qr_recipient);
    setRecipient(route.params.qr_recipient);
  }
  console.log('^^^^^^^^^^^^^^');
  console.log('ACTUAL: ' + amount + recipient);
  console.log('stage is now: ' + stage);
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
        setRecipient('');
        setRecipient2('');
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
    if (stage == 0) {
      return (
        <TransferEmail
          nextStage={() => {
            setStage(1);
          }}
          setRecipient={setRecipient}
        />
      );
    } else if (stage == 1) {
      return (
        <TransferAmount
          nextStage={() => {
            setStage(2);
          }}
          setAmount={setAmount}
        />
      );
    } else if (stage == 2) {
      return (
        <TransferConfirm
          nextStage={() => {
            setStage(3);
          }}
          amount={amount}
          recipient={recipient}
          setTransactionId={setTransactionId}
        />
      );
    } else {
      return (
        <TransferSuccess
          navigation={navigation}
          nextStage={() => {
            setStage(0);
          }}
          amount={amount}
          recipient={recipient}
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
              label={'Choose Recipient'}
              circleColor={styles.rcoin}
              color={styles.rcoin}
            />
            <Wizard.Step
              state={getStageState(1)}
              label={'Choose Amount'}
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
              label={'Successful'}
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

export default TransferScreen;
