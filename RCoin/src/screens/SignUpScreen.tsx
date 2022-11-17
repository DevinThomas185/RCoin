// @ts-ignore
import { useState } from 'react';
import { StyleSheet } from 'react-native';
import { Button, Image, LoaderScreen, Text, View, Wizard } from 'react-native-ui-lib';
import { StepOne } from '../components/signup/StepOne';
import { StepTwo } from '../components/signup/StepTwo';
import { StepThree } from '../components/signup/StepThree';
import { StepFour } from '../components/signup/StepFour';
import { UserSignUp } from '../types/SignUp';
import { NavigationScreenProp } from 'react-navigation';
import { useBackHandler } from '../services/BackHandler';
import style from "../style/style"

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
  const NUM_PAGES = 3;

  const backHandlerAction = () => {
    if (stage > 0 && stage <= NUM_PAGES) {
      setStage(stage - 1)
      return true
    }

    return false
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
      case 3:
        return (
          <StepFour
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
      {/* <Wizard activeIndex={stage}>
        <Wizard.Step state={getStageState(0)} label={'Your Details'} circleColor={style.rcoin} color={style.rcoin} />
        <Wizard.Step state={getStageState(1)} label={'Bank Details'} circleColor={style.rcoin} color={style.rcoin} />
        <Wizard.Step state={getStageState(2)} label={'Key Password'} circleColor={style.rcoin} color={style.rcoin} />
        <Wizard.Step state={getStageState(3)} label={'Confirmation'} circleColor={style.rcoin} color={style.rcoin} />
      </Wizard> */}

      <Image href="../../style/Logo.png" />
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
    height: '100%'
  },

  steps: {
    borderRadius: 10,
    padding: 14,
    width: '90%',
    height: '60%',
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
    height: '20%',
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignSelf: 'center',
    marginBottom: '10%',
  },

  goback: {
    justifyContent: 'center',
    alignSelf: 'center',
    color: '#435C9C',
    textDecorationLine: 'underline',
    marginTop: 10,
  },

  button: {
    backgroundColor: '#5DB075',
  },
});
