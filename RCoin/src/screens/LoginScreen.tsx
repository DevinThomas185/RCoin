import React, {useState} from 'react';
// import {Button, TextInput, View} from 'react-native';

import {View, Button, Incubator, Text} from 'react-native-ui-lib'; //eslint-disable-line
import {StyleSheet} from 'react-native';
const {TextField} = Incubator;
import {NavigationScreenProp} from 'react-navigation';

import {useAuth} from '../contexts/Auth';

export const LoginScreen = ({
  navigation,
}: {
  navigation: NavigationScreenProp<any, any>;
}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const auth = useAuth();

  return (
    <View>
      <Text center text30>
        Log In
      </Text>

      <TextField
        style={styles.inputField}
        placeholder={'Email'}
        floatingPlaceholder
        onChangeText={(email: string) => setEmail(email)}
        floatingPlaceholderStyle={{alignSelf: 'center'}}
      />
      <TextField
        style={styles.inputField}
        placeholder={'Password'}
        floatingPlaceholder
        onChangeText={(password: string) => setPassword(password)}
        secureTextEntry
        floatingPlaceholderStyle={{alignSelf: 'center'}}
      />
      <Button
        style={styles.button}
        label={'Log In'}
        size={Button.sizes.medium}
        onPress={() => {
          auth.signIn(email, password);
        }}
      />
      <Text
        style={styles.signup}
        onPress={() => {
          navigation.navigate('SignUp');
        }}>
        Don't have an account? Sign Up
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
