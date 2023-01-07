import {Card, View} from 'react-native-ui-lib';
import {ScrollView, useWindowDimensions} from 'react-native';
import {NavigationScreenProp} from 'react-navigation';
import FriendCircle from './FriendCircle';
import {useFriends} from '../../contexts/FriendContext';
import {useEffect} from 'react';

const FriendsWidget = ({
  navigation,
}: {
  navigation: NavigationScreenProp<any, any>;
}) => {
  const friend_context = useFriends();

  useEffect(() => {
    friend_context.refresh();
  }, []);

  const circle_width = 80;

  const {width} = useWindowDimensions();

  const component_width = width - 20; // Dashboard says marginH-10 for this component

  const full_circles = Math.floor(component_width / circle_width);

  const final_width = component_width / full_circles;

  if (friend_context.friends.length == 0) {
    return <></>;
  } else {
    return (
      <Card center row paddingV-5 style={{justifyContent: 'space-between'}}>
        <ScrollView horizontal centerContent>
          {friend_context.friends.map(friend => (
            <View key={friend.id} style={{width: final_width}}>
              <FriendCircle
                image="" // Unused right now
                first_name={friend.first_name}
                last_name={friend.last_name}
                wallet_id={friend.wallet_id}
                onPress={() => {
                  navigation.navigate('Transfer', {
                    qr_amount: 0,
                    qr_recipient: friend.email,
                  });
                }}
              />
            </View>
          ))}
        </ScrollView>
      </Card>
    );
  }
};

export default FriendsWidget;
