import React from 'react';
import {ScrollView} from 'react-native';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {Card, Image, Text, View} from 'react-native-ui-lib';
import styles from '../style/style';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Config from 'react-native-config';
import {useAuth} from '../contexts/Auth';

const small_size = 50;

const FriendElement = ({
  name,
  email,
  update,
}: {
  name: string;
  email: string;
  update: () => void;
}) => {
  const auth = useAuth();
  const deleteFriend = () => {
    fetch(`${Config.API_URL}:8000/api/delete_friend`, {
      method: 'POST',
      headers: {
        'Content-type': 'application/json',
        Authorization: `Bearer ${auth.authData?.token}`,
      },
      body: JSON.stringify({email: email}, null, 2),
    }).catch(error => {
      console.log(error);
    });
    update();
  };

  return (
    <Card style={{borderRadius: small_size / 2}}>
      <View row>
        <View flexS>
          <Image
            source={require('../style/deposit.png')}
            style={{
              height: small_size,
              width: small_size,
              borderRadius: small_size / 2,
            }}
          />
        </View>
        <View flexG center>
          <Text text60>{name}</Text>
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
