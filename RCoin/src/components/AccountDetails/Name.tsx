import {Card, Text, View, Incubator, Button} from 'react-native-ui-lib';
import {useAuth} from '../../contexts/Auth';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {useState} from 'react';
import styles from '../../style/style';
const {TextField} = Incubator;
import Config from 'react-native-config';

const NameDetail = () => {
  const auth = useAuth();

  const [open, setOpen] = useState(false);
  const [new_first_name, setNewFirstName] = useState('');
  const [new_last_name, setNewLastName] = useState('');
  const [responded, setResponded] = useState(false);
  const [success, setSuccess] = useState(false);

  const changeName = () => {
    fetch(`${Config.API_URL}:8000/api/change_name`, {
      method: 'POST',
      headers: {
        'Content-type': 'application/json',
        Authorization: `Bearer ${auth.authData?.token}`,
      },
      body: JSON.stringify(
        {
          new_first_name: new_first_name,
          new_last_name: new_last_name,
        },
        null,
        2,
      ),
    })
      .then(res => {
        setResponded(true);
        if (res.status == 200) {
          setSuccess(true);
          setNewFirstName('');
          setNewLastName('');
        }
      })
      .catch(error => {
        console.log(error);
      });
    auth.refresh();
  };

  return (
    <Card
      style={{marginBottom: 15}}
      onPress={() => {
        setOpen(!open);
      }}
      enableShadow>
      <View margin-20 spread row centerV>
        <Text text60 $textDefault>
          Name
        </Text>
        <Text text70 $textDefault>
          {auth.authData?.token_info.name}
        </Text>
        <Ionicons size={30} name={open ? 'chevron-up' : 'chevron-down'} />
      </View>
      {open ? (
        <View spread centerV>
          <TextField
            placeholder="New First Name"
            style={styles.input}
            value={new_first_name}
            onChangeText={(value: string) => {
              setNewFirstName(value);
            }}
            marginH-10
            marginV-5
          />
          <TextField
            placeholder="New Last Name"
            style={styles.input}
            value={new_last_name}
            onChangeText={(value: string) => {
              setNewLastName(value);
            }}
            marginH-10
          />
          <View center marginB-5>
            {responded ? (
              success ? (
                <Text color={styles.success}>Name Changed!</Text>
              ) : (
                <Text color={styles.failed}>Change failed</Text>
              )
            ) : (
              <></>
            )}
          </View>
          <Button
            marginH-10
            marginB-10
            onPress={changeName}
            label="Change Name"
            backgroundColor={styles.rcoin}
          />
        </View>
      ) : (
        <></>
      )}
    </Card>
  );
};

export default NameDetail;
