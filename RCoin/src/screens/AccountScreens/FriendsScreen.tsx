import {ScrollView} from 'react-native';
import {Button, View, Incubator} from 'react-native-ui-lib';
import styles from '../../style/style';
import React, {useEffect, useState} from 'react';
import FriendElement from '../../components/FriendElement';
import Config from 'react-native-config';
import {useAuth} from '../../contexts/Auth';
import {useFriends} from '../../contexts/FriendContext';
const {TextField} = Incubator;

const FriendsScreen = () => {
  const [loading, setLoading] = useState(false);
  const initArr: any[] = [];
  const [newFriendEmail, setNewFriendEmail] = useState('');
  const [valid, setValid] = useState(false);

  const auth = useAuth();
  const friends_context = useFriends();

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
        setValid(data['valid']);
        return data['valid'];
      })
      .catch(error => {
        console.log(error);
        return false;
      });
  }

  const addFriend = () => {
    fetch(`${Config.API_URL}:8000/api/add_friend`, {
      method: 'POST',
      headers: {
        'Content-type': 'application/json',
        Authorization: `Bearer ${auth.authData?.token}`,
      },
      body: JSON.stringify({email: newFriendEmail}, null, 2),
    }).catch(error => {
      setLoading(false);
      console.log(error);
    });
    friends_context.refresh();
  };

  if (loading) {
    return <></>;
  } else {
    return (
      <View flex margin-10>
        <ScrollView>
          {friends_context.friends.map(friend => (
            <View paddingV-5 key={friend.id}>
              <FriendElement
                first_name={friend.first_name}
                last_name={friend.last_name}
                wallet_id={friend.wallet_id}
                email={friend.email}
              />
            </View>
          ))}
        </ScrollView>
        <TextField
          placeholder="Friend's Email"
          style={styles.input}
          keyboardType="email-address"
          autoCapitalize="none"
          onChangeText={(email: string) => {
            setNewFriendEmail(email);
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
        <Button
          onPress={addFriend}
          disabled={!valid}
          label="Add Friend"
          backgroundColor={styles.rcoin}
        />
      </View>
    );
  }
};

export default FriendsScreen;
