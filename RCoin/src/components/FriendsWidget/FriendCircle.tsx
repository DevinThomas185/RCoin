import {Image, Text, TouchableOpacity, View} from 'react-native-ui-lib';

const size = 50;

const FriendCircle = ({
  image,
  first_name,
  last_name,
  onPress,
}: {
  image: any;
  first_name: string;
  last_name: string;
  onPress: () => void;
}) => {
  return (
    <View centerH marginH-10 style={{width: size + 20}}>
      <TouchableOpacity onPress={onPress}>
        <View center>
          <Image
            source={image}
            style={{height: size, width: size, borderRadius: size / 2}}
          />
          <Text>{first_name}</Text>
          <Text>{last_name}</Text>
        </View>
      </TouchableOpacity>
    </View>
  );
};

export default FriendCircle;
