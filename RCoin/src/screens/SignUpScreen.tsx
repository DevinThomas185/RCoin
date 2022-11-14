// @ts-ignore
import {useState} from 'react';
import {StyleSheet} from 'react-native';
import {Button, LoaderScreen, Text, View, Wizard} from 'react-native-ui-lib';
import {StepOne} from '../components/signup/StepOne';
import {StepTwo} from '../components/signup/StepTwo';
import {StepThree} from '../components/signup/StepThree';
import {UserSignUp} from '../types/SignUp';
import {NavigationScreenProp} from 'react-navigation';
import { useBackHandler } from '../services/BackHandler';

export const SignUpScreen = ({
  navigation,
}: {
  navigation: NavigationScreenProp<any, any>;
}) => {
  const [stage, setStage] = useState(0);
  const [signUpDetails, setSignUpDetails] = useState<UserSignUp>(
    {} as UserSignUp,
  );

  // Without "dummy" final page which is the underlying signup component
  const NUM_PAGES = 2;

  const backHandlerAction = () => {
    switch (stage) {
      case 1:
      case 2:
        setStage(stage - 1)
        return true
      default:
        return false
    }
  }

  useBackHandler(backHandlerAction)

  const conditionalComponent = () => {
    switch (stage) {
      case 0:
        return (
          <StepOne
            signUpDetails={signUpDetails}
            setSignUpDetails={setSignUpDetails}
          />
        );
      case 1:
        return (
          <StepTwo
            signUpDetails={signUpDetails}
            setSignUpDetails={setSignUpDetails}
          />
        );
      case 2:
        return (
          <StepThree
            navigation={navigation}
            signUpDetails={signUpDetails}
            setSignUpDetails={setSignUpDetails}
          />
        );
    }
  };

  // setSignUpDetails(previous => ({...previous, email: 'email@email.com'}));

  const getStageState = (givenStage: number) => {
    let state = Wizard.States.DISABLED;
    if (stage > givenStage) {
      state = Wizard.States.COMPLETED;
    } else if (givenStage == stage) {
      state = Wizard.States.ENABLED;
    }

    return state;
  };

  const handleContinue = () => {
    if (stage === NUM_PAGES - 1) {
      setStage(NUM_PAGES);
    } else {
      setStage(Math.min(NUM_PAGES - 1, stage + 1));
    }
  };

  return (
    <View style={styles.outerView}>
      <Wizard activeIndex={stage}>
        <Wizard.Step state={getStageState(0)} label={'Your Details'} />
        <Wizard.Step state={getStageState(1)} label={'Bank Details'} />
        <Wizard.Step state={getStageState(2)} label={'Confirmation'} />
      </Wizard>

      <View style={styles.steps}>{conditionalComponent()}</View>
      <View style={styles.controls}>
        {stage < NUM_PAGES && (
          <Button
            style={styles.button}
            label={'Continue'}
            onPress={handleContinue}
          />
        )}
        {stage > 0 && (
          <Text
            style={styles.goback}
            onPress={() => {
              setStage(Math.max(0, stage - 1));
            }}>
            Go Back
          </Text>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  outerView: {
    backgroundColor: '#435C9C',
  },

  steps: {
    borderRadius: 10,
    padding: 14,
    width: '90%',
    height: '50%',
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignSelf: 'center',
    marginTop: '10%',
    marginBottom: '10%',
  },

  controls: {
    borderRadius: 10,
    padding: 14,
    width: '90%',
    height: '30%',
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignSelf: 'center',
    marginBottom: '10%',
  },

  goback: {
    justifyContent: 'center',
    alignSelf: 'center',
  },

  button: {
    backgroundColor: '#5DB075',
  },
});
