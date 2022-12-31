import {useEffect, useState} from 'react';
import Config from 'react-native-config';
import {Card} from 'react-native-ui-lib';
import {ScrollView} from 'react-native';
import {NavigationScreenProp} from 'react-navigation';
import {useAuth} from '../../contexts/Auth';
import FriendCircle from './FriendCircle';

const FriendsWidget = ({
  navigation,
}: {
  navigation: NavigationScreenProp<any, any>;
}) => {
  const auth = useAuth();

  const initArr: any[] = [];
  const [friends, setFriends] = useState<any[]>(initArr);

  const updateFriends = () => {
    fetch(`${Config.API_URL}:8000/api/get_friends`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${auth.authData?.token}`,
      },
    })
      .then(res => res.json())
      .then(data => {
        setFriends(data['friends']);
      })
      .catch(error => {
        console.log(error);
      });
  };

  useEffect(() => {
    updateFriends();
  }, []);

  if (friends.length == 0) {
    return <></>;
  } else {
    return (
      <Card
        center
        row
        marginH-30
        paddingV-10
        style={{justifyContent: 'space-between'}}>
        <ScrollView horizontal>
          {friends.map(friend => (
            <FriendCircle
              key={friend.id}
              image={require('../../style/deposit.png')}
              first_name={friend.first_name}
              last_name={friend.last_name}
              onPress={() => {
                navigation.navigate('Transfer', {
                  qr_amount: 0,
                  qr_recipient: friend.email,
                });
              }}
            />
          ))}
        </ScrollView>
      </Card>
    );
  }
};

export default FriendsWidget;
