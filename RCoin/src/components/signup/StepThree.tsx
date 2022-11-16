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
    return (
        <View>
            <Text center text30>
                Enter a wallet password
            </Text>
            <Text color='red'>
                IT IS VERY IMPORTANT THAT YOU SAVE THIS PASSWORD OR YOU WILL LOSE ACCESS TO YOUR MONEY PERMANENTLY
            </Text>
            <TextField
                style={styles.inputField}
                dasdad
                placeholder={'Password'}
                floatingPlaceholder
                onChangeText={(password: string) => {
                    setKey(password)
                }}
                value={key}
                secureTextEntry
                floatingPlaceholderStyle={{ alignSelf: 'center' }}
            />
            <TextField
                style={styles.inputField}
                dasdad
                placeholder={'Confirm Password'}
                floatingPlaceholder
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
                secureTextEntry
                floatingPlaceholderStyle={{ alignSelf: 'center' }}
            />
            {!isValid &&
                <Text color='red'>
                    Passwords must match
                </Text>}
        </View>
    );
};

const styles = StyleSheet.create({
    inputField: {
        padding: 14,
        fontSize: 18,
        width: '80%',
        justifyContent: 'center',
        alignSelf: 'center',
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
