import React, { useState } from 'react';
import { Text, Incubator, View, Button, LoaderScreen } from "react-native-ui-lib";
import styles from '../../style/style'
import { NavigationScreenProp } from 'react-navigation';
import { useAuth } from '../../contexts/Auth';
const { TextField } = Incubator

const SupportScreen = () => {

  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [messageSent, setMessageSent] = useState(false);
  const [messageReceived, setMessageReceived] = useState(false);
  const [errorReceived, setErrorReceived] = useState(false);
  const auth = useAuth();

  const sendMessage = () => {
    setMessageSent(true);
    fetch('http://10.0.2.2:8000/api/send_message', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${auth.authData?.token}`,
      },
      body: JSON.stringify(
        {
          title: title,
          message: message
        },
        null,
        2,
      ),
    })
      .then(res => {
        if (!res.ok) {
          setErrorReceived(true);
        } else {
          setMessageReceived(true);
        }
      })
  }

  if (!messageSent && !messageReceived) {
    return (
      <View flex>
        <Text text40 style={styles.title}>
          Send us a message
        </Text>
        <View margin-30>
          <Text center text70 marginB-20>
            Send us a message here and we will aim to reply to the email associated with your account within 48 hours!
          </Text>
          <TextField
            center
            placeholder="A short title for us"
            style={styles.input}
            onChangeText={(title: string) => {
              setTitle(title);
            }}
            multiline={true}
          />
          <TextField
            center
            placeholder="What's happening?"
            style={styles.large_input}
            onChangeText={(title: string) => {
              setMessage(title);
            }}
            multiline={true}
          />
        </View>
        <View flex bottom marginH-30 marginB-50>
          <Button onPress={sendMessage} label="Send Message" backgroundColor={styles.rcoin} />
        </View>
      </View>
    )
  }
  else if (messageSent && !messageReceived && !errorReceived) {
    return (
      <LoaderScreen
        loaderColor={styles.rcoin}
        message="Sending Message"
      />
    );
  }
  else if (messageReceived) {
    return (
      <Text margin-50 text40 color={styles.success} center>
        Message Sent!
      </Text>
    );
  } else if (errorReceived) {
    return (
      <Text margin-50 text40 color={styles.failed} center>
        Error sending message
      </Text>
    );
  } else {
    return (
      <></>
    );
  }
}

export default SupportScreen;
