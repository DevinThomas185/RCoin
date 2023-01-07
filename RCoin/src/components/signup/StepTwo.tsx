import {StyleSheet} from 'react-native';
import {View, Button, Incubator, Text} from 'react-native-ui-lib'; //eslint-disable-line
import Style from '../../style/style';
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
        marginV-10
        style={styles.inputField}
        placeholder={'Bank Account Number'}
        placeholderTextColor={'gray'}
        onChangeText={(bnum: string) =>
          setSignUpDetails(prev => ({
            ...prev,
            bankAccountNumber: bnum,
          }))
        }
        value={signUpDetails.bankAccountNumber}
      />

      <TextField
        marginV-10
        style={styles.inputField}
        placeholder={'Bank Code'}
        placeholderTextColor={'gray'}
        onChangeText={(bcode: string) =>
          setSignUpDetails(prev => ({
            ...prev,
            bankCode: bcode,
          }))
        }
        value={signUpDetails.bankCode}
      />

      <TextField
        marginV-10
        style={styles.inputField}
        placeholder={'ID Number'}
        placeholderTextColor={'gray'}
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
