import {LoaderScreen, Text, View} from 'react-native-ui-lib';
import {useAuth} from '../contexts/Auth';
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
  const auth = useAuth();

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
    } else if (response_state == -1) {
      // Generic Failure
      return (
        <View flex margin-40 center>
          <Text center text60 color={Style.failed}>
            {custom_fail_message}
          </Text>
        </View>
      );
    } else if (response_state == -2) {
      // Suspected Fraud
      auth.refresh();
      return (
        <View flex margin-20 center>
          <Text center text70 color={Style.failed}>
            This transaction has been flagged for fraud. The RCoin team have
            been alerted and will reach out imminently. Your account has been
            temporarily suspended until we can rectify the matter.
          </Text>
        </View>
      );
    } else {
      return <></>;
    }
  } else {
    return <></>;
  }
};

export default PendingLoader;
