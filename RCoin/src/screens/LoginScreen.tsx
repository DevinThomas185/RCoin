import React, {useState} from 'react';
import {Button, TextInput, View} from 'react-native';
import {useAuth} from '../contexts/Auth';

const LoginScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const auth = useAuth();

  return (
    <View>
      <TextInput placeholder="Email" onChangeText={email => setEmail(email)} />
      <TextInput
        placeholder="Password"
        secureTextEntry={true}
        onChangeText={password => setPassword(password)}
      />
      <Button
        title="Submit"
        onPress={() => {
          auth.signIn(email, password);
        }}
      />
    </View>
  );
};

export default LoginScreen;
