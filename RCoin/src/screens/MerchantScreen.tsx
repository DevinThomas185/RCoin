import React, {useState} from 'react';
import {View, Wizard} from 'react-native-ui-lib';
import TransferAmount from './TransferStages/Transfer1Amount';
import TransferConfirm from './TransferStages/Transfer2Confirm';
import TransferSuccess from './TransferStages/Transfer3Success';
import {useBackHandler} from '../services/BackHandler';
import styles from '../style/style';
import Config from 'react-native-config';
import MerchantAmount from './MerchantStages/Merchant0Amount';
import MerchantCode from './MerchantStages/Merchant1Code';
import {useAuth} from '../contexts/Auth';
import {NavigationScreenProp} from 'react-navigation';
import Merchant2Success from './MerchantStages/Merchant2Success';

const MerchantScreen = ({
  navigation,
}: {
  navigation: NavigationScreenProp<any, any>;
}) => {
  const [stage, setStage] = useState(0);
  const [amount, setAmount] = useState(0.0);
  const [transactionId, setTransactionId] = useState('');

  const auth = useAuth();

  async function generateTransaction(coins: number) {
    fetch(
      `${Config.API_URL}/api/create_merchant_transaction?amount=` +
        coins.toString(),
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
        setTransactionId(data['transaction_id']);
      })
      .catch(error => {
        console.log(error);
      });
  }

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
    if (stage == 0) {
      return (
        <MerchantAmount
          nextStage={async () => {
            await generateTransaction(amount);
            setStage(1);
          }}
          setAmount={setAmount}
          amount={amount}
        />
      );
    } else if (stage == 1) {
      return (
        <MerchantCode
          returnToTerminal={() => {
            setStage(0);
          }}
          nextStage={() => {
            setStage(2);
          }}
          transactionId={transactionId}
          amount={amount}
        />
      );
    } else {
      return (
        //success
        // <TransferSuccess
        //   navigation={navigation}
        //   nextStage={() => {
        //     setStage(0);
        //   }}
        //   amount={amount}
        //   recipient={'you'}
        //   transactionId={transactionId}
        // />
        <Merchant2Success
          navigation={navigation}
          nextStage={() => {
            setStage(0);
          }}
          amount={amount}
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
          label={'Choose Amount'}
          circleColor={styles.rcoin}
          color={styles.rcoin}
        />
        <Wizard.Step
          state={getStageState(1)}
          label={'Display Code'}
          circleColor={styles.rcoin}
          color={styles.rcoin}
        />
        <Wizard.Step
          state={getStageState(2)}
          label={'Successful'}
          circleColor={styles.rcoin}
          color={styles.rcoin}
        />
      </Wizard>
      {renderCurrentStage()}
    </View>
  );
};

export default MerchantScreen;
