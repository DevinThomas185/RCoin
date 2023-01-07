import React, {createContext, useState, useContext, useEffect} from 'react';
import {AuthData, authService} from '../services/authService';
import {useKeypair} from './Keypair';
import Config from 'react-native-config';
import AsyncStorage from '@react-native-async-storage/async-storage';

type AuthContextData = {
  authData?: AuthData;
  loading: boolean;
  signIn(email: string, password: string): Promise<void>;
  signOut(): void;
  refresh(): void;
};

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

const AuthProvider = ({children}: {children: React.ReactNode}) => {
  const [authData, setAuthData] = useState<AuthData>();

  const [loading, setLoading] = useState(true);
  const keypair = useKeypair();

  useEffect(() => {
    loadLoginSaved();
  }, []);

  async function loadLoginSaved(): Promise<void> {
    try {
      //Try get the data from Async Storage
      const authDataSerialized = await AsyncStorage.getItem('@AuthData');
      if (authDataSerialized) {
        const _authData: AuthData = JSON.parse(authDataSerialized);
        setAuthData(_authData);
      }
    } catch (error) {
    } finally {
      setLoading(false);
    }
  }

  const signIn = async (email: string, password: string) => {
    const _authData = await authService.signIn(email, password);

    AsyncStorage.setItem('@AuthData', JSON.stringify(_authData));

    if (_authData) {
      keypair.deleteBio();
    }
    setAuthData(_authData);
  };

  const signOut = async () => {
    setAuthData(undefined);
    await AsyncStorage.removeItem('@AuthData');
  };

  const refresh = () => {
    fetch(`${Config.API_URL}:8000/api/user`, {
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
    <AuthContext.Provider value={{authData, loading, signIn, signOut, refresh}}>
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
