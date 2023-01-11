import {Avatar} from 'react-native-ui-lib';
import generateHSL from './FriendsWidget/name_to_hsl';

const FriendAvatar = ({
  size,
  first_name,
  last_name,
  wallet_id,
}: {
  size: number;
  first_name: string;
  last_name: string;
  wallet_id: string;
}) => {
  return (
    <Avatar
      // name={first_name + last_name}
      animate
      size={size}
      // useAutoColors
      label={first_name.charAt(0) + last_name.charAt(0)}
      backgroundColor={generateHSL(wallet_id)}
      labelColor="#FFFFFF"
    />
  );
};

export default FriendAvatar;
