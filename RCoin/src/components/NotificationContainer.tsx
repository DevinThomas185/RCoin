import {useState} from 'react';
import {
  Notifications,
  Registered,
  RegistrationError,
  Notification,
  NotificationCompletion,
} from 'react-native-notifications';
import Config from 'react-native-config';
import {useAuth} from '../contexts/Auth';

const useConstructor = (callBack = () => {}) => {
  const [hasBeenCalled, setHasBeenCalled] = useState(false);
  if (hasBeenCalled) return;
  callBack();
  setHasBeenCalled(true);
};

export const NotificationContainer = ({children}: {children: JSX.Element}) => {
  const auth = useAuth();

  const postDeviceToken = (deviceToken: string) => {
    fetch(`${Config.API_URL}/api/register-device-token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${auth.authData?.token}`,
      },
      body: JSON.stringify({device_token: deviceToken}, null, 2),
    })
      .then(res => {
        if (!res.ok) {
          throw new Error('post device token failed');
        }
        return res.json();
      })
      .catch(error => {
        console.log(error);
      });
  };

  useConstructor(() => {
    Notifications.registerRemoteNotifications();
    Notifications.events().registerRemoteNotificationsRegistered(
      (event: Registered) => {
        console.log('Device Token Received', event.deviceToken);
        postDeviceToken(event.deviceToken);
      },
    );
    Notifications.events().registerRemoteNotificationsRegistrationFailed(
      (event: RegistrationError) => {
        console.error(event);
      },
    );

    // Notifications.events().registerNotificationOpened((notification: Notification, completion: () => void, action: NotificationActionResponse) => {
    //     console.log("Notification opened by device user", notification.payload);
    //     console.log(`Notification opened with an action identifier: ${action.identifier} and response text: ${action.text}`);
    //     completion();
    // });
    Notifications.events().registerNotificationReceivedForeground(
      (notification: Notification, completion: (response: any) => void) => {
        console.log(JSON.stringify(notification.payload));

        // Calling completion on iOS with `alert: true` will present the native iOS inApp notification.
        completion({alert: true, sound: true, badge: false});
      },
    );

    Notifications.events().registerNotificationReceivedBackground(
      (notification: Notification, completion: (response: any) => void) => {
        console.log(JSON.stringify(notification.payload));

        // Calling completion on iOS with `alert: true` will present the native iOS inApp notification.
        completion({alert: true, sound: true, badge: false});
      },
    );
  });

  return children;
};
