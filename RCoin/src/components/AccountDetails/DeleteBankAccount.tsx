import {View, Text, Button} from 'react-native-ui-lib';
import Modal from 'react-native-modal';
import {CustomModal} from '../../components/Modal';
import styles from '../../style/style';
import Config from 'react-native-config';
import {useAuth} from '../../contexts/Auth';
import {useState} from 'react';

const DeleteBankAccount = ({
  bank_account,
  sort_code,
  isVisible,
  setIsVisible,
  onSuccess,
}: {
  bank_account: string;
  sort_code: string;
  isVisible: boolean;
  setIsVisible: React.Dispatch<React.SetStateAction<boolean>>;
  onSuccess: () => void;
}) => {
  const handleClose = () => {
    setIsVisible(false);
  };

  const auth = useAuth();

  const handleSubmit = () => {
    fetch(`${Config.API_URL}:8000/api/delete_bank_account`, {
      method: 'POST',
      headers: {
        'Content-type': 'application/json',
        Authorization: `Bearer ${auth.authData?.token}`,
      },
      body: JSON.stringify(
        {
          user_id: auth.authData?.token_info.user_id,
          bank_account: bank_account,
          sort_code: sort_code,
        },
        null,
        2,
      ),
    })
      .then(res => {
        if (res.status == 200) {
          onSuccess();
          setIsVisible(false);
        }
      })
      .catch(error => {
        console.log(error);
      });
  };

  return (
    <View>
      <Modal isVisible={isVisible} onBackButtonPress={handleClose}>
        <CustomModal.Container>
          <View style={styles.modal}>
            <CustomModal.Header title="Confirm Bank Account Deletion" />
            <CustomModal.Body>
              <Text>
                This account will be deleted from your list of known bank
                accounts.
              </Text>
              <Text>You can re-add this account later if you wish.</Text>
            </CustomModal.Body>
            <CustomModal.Footer>
              <View
                style={{flexDirection: 'column', height: 100, width: '100%'}}>
                <View style={{justifyContent: 'space-between'}} row>
                  <View flexG>
                    <Button
                      label="Cancel"
                      onPress={handleClose}
                      backgroundColor={styles.failed}
                    />
                  </View>
                  <View flexG>
                    <Button
                      label="Confirm"
                      onPress={handleSubmit}
                      backgroundColor={styles.success}
                    />
                  </View>
                </View>
              </View>
            </CustomModal.Footer>
          </View>
        </CustomModal.Container>
      </Modal>
    </View>
  );
};

export default DeleteBankAccount;
