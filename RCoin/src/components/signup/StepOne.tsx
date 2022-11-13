import {StyleSheet} from 'react-native';
import {View, Button, Incubator, Text} from 'react-native-ui-lib'; //eslint-disable-line
import {UserSignUp} from '../../types/SignUp';
const {TextField} = Incubator;

export const StepOne = ({
  signUpDetails,
  setSignUpDetails,
}: {
  signUpDetails: UserSignUp;
  setSignUpDetails: React.Dispatch<React.SetStateAction<UserSignUp>>;
}) => {
  return (
    <View>
      <Text center text30>
        Your Details
      </Text>
      <TextField
        style={styles.inputField}
        placeholder={'Email'}
        floatingPlaceholder
        onChangeText={(email: string) =>
          setSignUpDetails(prev => ({
            ...prev,
            email: email,
          }))
        }
        value={signUpDetails.email}
        floatingPlaceholderStyle={{alignSelf: 'center'}}
      />

      <TextField
        style={styles.inputField}
        placeholder={'First Name'}
        floatingPlaceholder
        onChangeText={(fname: string) =>
          setSignUpDetails(prev => ({
            ...prev,
            firstName: fname,
          }))
        }
        value={signUpDetails.firstName}
        floatingPlaceholderStyle={{alignSelf: 'center'}}
      />

      <TextField
        style={styles.inputField}
        placeholder={'Last Name'}
        floatingPlaceholder
        onChangeText={(lname: string) =>
          setSignUpDetails(prev => ({
            ...prev,
            lastName: lname,
          }))
        }
        value={signUpDetails.lastName}
        floatingPlaceholderStyle={{alignSelf: 'center'}}
      />

      <TextField
        style={styles.inputField}
        dasdad
        placeholder={'Password'}
        floatingPlaceholder
        onChangeText={(password: string) =>
          setSignUpDetails(prev => ({
            ...prev,
            password: password,
          }))
        }
        value={signUpDetails.password}
        secureTextEntry
        floatingPlaceholderStyle={{alignSelf: 'center'}}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  inputField: {
    padding: 14,
    fontSize: 18,
    width: '80%',
    justifyContent: 'center',
    alignSelf: 'center',
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
