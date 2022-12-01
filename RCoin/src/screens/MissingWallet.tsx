import {StyleSheet} from 'react-native';
import {Button, Text, View} from 'react-native-ui-lib';
import {NavigationScreenProp} from 'react-navigation';

const MissingWallet = ({
  navigation,
}: {
  navigation: NavigationScreenProp<any, any>;
}) => {
  return (
    <View flex style={styles.screen}>
      <Text style={styles.title}>Wallet Missing</Text>
      <Text style={styles.subtext}>
        Please go to Account Details/Wallet and import your wallet to be able to
        Widthdraw and Transfer RCoin
      </Text>
      <Button
        label="Account Details"
        style={styles.button}
        onPress={() => navigation.navigate('Account')}
      />
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
    fontSize: 20,
    padding: 20,
    color: 'grey',
  },

  screen: {
    height: '80%',
    maxHeight: '100%',
  },

  button: {
    position: 'absolute',
    bottom: 30,
    alignSelf: 'center',
    width: '80%',
  },
});

export default MissingWallet;
