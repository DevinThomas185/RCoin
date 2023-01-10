import React, {useState} from 'react';
// import {Button, TextInput, View} from 'react-native';

import {View, Button, Incubator, Text, Image} from 'react-native-ui-lib'; //eslint-disable-line
import styles from '../style/style';
const {TextField} = Incubator;
import {NavigationScreenProp} from 'react-navigation';
import LinearGradient from 'react-native-linear-gradient';

import {useAuth} from '../contexts/Auth';
import Style from '../style/style';

export const LoginScreen = ({
  navigation,
}: {
  navigation: NavigationScreenProp<any, any>;
}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [failed, setFailed] = useState(false);
  const auth = useAuth();

  return (
    <View flex backgroundColor={styles.rcoin}>
      <View center>
        <Image
          marginB-100
          source={require('../style/Logo.png')}
          style={{height: 100, width: 100}}
        />
        <Text text30 color="white">
          Welcome to RCoin
        </Text>
      </View>

      <View
        marginH-10
        marginT-40
        backgroundColor="white"
        style={{borderRadius: 10}}>
        <TextField
          margin-10
          placeholder={'Email'}
          floatingPlaceholder
          onChangeText={(email: string) => setEmail(email)}
          keyboardType="email-address"
          floatingPlaceholderStyle={{alignSelf: 'center'}}
          autoCapitalize="none"
        />
        <TextField
          margin-10
          placeholder={'Password'}
          floatingPlaceholder
          onChangeText={(password: string) => setPassword(password)}
          secureTextEntry
          floatingPlaceholderStyle={{alignSelf: 'center'}}
        />
      </View>
      {failed && (
        <Text color={Style.white} center marginV-10>
          Incorrect email/password. Please try again.
        </Text>
      )}
      <Button
        marginH-30
        marginB-20
        marginT-30
        backgroundColor={styles.paystack}
        label={'Log In'}
        onPress={() => {
          setFailed(false);
          auth.signIn(email, password).then(succeeded => {
            setFailed(!succeeded);
          });
        }}
      />
      <Button
        marginH-30
        marginB-5
        backgroundColor={styles.tiffany_blue}
        label={'Create an Account'}
        onPress={() => {
          navigation.navigate('SignUp');
        }}
      />
    </View>
  );
};

// const styles = StyleSheet.create({
//   inputField: {
//     padding: 14,
//     fontSize: 18,
//     width: '80%',
//     justifyContent: 'center',
//     alignSelf: 'center',
//   },

//   button: {
//     padding: 14,
//     margin: 20,
//     width: '80%',
//     justifyContent: 'center',
//     alignSelf: 'center',
//   },

//   signup: {
//     justifyContent: 'center',
//     alignSelf: 'center',
//   },
// });
