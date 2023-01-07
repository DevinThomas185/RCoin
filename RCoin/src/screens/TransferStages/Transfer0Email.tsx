import React, {useState} from 'react';
import {Text, View, Button, Incubator, Image} from 'react-native-ui-lib';
import {useAuth} from '../../contexts/Auth';
const {TextField} = Incubator;
import styles from '../../style/style';
import Config from 'react-native-config';
import FriendsWidget from '../../components/FriendsWidget/FriendsWidget';
import {NavigationScreenProp} from 'react-navigation';
import {useFriends} from '../../contexts/FriendContext';

// Select the recipient
const Transfer0Email = ({
  nextStage,
  setRecipient,
  navigation,
}: {
  nextStage: React.Dispatch<void>;
  setRecipient: React.Dispatch<React.SetStateAction<string>>;
  navigation: NavigationScreenProp<any, any>;
}) => {
  const auth = useAuth();
  const [valid, setValid] = useState(false);
  const {friends} = useFriends();

  function isEmailValid(email: string): Promise<boolean> {
    return fetch(`${Config.API_URL}:8000/api/trade-email-valid`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${auth.authData?.token}`,
      },
      body: JSON.stringify({email: email}, null, 2),
    })
      .then(res => {
        if (!res.ok) {
          throw new Error('Could not make check email valid request');
        }
        return res.json();
      })
      .then(data => {
        console.log(data);
        setValid(data['valid']);
        return data['valid'];
      })
      .catch(error => {
        console.log(error);
        return false;
      });
  }

  return (
    <View flex marginH-10>
      <View marginV-10>
        <Text text40 style={styles.title}>
          Make a Transfer
        </Text>
        <Text text70>
          Send RCoin to someone by using Quick Contacts or entering a user's
          email.
        </Text>
      </View>

      {friends.length > 0 && (
        <View marginV-10>
          <Text text50>Quick Contacts</Text>
          <FriendsWidget navigation={navigation} />
        </View>
      )}

      <View flex centerV style={{justifyContent: 'space-evenly'}}>
        <View>
          {friends.length > 0 ? (
            <Text text60>Or, enter recipient's email</Text>
          ) : (
            <Text text60>Enter recipient's email</Text>
          )}
          <TextField
            placeholder="Email of Recipient"
            style={styles.input}
            keyboardType="email-address"
            autoCapitalize="none"
            onChangeText={(email: string) => {
              setRecipient(email);
            }}
            enableErrors
            validateOnBlur
            validationMessage={[
              'Email is required',
              'Email must be associated to an account',
            ]}
            validate={[
              'required',
              (email: string) => {
                (async () => await isEmailValid(email))();
                return !valid;
              },
            ]}
          />
        </View>
        <Image
          source={require('../../style/RCoin-RCoin.png')}
          style={{width: '100%', height: 130}}
        />
      </View>
      <View bottom marginV-10>
        <Button
          onPress={nextStage}
          disabled={!valid}
          label="Continue to Choose Amount"
          backgroundColor={styles.rcoin}
        />
      </View>
    </View>
  );
};

export default Transfer0Email;
