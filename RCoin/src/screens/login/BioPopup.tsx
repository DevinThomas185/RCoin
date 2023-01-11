import Modal from 'react-native-modal';
import React, {useEffect, useState} from 'react';
import {Text, View, StyleSheet, TextInput} from 'react-native';
import {Button, Colors} from 'react-native-ui-lib';
import {Keypair} from '@solana/web3.js';
import ReactNativeBiometrics from 'react-native-biometrics';
import {CustomModal} from '../../components/Modal';
import Style from '../../style/style';

const BioPopup = ({
  isVisible,
  setIsVisible,
  onClose,
  onBioEnabled,
}: {
  isVisible: boolean;
  setIsVisible: React.Dispatch<React.SetStateAction<boolean>>;
  onClose: () => void;
  onBioEnabled: () => Promise<void>;
}) => {
  const handleNo = () => {
    onClose();
    setIsVisible(false);
  };
  const handleYes = async () => {
    await onBioEnabled();
    onClose();
    setIsVisible(false);
  };

  return (
    <View>
      <Modal isVisible={isVisible} onBackButtonPress={handleNo}>
        <CustomModal.Container>
          <View style={styles.modal}>
            <CustomModal.Header title="Enable Biometric Login" />
            <CustomModal.Body>
              <Text style={styles.text}>
                Do you want to enable biometric login?
              </Text>
            </CustomModal.Body>
            <CustomModal.Footer>
              <View
                style={{flexDirection: 'column', height: 100, width: '100%'}}>
                <View style={styles.button}>
                  <Button
                    label="No"
                    onPress={handleNo}
                    backgroundColor={Style.rcoin}
                  />
                  <Button
                    label="Yes"
                    onPress={handleYes}
                    backgroundColor={Style.rcoin}
                  />
                </View>
              </View>
            </CustomModal.Footer>
          </View>
        </CustomModal.Container>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'black',
  },
  text: {
    fontSize: 16,
    fontWeight: '400',
    textAlign: 'center',
    color: 'black',
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%',
  },
  input: {
    paddingTop: 10,
    borderColor: 'grey',
    borderBottomWidth: 2,
    color: 'black',
  },
  button: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    paddingTop: 5,
  },
  modal: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 10,
    paddingBottom: 10,
  },
});

export default BioPopup;
