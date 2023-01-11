import React, {
  createContext,
  useState,
  useContext,
  useEffect,
  useRef,
} from 'react';
import {AuthData, authService} from '../services/authService';
import {useKeypair} from './Keypair';
import Config from 'react-native-config';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {AppState} from 'react-native';
import ReactNativeBiometrics from 'react-native-biometrics';
const CryptoJS = require('crypto-js');

type AuthContextData = {
  authData?: AuthData;
  authDataLocal?: AuthData;
  loading: boolean;
  signIn(email: string, password: string): Promise<boolean>;
  signOut(): void;
  refresh(): void;
  setPin(pin: string): void;
  pinLogin(pin: string, _authData: AuthData): Promise<boolean>;
  tokenLogin(token: string, _authData: AuthData): Promise<boolean>;
  changePin(): void;
  createBio(): Promise<void>;
};

type Token = {
  token: string;
};

const rnBiometrics = new ReactNativeBiometrics();

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

const AuthProvider = ({children}: {children: React.ReactNode}) => {
  const [authData, setAuthData] = useState<AuthData>();
  const [authDataLocal, setAuthDataLocal] = useState<AuthData>();

  const [loading, setLoading] = useState(true);
  const keypair = useKeypair();

  // Special code start
  useEffect(() => {
    getLocalAuth();
    // Remove auth when app is closed
    const subscription = AppState.addEventListener('change', nextAppState => {
      if (nextAppState === 'inactive' || nextAppState == 'background') {
        setAuthData(undefined);
      }
    });

    return () => {
      subscription.remove();
    };
  }, []);
  // Special code end

  function changePin(): void {
    setAuthDataLocal(undefined);
  }

  const createBio = async () => {
    await rnBiometrics.createKeys();
    const payload = 'password' + authData?.token_info.user_id;
    console.log(payload);

    const {signature} = await rnBiometrics.createSignature({
      promptMessage: 'Sign in',
      payload: payload,
    });

    const encryptedToken: string = CryptoJS.AES.encrypt(
      authData!.token,
      signature,
    ).toString();

    AsyncStorage.setItem('@BioToken', encryptedToken);
  };

  async function getLocalAuth(): Promise<void> {
    const authDataSerialized = await AsyncStorage.getItem('@AuthData');
    try {
      if (authDataSerialized) {
        const _authData: AuthData = JSON.parse(authDataSerialized);
        setAuthDataLocal(_authData);
        fetch(`${Config.API_URL}/api/user`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${_authData.token}`,
          },
        })
          .then(res => {
            if (!res.ok) {
              throw new Error('Fetching user data failed');
            }
            return res.json();
          })
          .then(data_ => {
            const authData = {
              token: _authData.token,
              token_type: _authData.token_type,
              token_info: {
                user_id: data_['user_id'],
                email: data_['email'],
                name: data_['name'],
                trust_score: data_['trust_score'],
                suspended: data_['suspended'],
                wallet_id: data_['walled_id'],
                is_merchant: data_['is_merchant'],
              },
            };

            setAuthData(authData);
          })
          .catch(error => {
            console.log(error);
          });
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }

  async function pinLogin(pin: string, _authData: AuthData): Promise<boolean> {
    try {
      var _tokenObj: Token;
      try {
        _tokenObj = JSON.parse(
          CryptoJS.AES.decrypt(_authData.token, pin).toString(
            CryptoJS.enc.Utf8,
          ),
        );

        // Wrong password
      } catch (error) {
        return false;
      }

      fetch(`${Config.API_URL}/api/user`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${_tokenObj.token}`,
        },
      })
        .then(res => {
          if (!res.ok) {
            throw new Error(
              'Fetching user data failed - Auth token may be invalid',
            );
          }
          return res.json();
        })
        .then(data_ => {
          const authData = {
            token: _tokenObj.token,
            token_type: _authData.token_type,
            token_info: {
              user_id: data_['user_id'],
              email: data_['email'],
              name: data_['name'],
              trust_score: data_['trust_score'],
              suspended: data_['suspended'],
              wallet_id: data_['walled_id'],
              is_merchant: data_['is_merchant'],
            },
          };
          setAuthData(authData);
        })
        .catch(error => {
          console.log(error);
        });
    } catch (error) {}

    return true;
  }

  async function tokenLogin(
    token: string,
    _authData: AuthData,
  ): Promise<boolean> {
    try {
      //Try get the data from Async Storage
      console.log(_authData);

      fetch(`${Config.API_URL}/api/user`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      })
        .then(res => {
          if (!res.ok) {
            throw new Error(
              'Fetching user data failed - Auth token may be invalid',
            );
          }
          return res.json();
        })
        .then(data_ => {
          const authData = {
            token: token,
            token_type: _authData.token_type,
            token_info: {
              user_id: data_['user_id'],
              email: data_['email'],
              name: data_['name'],
              trust_score: data_['trust_score'],
              suspended: data_['suspended'],
              wallet_id: data_['walled_id'],
              is_merchant: data_['is_merchant'],
            },
          };
          setAuthData(authData);
        })
        .catch(error => {
          console.log(error);
        });
    } catch (error) {}

    return true;
  }

  const setPin = (pin: string) => {
    const _authDataEncrypted = Object.assign({}, authData);
    console.log('Token', authData!.token);
    const tokenObj: Token = {token: authData!.token};
    const key = CryptoJS.AES.encrypt(JSON.stringify(tokenObj), pin).toString();
    _authDataEncrypted.token = key;
    AsyncStorage.setItem('@AuthData', JSON.stringify(_authDataEncrypted));
    setAuthDataLocal(_authDataEncrypted);
  };

  const signIn = async (email: string, password: string) => {
    const _authData = await authService.signIn(email, password);

    if (!_authData) {
      return false;
    }
    setAuthData(_authData);
    return true;
  };

  const signOut = async () => {
    setAuthData(undefined);
    setAuthDataLocal(undefined);
    keypair.deleteBio();
    await rnBiometrics.deleteKeys();
    await AsyncStorage.removeItem('@AuthData');
    await AsyncStorage.removeItem('@BioToken');
  };

  const refresh = () => {
    fetch(`${Config.API_URL}/api/user`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${authData?.token}`,
      },
    })
      .then(res => {
        if (!res.ok) {
          throw new Error('Fetching user data failed');
        }
        return res.json();
      })
      .then(data_ => {
        if (authData) {
          setAuthData({
            token: authData.token,
            token_type: authData.token_type,
            token_info: {
              user_id: data_['user_id'],
              email: data_['email'],
              name: data_['name'],
              trust_score: data_['trust_score'],
              suspended: data_['suspended'],
              wallet_id: data_['walled_id'],
              is_merchant: data_['is_merchant'],
            },
          });
        }
      })
      .catch(error => {
        console.log(error);
        setAuthData(undefined);
      });
  };

  return (
    <AuthContext.Provider
      value={{
        authData,
        authDataLocal,
        loading,
        signIn,
        signOut,
        refresh,
        setPin,
        pinLogin,
        tokenLogin,
        changePin,
        createBio,
      }}>
      {children}
    </AuthContext.Provider>
  );
};

const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }

  return context;
};

export {AuthContext, AuthProvider, useAuth};
