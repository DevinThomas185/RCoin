import { useState } from 'react';
import { StyleSheet } from 'react-native';
import { View, Button, Incubator, Text, Icon, Image } from 'react-native-ui-lib'; //eslint-disable-line
import { UserSignUp } from '../../types/SignUp';
const { TextField } = Incubator;

export const StepOne = ({
  signUpDetails,
  setSignUpDetails,
}: {
  signUpDetails: UserSignUp;
  setSignUpDetails: React.Dispatch<React.SetStateAction<UserSignUp>>;
}) => {

  const [passwordText, setPasswordText] = useState("Show")
  const [showPassword, setShowPassword] = useState(false)

  const toggleShowPassword = () => {
    setShowPassword(!showPassword)
    setPasswordText(passwordText === "Show" ? "Hide" : "Show")
  }

  return (
    <View>
      <Text style={styles.title}>
        Your Details
      </Text>
      <Text style={styles.subtext}>
        Your email will be used to sign in.
      </Text>
      <TextField
        style={styles.inputField}
        placeholder={'Email'}
        onChangeText={(email: string) =>
          setSignUpDetails(prev => ({
            ...prev,
            email: email,
          }))
        }
        value={signUpDetails.email}
        keyboardType='email-address'
        autoCapitalize='none'
      />

      <TextField
        style={styles.inputField}
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
        style={styles.inputField}
        placeholder={'Last Name'}
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
          dasdad
          placeholder={'Password'}
          onChangeText={(password: string) =>
            setSignUpDetails(prev => ({
              ...prev,
              password: password,
            }))
          }
          value={signUpDetails.password}
          secureTextEntry={!showPassword}
        >
        </TextField>
        <Text style={styles.passwordToggleButton} onPress={toggleShowPassword}>{passwordText}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  title: {
    fontWeight: 'bold',
    fontSize: 30,
    textAlign: 'left',
    marginLeft: 20
  },

  subtext: {
    padding: 20,
    color: 'grey',
  },

  floatingPlaceholder: {
    zIndex: 0,
    margin: 20,
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
    margin: 10,
  },

  passwordToggleButton: {
    top: 25,
    right: 20,
    position: 'absolute',
    fontSize: 16,
    color: '#435C9C',
  },

  button: {
    padding: 14,
    margin: 20,
    width: '80%',
    justifyContent: 'center',
    alignSelf: 'center',
  },

  signup: {
    justifyContent: 'center',
    alignSelf: 'center',
  },
});
