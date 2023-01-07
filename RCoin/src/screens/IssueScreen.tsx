import React, {useState} from 'react';
import {View, Wizard} from 'react-native-ui-lib';
import {useBackHandler} from '../services/BackHandler';
import IssueAmount from './IssueStages/Issue0Amount';
import IssueSuccess from './IssueStages/Issue2Success';
import styles from '../style/style';
import {NavigationScreenProp} from 'react-navigation';
import IssueConfirm from './IssueStages/Issue1Confirm';

const IssueScreen = ({
  navigation,
}: {
  navigation: NavigationScreenProp<any, any>;
}) => {
  const [stage, setStage] = useState(0);
  const [coins_to_issue, setCoinsToIssue] = useState(0.0);
  const [rand_to_pay, setRandToPay] = useState(0.0);
  const [loaded_amount, setLoadedAmount] = useState(false);

  const backHandlerAction = () => {
    switch (stage) {
      case 1:
        setStage(stage - 1);
        return true;
      case 2:
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
        <IssueAmount
          nextStage={() => {
            setStage(1);
          }}
          setCoinsToIssue={setCoinsToIssue}
          setRandToPay={setRandToPay}
          coins_to_issue={coins_to_issue}
          rand_to_pay={rand_to_pay}
        />
      );
    } else if (stage == 1) {
      return (
        <IssueConfirm
          navigation={navigation}
          nextStage={() => {
            setStage(2);
          }}
          rand_to_pay={rand_to_pay}
          coins_to_issue={coins_to_issue}
        />
      );
    } else {
      return (
        <IssueSuccess
          navigation={navigation}
          nextStage={() => {
            setStage(0);
          }}
          rand_to_pay={rand_to_pay}
          coins_to_issue={coins_to_issue}
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
          label={'Deposit'}
          circleColor={styles.rcoin}
          color={styles.rcoin}
        />
        <Wizard.Step
          state={getStageState(1)}
          label={'Confirmation'}
          circleColor={styles.rcoin}
          color={styles.rcoin}
        />
        <Wizard.Step
          state={getStageState(2)}
          label={'Success'}
          circleColor={styles.rcoin}
          color={styles.rcoin}
        />
      </Wizard>
      {renderCurrentStage()}
    </View>
  );
};

export default IssueScreen;
