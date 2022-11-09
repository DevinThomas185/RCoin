import React, {createContext, useState, useContext} from 'react';
import {AuthData, authService} from '../services/authService';

type AuthContextData = {
  authData?: AuthData;
  loading: boolean;
  signIn(email: string, password: string): Promise<void>;
  signOut(): void;
};

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

const AuthProvider = ({children}: {children: React.ReactNode}) => {
  const [authData, setAuthData] = useState<AuthData>();

  const [loading, setLoading] = useState(false);

  const signIn = async (email: string, password: string) => {
    setLoading(true);
    const _authData = await authService.signIn(email, password);
    setAuthData(_authData);
    setLoading(false);
  };

  const signOut = async () => {
    setAuthData(undefined);
  };

  return (
    <AuthContext.Provider value={{authData, loading, signIn, signOut}}>
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
