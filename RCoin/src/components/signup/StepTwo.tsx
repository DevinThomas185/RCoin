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
      <Text style={styles.title}>Bank Details</Text>
      <Text style={styles.subtext}>
        This is where we will deposit and withdraw your Rand.
      </Text>
      <TextField
        style={styles.inputField}
        placeholder={'Bank Account Number'}
        onChangeText={(bnum: string) =>
          setSignUpDetails(prev => ({
            ...prev,
            bankAccountNumber: bnum,
          }))
        }
        value={signUpDetails.bankAccountNumber}
      />

      <TextField
        style={styles.inputField}
        placeholder={'Bank Code'}
        onChangeText={(bcode: string) =>
          setSignUpDetails(prev => ({
            ...prev,
            bankCode: bcode,
          }))
        }
        value={signUpDetails.bankCode}
      />

      <TextField
        style={styles.inputField}
        placeholder={'ID Number'}
        onChangeText={(id: string) =>
          setSignUpDetails(prev => ({
            ...prev,
            IDNumber: id,
          }))
        }
        value={signUpDetails.IDNumber}
      />
      <Text style={styles.subtext}>
        You can view and update your bank details at any time later on.
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  title: {
    fontWeight: 'bold',
    fontSize: 30,
    textAlign: 'left',
    marginLeft: 20,
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
