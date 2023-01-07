import React, {createContext, useState, useContext} from 'react';
import {AuthData, authService} from '../services/authService';
import {useKeypair} from './Keypair';
import Config from 'react-native-config';

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

  const [loading, setLoading] = useState(false);
  const keypair = useKeypair();

  const signIn = async (email: string, password: string) => {
    setLoading(true);
    const _authData = await authService.signIn(email, password);

    if (_authData) {
      keypair.deleteBio();
    }
    setAuthData(_authData);
    setLoading(false);
  };

  const signOut = async () => {
    setAuthData(undefined);
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
