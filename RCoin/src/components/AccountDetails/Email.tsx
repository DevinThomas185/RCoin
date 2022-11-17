import { Card, Text, View, Incubator, Button } from "react-native-ui-lib";
import { useAuth } from "../../contexts/Auth";
import Ionicons from "react-native-vector-icons/Ionicons"
import { useState } from "react";
import styles from "../../style/style"
const { TextField } = Incubator

const EmailDetail = () => {

  const auth = useAuth();

  const [open, setOpen] = useState(false);
  const [new_email, setNewEmail] = useState("");
  const [responded, setResponded] = useState(false);
  const [success, setSuccess] = useState(false);

  const changeEmail = () => {
    fetch('http://10.0.2.2:8000/api/change_email', {
      method: 'POST',
      headers: {
        'Content-type': 'application/json',
        Authorization: `Bearer ${auth.authData?.token}`,
      },
      body: JSON.stringify(
        { new_email: new_email },
        null,
        2,
      ),
    })
      .then(res => {
        setResponded(true);
        if (res.status == 200) {
          setSuccess(true);
        }
      })
      .catch(error => {
        console.log(error);
      });
  }

  return (
    <Card
      style={{ marginBottom: 15 }}
      onPress={() => { setOpen(!open) }}
      enableShadow
    >
      <View margin-20 spread row centerV>
        <Text text60 $textDefault>
          Email
        </Text>
        <Text text70 $textDefault>
          {auth.authData?.token_info.email}
        </Text>
        <Ionicons size={30} name={open ? "chevron-up" : "chevron-down"} />
      </View>
      {
        open ?
          <View spread centerV>
            <TextField
              placeholder="New Email"
              style={styles.input}
              onChangeText={(value: string) => { setNewEmail(value) }}
              marginH-20
            />
            <View center marginB-5>
              {
                responded ?
                  success ?
                    <Text color={styles.success}>Email Changed!</Text>
                    :
                    <Text color={styles.failed}>Change failed</Text>
                  :
                  <></>
              }
            </View>
            <Button
              marginH-30
              marginB-10
              onPress={changeEmail}
              label="Change Email"
              backgroundColor={styles.rcoin}
            />
          </View>
          :
          <></>
      }
    </Card>
  );
}

export default EmailDetail;