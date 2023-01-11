import React, {createContext, useContext, useEffect, useState} from 'react';
import {useAuth} from './Auth';
import dayjs, {Dayjs} from 'dayjs';
import Config from 'react-native-config';

type AuditContextData = {
  rcoin_issued: number;
  rand_in_reserve: number;
  ratio: number;
  loading: boolean;
  time_since_updated_string: string;
  refresh(): void;
};

const AuditContext = createContext<AuditContextData>({} as AuditContextData);

const useAudit = () => {
  const context = useContext(AuditContext);

  if (!context) {
    throw new Error('useAudit must be used within AuditProvider');
  }

  return context;
};

const AuditProvider = ({children}: {children: React.ReactNode}) => {
  const [rcoin_issued, setRCoinIssued] = useState(0.0);
  const [rand_in_reserve, setRandInReserve] = useState(0.0);
  const [ratio, setRatio] = useState(0.0);
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
      fetch(`${Config.API_URL}/api/audit`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${auth.authData?.token}`,
        },
      })
        .then(res => res.json())
        .then(data => {
          setRCoinIssued(data['issued_coins']);
          setRatio(data['rand_per_coin']);
          setRandInReserve(data['rand_in_reserve']);
          setLoading(false);
          // (async () => await setTimeUpdated(dayjs()))();
        })
        .catch(error => {
          console.log(error);
        });
    }
  };

  return (
    <AuditContext.Provider
      value={{
        rcoin_issued,
        rand_in_reserve,
        ratio,
        loading,
        time_since_updated_string,
        refresh,
      }}>
      {children}
    </AuditContext.Provider>
  );
};

export {AuditContext, useAudit, AuditProvider};
