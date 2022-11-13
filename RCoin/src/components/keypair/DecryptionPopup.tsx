import {StyleSheet} from 'react-native';
import {Text, View, Incubator, Button} from 'react-native-ui-lib'; // eslint-disable-line
import Modal from 'react-native-modal';

const {TextField} = Incubator;

export const DecryptionPopup = () => {
  return (
    <Modal isVisible={false}>
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <View style={{width: '100%', height: '60%', backgroundColor: 'white'}}>
          {/* <Text text60>Enter Password</Text> */}
          <TextField
            placeholder={'Password'}
            floatingPlaceholder
            secureTextEntry
            // onChangeText={(email: string) => setEmail(email)}
            floatingPlaceholderStyle={{alignSelf: 'center'}}
          />
          <Button
            label={'Ok'}
            size={Button.sizes.medium}
            onPress={() => {
              // return password
              console.log('set the password and exit');
            }}
          />
          <Button
            label={'Cancel'}
            size={Button.sizes.medium}
            onPress={() => {
              console.log('handle cancel properly');
            }}
          />
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  outerModal: {
    // alignContent: 'center',
    flex: 1,
  },

  modal: {
    backgroundColor: 'white',
    margin: 15,
    maxWidth: '90%',
    maxHeight: '50%',

    alignItems: 'center',
    justifyContent: 'center',
  },
});
