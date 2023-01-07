import {useState} from 'react';
import {StyleSheet} from 'react-native';
import {
  View,
  Button,
  Incubator,
  Text,
  Icon,
  Image,
  Checkbox,
} from 'react-native-ui-lib'; //eslint-disable-line
import Style from '../../style/style';
import {UserSignUp} from '../../types/SignUp';
const {TextField} = Incubator;

export const StepOne = ({
  signUpDetails,
  setSignUpDetails,
}: {
  signUpDetails: UserSignUp;
  setSignUpDetails: React.Dispatch<React.SetStateAction<UserSignUp>>;
}) => {
  const [passwordText, setPasswordText] = useState('Show');
  const [showPassword, setShowPassword] = useState(false);

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
    setPasswordText(passwordText === 'Show' ? 'Hide' : 'Show');
  };

  return (
    <View>
      <Text style={styles.title}>Your Details</Text>
      <Text style={styles.subtext}>
        Your email will be used to sign into your account.
      </Text>
      <TextField
        marginV-10
        style={styles.inputField}
        placeholder={'Email'}
        placeholderTextColor={'gray'}
        onChangeText={(email: string) =>
          setSignUpDetails(prev => ({
            ...prev,
            email: email,
          }))
        }
        value={signUpDetails.email}
        keyboardType="email-address"
        autoCapitalize="none"
      />

      <TextField
        marginV-10
        style={styles.inputField}
        placeholderTextColor={'gray'}
        placeholder={'First Name'}
        onChangeText={(fname: string) =>
          setSignUpDetails(prev => ({
            ...prev,
            firstName: fname,
          }))
        }
        value={signUpDetails.firstName}
      />

      <TextField
        marginV-10
        style={styles.inputField}
        placeholder={'Last Name'}
        placeholderTextColor={'gray'}
        onChangeText={(lname: string) =>
          setSignUpDetails(prev => ({
            ...prev,
            lastName: lname,
          }))
        }
        value={signUpDetails.lastName}
      />
      <View>
        <TextField
          style={styles.inputField}
          marginV-10
          placeholder={'Password'}
          placeholderTextColor={'gray'}
          onChangeText={(password: string) =>
            setSignUpDetails(prev => ({
              ...prev,
              password: password,
            }))
          }
          value={signUpDetails.password}
          secureTextEntry={!showPassword}
        />
        <Text style={styles.passwordToggleButton} onPress={toggleShowPassword}>
          {passwordText}
        </Text>
      </View>
      <View row margin-10>
        <Checkbox
          label="Is this account for a merchant?"
          color={Style.rcoin}
          value={signUpDetails.is_merchant}
          onValueChange={(is_merchant: boolean) =>
            setSignUpDetails(prev => ({
              ...prev,
              is_merchant: is_merchant,
            }))
          }
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
    color: Style.rcoin,
  },

  subtext: {
    color: 'grey',
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
