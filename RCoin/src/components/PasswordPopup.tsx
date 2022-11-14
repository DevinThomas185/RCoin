import Modal from 'react-native-modal';
import React, { useEffect, useState } from 'react';
import { Text, View, StyleSheet, TextInput } from 'react-native';
import { Button, Colors } from 'react-native-ui-lib';
import { CustomModal } from '../components/Modal';
import { useKeypair } from '../contexts/Keypair';
import { Keypair } from '@solana/web3.js';



const PasswordPopup = ({
        isModalVisible, 
        setIsModalVisible,
        setSecretKey
    } : {
        isModalVisible: boolean, 
        setIsModalVisible: React.Dispatch<React.SetStateAction<boolean>>,
        setSecretKey: React.Dispatch<React.SetStateAction<Uint8Array | undefined>>
    }) => {

    const [failed, setFailed] = useState(false);
    const [input, setInput] = useState("");
    const keyPair = useKeypair();

    const handleClose = () => {
        setIsModalVisible(() => !isModalVisible);
        setInput("")
        setFailed(false)
    }



    const handleSignUp = () => {
        keyPair.readPair(input).then((v: Keypair) => {
            if (v === undefined) {
                setFailed(true)
            } else {
                handleClose()
                setFailed(false)
                setSecretKey(v.secretKey)
            }
        })
    };

    const handleTextChange = (v: string) => setInput(v)

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
            <Modal isVisible={isModalVisible}>
                <CustomModal.Container>
                    <View style={styles.modal}>
                        <CustomModal.Header title="Wallet Password"/>
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
                            <View style={styles.button}>
                                <Button label="Cancel" onPress={handleClose} backgroundColor={Colors.blue10} />
                                <Button label="Submit" onPress={handleSignUp} backgroundColor={Colors.blue10} />
                            </View>
                        </CustomModal.Footer>
                    </View>
                </CustomModal.Container>
            </Modal>
        </View>
    );
};

export default PasswordPopup;