import {useEffect, useState} from 'react';
import {StyleSheet} from 'react-native';
import {
  View,
  Button,
  Incubator,
  Text,
  LoaderScreen,
  Checkbox,
} from 'react-native-ui-lib'; //eslint-disable-line
import {UserSignUp} from '../../types/SignUp';
const {TextField} = Incubator;
import {NavigationScreenProp} from 'react-navigation';

// https://github.com/uuidjs/uuid/issues/416
import {v4 as uuidv4} from 'uuid'; // Very important, do not remove plz!!!!!
import Style from '../../style/style';

export const StepThree = ({
  navigation,
  signUpDetails,
  setSignUpDetails,
  setDisabled,
  disabled,
}: {
  navigation: NavigationScreenProp<any, any>;
  signUpDetails: UserSignUp;
  setSignUpDetails: React.Dispatch<React.SetStateAction<UserSignUp>>;
  setDisabled: React.Dispatch<React.SetStateAction<boolean>>;
  disabled: boolean;
}) => {
  const [key, setKey] = useState('');
  const [isValid, setIsValid] = useState(true);

  const [passwordText, setPasswordText] = useState('Show');
  const [showPassword, setShowPassword] = useState(false);

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
    setPasswordText(passwordText === 'Show' ? 'Hide' : 'Show');
  };

  const [confirmPasswordText, setConfirmPasswordText] = useState('Show');
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const toggleShowConfirmPassword = () => {
    setShowConfirmPassword(!showConfirmPassword);
    setConfirmPasswordText(confirmPasswordText === 'Show' ? 'Hide' : 'Show');
  };

  return (
    <View>
      <Text color={Style.rcoin} style={styles.title}>
        Wallet Password
      </Text>
      <Text marginV-10 color="red" style={styles.subtext}>
        IT IS VERY IMPORTANT THAT YOU REMEMBER THIS PASSWORD OR YOU WILL LOSE
        ACCESS TO YOUR MONEY PERMANENTLY
      </Text>
      <View>
        <TextField
          marginV-10
          style={styles.inputField}
          placeholder={'Password'}
          placeholderTextColor={'gray'}
          onChangeText={(password: string) => {
            setKey(password);
          }}
          value={key}
          secureTextEntry={!showPassword}
        />
        <Text style={styles.passwordToggleButton} onPress={toggleShowPassword}>
          {passwordText}
        </Text>
      </View>
      <View>
        <TextField
          marginV-10
          style={styles.inputField}
          placeholder={'Confirm Password'}
          placeholderTextColor={'gray'}
          onChangeText={(password: string) => {
            if (password !== key) {
              setIsValid(false);
              return;
            }

            setIsValid(true);
            setSignUpDetails(prev => ({
              ...prev,
              encryption_password: password,
            }));
          }}
          secureTextEntry={!showConfirmPassword}
        />
        <Text
          style={styles.passwordToggleButton}
          onPress={toggleShowConfirmPassword}>
          {confirmPasswordText}
        </Text>
      </View>
      {!isValid && <Text color="red">Passwords must match</Text>}
      <View marginV-10>
        <Checkbox
          label="I remember this password"
          color={Style.rcoin}
          value={!disabled}
          onValueChange={(v: boolean) => {
            setDisabled(!v || !isValid);
          }}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  title: {
    fontWeight: 'bold',
    fontSize: 30,
    textAlign: 'left',
  },

  subtext: {
    color: 'red',
  },

  floatingPlaceholder: {
    zIndex: 0,
    fontSize: 20,
  },

  inputField: {
    padding: 14,
    fontSize: 18,
    height: 50,
    textAlign: 'left',
    backgroundColor: '#f5f5f5',
    borderColor: '#d1d1d1',
    borderWidth: 1,
    borderRadius: 5,
  },

  passwordToggleButton: {
    top: 25,
    right: 20,
    position: 'absolute',
    fontSize: 16,
    color: '#435C9C',
  },

  button: {
    width: '80%',
    justifyContent: 'center',
    alignSelf: 'center',
  },

  signup: {
    justifyContent: 'center',
    alignSelf: 'center',
  },
});
