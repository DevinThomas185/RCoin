import {LoaderScreen, Text, View} from 'react-native-ui-lib';
import Style from '../style/style';

const PendingLoader = ({
  loading,
  show,
  response_state,
  loading_page_message,
  custom_fail_message,
}: {
  loading: boolean;
  show: boolean;
  response_state: number;
  loading_page_message: string;
  custom_fail_message: string;
}) => {
  if (show || loading) {
    if (response_state == 0) {
      return (
        <View flex margin-40>
          <LoaderScreen
            loaderColor={Style.rcoin}
            message={loading_page_message}
          />
        </View>
      );
    } else {
      return (
        <View flex margin-40 center>
          <Text center text60 color={Style.failed}>
            {custom_fail_message}
          </Text>
        </View>
      );
    }
  } else {
    return <></>;
  }
};

export default PendingLoader;
