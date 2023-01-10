import React from 'react';
import {Card, Text, View} from 'react-native-ui-lib';
import styles from '../style/style';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Config from 'react-native-config';
import {useAuth} from '../contexts/Auth';
import FriendAvatar from './FriendAvatar';
import {useFriends} from '../contexts/FriendContext';

const small_size = 50;

const FriendElement = ({
  first_name,
  last_name,
  email,
  wallet_id,
}: {
  first_name: string;
  last_name: string;
  email: string;
  wallet_id: string;
}) => {
  const auth = useAuth();
  const friends_context = useFriends();

  const deleteFriend = () => {
    fetch(`${Config.API_URL}/api/delete_friend`, {
      method: 'POST',
      headers: {
        'Content-type': 'application/json',
        Authorization: `Bearer ${auth.authData?.token}`,
      },
      body: JSON.stringify({email: email}, null, 2),
    }).catch(error => {
      console.log(error);
    });
    friends_context.refresh();
  };

  return (
    <Card style={{borderRadius: small_size / 2}}>
      <View row>
        <View flexS>
          <FriendAvatar
            size={small_size}
            first_name={first_name}
            last_name={last_name}
            wallet_id={wallet_id}
          />
        </View>
        <View flexG center>
          <Text text60>
            {first_name} {last_name}
          </Text>
          <Text text70>{email}</Text>
        </View>
        <View flexS centerV>
          <Ionicons
            size={30}
            name="trash-outline"
            onPress={deleteFriend}
            color={styles.failed}
          />
        </View>
      </View>
    </Card>
  );
};

export default FriendElement;
