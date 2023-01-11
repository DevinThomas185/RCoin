import {StyleSheet} from 'react-native';
import {Button, Text, View} from 'react-native-ui-lib';
import {NavigationScreenProp} from 'react-navigation';
import Style from '../style/style';

const MissingWallet = ({
  navigation,
}: {
  navigation: NavigationScreenProp<any, any>;
}) => {
  return (
    <View flex marginH-10>
      <View marginV-10 flex center>
        <Text text40 style={Style.title}>
          Wallet Missing
        </Text>
        <Text text70>
          Please go to Account/Account Details/Wallet and import your wallet to
          be able to Withdraw and Transfer RCoin
        </Text>
      </View>
      <View bottom marginV-10>
        <Button
          label="Account Details"
          onPress={() => navigation.navigate('Account')}
          backgroundColor={Style.rcoin}
        />
      </View>
    </View>
  );
};

export default MissingWallet;
