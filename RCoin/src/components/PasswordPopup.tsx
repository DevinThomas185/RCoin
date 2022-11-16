import Modal from 'react-native-modal';
import React, { useEffect, useState } from 'react';
import { Text, View, StyleSheet, TextInput } from 'react-native';
import { Button, Colors } from 'react-native-ui-lib';
import { CustomModal } from '../components/Modal';
import { useKeypair } from '../contexts/Keypair';
import { Keypair } from '@solana/web3.js';
import ReactNativeBiometrics from 'react-native-biometrics';

const PasswordPopup = ({
    isVisible,
    setIsVisible,
    onSuccess,
}: {
    isVisible: boolean,
    setIsVisible: React.Dispatch<React.SetStateAction<boolean>>,
    onSuccess: (secretKey: Uint8Array) => void
}) => {

    const [failed, setFailed] = useState(false);
    const [input, setInput] = useState("");
    const keyPair = useKeypair();
    const rnBiometrics = new ReactNativeBiometrics()
    const [isBio, setBio] = useState(false)
    keyPair.bioSecretKeyExitsts().then((res: boolean) => setBio(res))

    const handleClose = () => {
        setIsVisible(false);
        setInput("")
        setFailed(false)
    }

    const createBio = async (kp: Keypair) => {
        if (isBio) {
            return;
        }

        handleBiometricLogin().then((password: string | undefined) => {
            if (password === undefined) {
                return
            }

            console.log(password)

            keyPair.writePairBio(kp, password)
            setBio(true)
        })
    }

    const handleSubmit = () => {
        keyPair.readPair(input).then((v: Keypair | undefined) => {
            if (v === undefined) {
                setFailed(true)
            } else {
                setFailed(false)
                onSuccess(v.secretKey)
                createBio(v)
                handleClose()
            }
        })
    };

    const handleUseBiometrics = () => {
        if (!isBio) {
            return;
        }

        handleBiometricLogin().then((password: string | undefined) => {
            if (password === undefined) {
                return;
            }

            keyPair.readPairBio(password).then((v: Keypair | undefined) => {
                if (v !== undefined) {
                    onSuccess(v.secretKey)
                    handleClose()
                }
            })
        })
    }

    const handleTextChange = (v: string) => setInput(v)

    const handleBiometricLogin = (): Promise<string | undefined> => {
        // const epochTimeSeconds = Math.round((new Date()).getTime() / 1000).toString()
        // const payload = epochTimeSeconds + 'some message'
        
        //[kk1219] TODO, ADD UNIQUE IDENTIFIER TO PAYLOAD
        const payload = 'password'

        return rnBiometrics.createSignature({
            promptMessage: 'Sign in',
            payload: payload
        })
            .then((resultObject) => {
                const { success, signature } = resultObject

                if (success) {
                    return signature
                }

                return undefined
            })
    }

    const styles = StyleSheet.create({
        container: {
            flex: 1,
            alignItems: "center",
            justifyContent: "center",
        },
        title: {
            fontSize: 20,
            fontWeight: "bold",
            color: "black",
        },
        text: {
            fontSize: 16,
            fontWeight: "400",
            textAlign: "center",
            color: "black",
        },
        separator: {
            marginVertical: 30,
            height: 1,
            width: "80%",
        },
        input: {
            paddingTop: 10,
            borderColor: failed ? "red" : "grey",
            borderBottomWidth: 2,
            color: "black",
        },
        button: {
            flexDirection: "row",
            flex: 1,
            justifyContent: "space-evenly",
            paddingTop: 5,
        },
        modal: {
            width: "100%",
            alignItems: "center",
            justifyContent: "center",
            paddingTop: 10,
            paddingBottom: 10,
        },
    });

    return (
        <View>
            <Modal isVisible={isVisible} onBackButtonPress={handleClose} onShow={handleUseBiometrics}>
                <CustomModal.Container>
                    <View style={styles.modal}>
                        <CustomModal.Header title="Wallet Password" />
                        <CustomModal.Body>
                            <Text style={styles.text}>
                                Please enter the password for your wallet
                            </Text>
                            <TextInput
                                style={styles.input}
                                placeholder="password"
                                keyboardType="default"
                                textContentType='password'
                                secureTextEntry={true}
                                onChangeText={handleTextChange}
                                value={input}
                            />
                        </CustomModal.Body>
                        <CustomModal.Footer>
                            <View style={{ flexDirection: "column", height: 100, width: '100%' }}>
                                <View style={styles.button}>
                                    <Button label="Cancel" onPress={handleClose} backgroundColor={Colors.blue10} />
                                    <Button label="Submit" onPress={handleSubmit} backgroundColor={Colors.blue10} />
                                </View>
                                <View style={styles.button}>
                                    <Button label="Use Biometrics" onPress={handleUseBiometrics} backgroundColor={Colors.blue10} disabled={!isBio} />
                                </View>
                            </View>
                        </CustomModal.Footer>
                    </View>
                </CustomModal.Container>
            </Modal>
        </View>
    );
};

export default PasswordPopup;