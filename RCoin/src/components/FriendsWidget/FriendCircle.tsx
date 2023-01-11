import {Text, TouchableOpacity, View} from 'react-native-ui-lib';
import FriendAvatar from '../FriendAvatar';

const size = 50;

const FriendCircle = ({
  image,
  first_name,
  last_name,
  wallet_id,
  onPress,
}: {
  image: any;
  first_name: string;
  last_name: string;
  wallet_id: string;
  onPress: () => void;
}) => {
  return (
    <View centerH>
      <TouchableOpacity onPress={onPress}>
        <View center>
          <FriendAvatar
            size={size}
            first_name={first_name}
            last_name={last_name}
            wallet_id={wallet_id}
          />
          <Text>{first_name}</Text>
          <Text>{last_name}</Text>
        </View>
      </TouchableOpacity>
    </View>
  );
};

export default FriendCircle;
