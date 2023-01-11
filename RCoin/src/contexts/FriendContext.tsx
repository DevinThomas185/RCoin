import React, {createContext, useContext, useEffect, useState} from 'react';
import {useAuth} from './Auth';
import dayjs, {Dayjs} from 'dayjs';
import Config from 'react-native-config';

type FriendContextData = {
  friends: any[];
  loading: boolean;
  refresh(): void;
  match_email(email: string): string;
};

const FriendContext = createContext<FriendContextData>({} as FriendContextData);

const useFriends = () => {
  const context = useContext(FriendContext);

  if (!context) {
    throw new Error('useFriends must be used within FriendProvider');
  }

  return context;
};

const FriendProvider = ({children}: {children: React.ReactNode}) => {
  const initArr: any[] = [];
  const [friends, setFriends] = useState<any[]>(initArr);
  const [loading, setLoading] = useState(false);
  const auth = useAuth();

  useEffect(() => {
    refresh();
  }, []);

  const refresh = async () => {
    if (auth.authData?.token) {
      setLoading(true);
      fetch(`${Config.API_URL}/api/get_friends`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${auth.authData?.token}`,
        },
      })
        .then(res => res.json())
        .then(data => {
          setFriends(data['friends']);
          setLoading(false);
        })
        .catch(error => {
          setLoading(false);
          console.log(error);
        });
    }
  };

  const match_email = (email: string) => {
    for (let i in friends) {
      const friend = friends[i];
      if (friend.email == email) {
        return friend.first_name + ' ' + friend.last_name;
      }
    }

    return email;
  };

  return (
    <FriendContext.Provider
      value={{
        friends,
        loading,
        refresh,
        match_email,
      }}>
      {children}
    </FriendContext.Provider>
  );
};

export {FriendContext, useFriends, FriendProvider};
