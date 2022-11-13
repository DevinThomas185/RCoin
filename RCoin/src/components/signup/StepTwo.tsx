import {StyleSheet} from 'react-native';
import {View, Button, Incubator, Text} from 'react-native-ui-lib'; //eslint-disable-line
import {UserSignUp} from '../../types/SignUp';
const {TextField} = Incubator;

export const StepTwo = ({
  signUpDetails,
  setSignUpDetails,
}: {
  signUpDetails: UserSignUp;
  setSignUpDetails: React.Dispatch<React.SetStateAction<UserSignUp>>;
}) => {
  return (
    <View>
      <Text center text30>
        Bank Details
      </Text>
      <TextField
        style={styles.inputField}
        placeholder={'Bank Account Number'}
        floatingPlaceholder
        onChangeText={(bnum: string) =>
          setSignUpDetails(prev => ({
            ...prev,
            bankAccountNumber: bnum,
          }))
        }
        value={signUpDetails.bankAccountNumber}
        floatingPlaceholderStyle={{alignSelf: 'center'}}
      />

      <TextField
        style={styles.inputField}
        placeholder={'Bank Code'}
        floatingPlaceholder
        onChangeText={(bcode: string) =>
          setSignUpDetails(prev => ({
            ...prev,
            bankCode: bcode,
          }))
        }
        value={signUpDetails.bankCode}
        floatingPlaceholderStyle={{alignSelf: 'center'}}
      />

      <TextField
        style={styles.inputField}
        placeholder={'ID Number'}
        floatingPlaceholder
        onChangeText={(id: string) =>
          setSignUpDetails(prev => ({
            ...prev,
            IDNumber: id,
          }))
        }
        value={signUpDetails.IDNumber}
        floatingPlaceholderStyle={{alignSelf: 'center'}}
      />

      <Text>
        You can view and update your bank details at any time later on.
      </Text>
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
