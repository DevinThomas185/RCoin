import React, {useState} from 'react';
import {View, Wizard} from 'react-native-ui-lib';
import {useBackHandler} from '../services/BackHandler';
import styles from '../style/style';
import {RouteProp} from '@react-navigation/native';
import QR0Confirm from './QRStages/QR0Confirm';
import QR1Success from './QRStages/QR1Success';

type RootStackParamList = {
  MerchantTransaction: {
    qr_recipient: string;
    qr_amount: number;
    transaction_id: string;
  };
};

const MerchantTransferScreen = ({
  route,
}: {
  route: RouteProp<RootStackParamList, 'MerchantTransaction'>;
}) => {
  const recipient = route.params.qr_recipient;
  const amount = route.params.qr_amount;
  const [transactionId, setTransactionId] = useState(
    route.params.transaction_id.substring(2),
  );
  const [stage, setStage] = useState(0);

  console.log('^^^^^^^^^^^^^^');
  console.log('ACTUAL: ' + amount + recipient);
  console.log('stage is now: ' + stage);

  const backHandlerAction = () => {
    return false;
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
    if (stage == 0) {
      return (
        <QR0Confirm
          nextStage={() => {
            setStage(1);
          }}
          amount={amount}
          recipient={recipient}
          transaction_id={transactionId}
          setTransactionId={setTransactionId}
        />
      );
    } else {
      return (
        <QR1Success
          nextStage={() => {
            setStage(1);
            //TODO: decide where to take them next
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
      <Wizard activeIndex={stage}>
        <Wizard.Step
          state={getStageState(0)}
          label={'Confirmation'}
          circleColor={styles.rcoin}
          color={styles.rcoin}
        />
        <Wizard.Step
          state={getStageState(1)}
          label={'Successful'}
          circleColor={styles.rcoin}
          color={styles.rcoin}
        />
      </Wizard>
      {renderCurrentStage()}
    </View>
  );
};

export default MerchantTransferScreen;
