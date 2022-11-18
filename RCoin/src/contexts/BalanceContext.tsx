import React, {createContext, useContext, useEffect, useState} from 'react';
import {useAuth} from './Auth';
import dayjs, {Dayjs} from 'dayjs';

type BalanceContextData = {
  balance: number;
  loading: boolean;
  time_since_updated_string: string;
  refresh(): void;
};

const BalanceContext = createContext<BalanceContextData>(
  {} as BalanceContextData,
);

const useBalance = () => {
  const context = useContext(BalanceContext);

  if (!context) {
    throw new Error('useBalance must be used within BalanceProvider');
  }

  return context;
};

const BalanceProvider = ({children}: {children: React.ReactNode}) => {
  const [balance, setBalance] = useState(0.0);
  const [loading, setLoading] = useState(false);
  const [time_updated, setTimeUpdated] = useState(dayjs());
  const [time_since_updated_string, setTimeSinceUpdatedString] = useState('');
  const auth = useAuth();

  useEffect(() => {
    refresh();
    // setInterval(() => {
    //   setTimeSinceUpdatedString(getTimeSinceUpdated(time_updated));
    // }, 1000); // Update the time since, every second
  }, []);

  const getTimeSinceUpdated = (time_since: Dayjs) => {
    const secs = Math.floor(dayjs().diff(time_since) / 1000);
    if (secs < 60) {
      // Seconds
      return secs == 1
        ? secs.toString() + ' second ago'
        : secs.toString() + ' seconds ago';
    }

    let mins = Math.floor(secs / 60);
    if (mins < 60) {
      // Minutes
      return mins == 1
        ? mins.toString() + ' minute ago'
        : mins.toString() + ' minutes ago';
    }

    const hrs = Math.floor(mins / 60);
    if (hrs < 24) {
      // Hours
      return hrs == 1
        ? hrs.toString() + ' hour ago'
        : hrs.toString() + ' hours ago';
    }

    const days = Math.floor(hrs / 24);
    // Days
    return days == 1
      ? days.toString() + ' day ago'
      : days.toString() + ' days ago';
  };

  const refresh = async () => {
    if (auth.authData?.token) {
      setLoading(true);
      fetch('http://10.0.2.2:8000/api/get_token_balance', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${auth.authData?.token}`,
        },
      })
        .then(res => res.json())
        .then(data => {
          setBalance(data['token_balance']);
          setLoading(false);
          // (async () => await setTimeUpdated(dayjs()))();
        })
        .catch(error => {
          console.log(error);
        });
    }
  };

  return (
    <BalanceContext.Provider
      value={{balance, loading, time_since_updated_string, refresh}}>
      {children}
    </BalanceContext.Provider>
  );
};

export {BalanceContext, useBalance, BalanceProvider};