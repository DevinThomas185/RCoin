import { useEffect, useState } from 'react';
import { StyleSheet } from 'react-native';
import { View, Button, Incubator, Text, LoaderScreen } from 'react-native-ui-lib'; //eslint-disable-line
import { UserSignUp } from '../../types/SignUp';
const { TextField } = Incubator;
import { NavigationScreenProp } from 'react-navigation';

// https://github.com/uuidjs/uuid/issues/416
import { v4 as uuidv4 } from 'uuid'; // Very important, do not remove plz!!!!!

import { useKeypair } from '../../contexts/Keypair';
import {
    Transaction,
    Connection,
    sendAndConfirmTransaction,
    Keypair,
    Signer,
    PublicKey,
} from '@solana/web3.js';

export const StepThree = ({
    navigation,
    signUpDetails,
    setSignUpDetails,
}: {
    navigation: NavigationScreenProp<any, any>;
    signUpDetails: UserSignUp;
    setSignUpDetails: React.Dispatch<React.SetStateAction<UserSignUp>>;
}) => {

    const [key, setKey] = useState("")
    const [isValid, setIsValid] = useState(true)


    const [passwordText, setPasswordText] = useState("Show")
    const [showPassword, setShowPassword] = useState(false)

    const toggleShowPassword = () => {
        setShowPassword(!showPassword)
        setPasswordText(passwordText === "Show" ? "Hide" : "Show")
    }

    const [confirmPasswordText, setConfirmPasswordText] = useState("Show")
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)

    const toggleShowConfirmPassword = () => {
        setShowConfirmPassword(!showConfirmPassword)
        setConfirmPasswordText(confirmPasswordText === "Show" ? "Hide" : "Show")
    }

    return (
        <View>
            <Text style={styles.title}>
                Enter a wallet password
            </Text>
            <Text color='red' style={styles.subtext}>
                IT IS VERY IMPORTANT THAT YOU SAVE THIS PASSWORD OR YOU WILL LOSE ACCESS TO YOUR MONEY PERMANENTLY
            </Text>
            <View>
                <TextField
                    style={styles.inputField}
                    dasdad
                    placeholder={'Password'}
                    onChangeText={(password: string) => {
                        setKey(password)
                    }}
                    value={key}
                    secureTextEntry={!showPassword}
                />
                <Text style={styles.passwordToggleButton} onPress={toggleShowPassword}>{passwordText}</Text>
            </View>
            <View>
                <TextField
                    style={styles.inputField}
                    dasdad
                    placeholder={'Confirm Password'}
                    onChangeText={(password: string) => {
                        if (password !== key) {
                            setIsValid(false)
                            return;
                        }

                        setIsValid(true)
                        setSignUpDetails(prev => ({
                            ...prev,
                            encryption_password: password,
                        }))
                    }}
                    secureTextEntry={!showConfirmPassword}
                />
                <Text style={styles.passwordToggleButton} onPress={toggleShowConfirmPassword}>{confirmPasswordText}</Text>
            </View>
            {!isValid &&
                <Text color='red'>
                    Passwords must match
                </Text>}
        </View>
    );
};

const styles = StyleSheet.create({
    title: {
        fontWeight: 'bold',
        fontSize: 30,
        textAlign: 'left',
        marginLeft: 20
    },

    subtext: {
        padding: 20,
        color: 'red',
    },

    floatingPlaceholder: {
        zIndex: 0,
        margin: 20,
        fontSize: 20,
    },

    inputField: {
        padding: 14,
        fontSize: 18,
        height: 50,
        textAlign: 'left',
        backgroundColor: '#f5f5f5',
        borderColor: '#d1d1d1',
        borderWidth: 1,
        borderRadius: 5,
        margin: 10,
    },

    passwordToggleButton: {
        top: 25,
        right: 20,
        position: 'absolute',
        fontSize: 16,
        color: '#435C9C',
    },

    button: {
        padding: 14,
        margin: 20,
        width: '80%',
        justifyContent: 'center',
        alignSelf: 'center',
    },

    signup: {
        justifyContent: 'center',
        alignSelf: 'center',
    },
});
