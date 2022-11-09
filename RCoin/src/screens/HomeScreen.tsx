import React, {useEffect, useState} from 'react';
import {Text, View} from 'react-native';
import {useAuth} from '../contexts/Auth';

const HomeScreen = () => {
  const [rand_in_reserve, setRandInReserve] = useState(0.0);
  const [issued_coins, setIssuedCoins] = useState(0.0);
  const [ratio, setRatio] = useState(0.0);
  const [token_balance, setTokenBalance] = useState(0.0);
  const [sol_balance, setSolBalance] = useState(0.0);
  const auth = useAuth();

  useEffect(() => {
    fetch('http://10.0.2.2:8000/api/audit', {
      method: 'GET',
      headers: {
        'Content-type': 'application/json',
      },
    })
      .then(res => res.json())
      .then(data => {
        setRandInReserve(data['rand_in_reserve']);
        setIssuedCoins(data['issued_coins']);
        setRatio(data['rand_per_coin']);
      })
      .catch(error => {
        console.log(error);
      });

    fetch('http://10.0.2.2:8000/api/get_token_balance', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${auth.authData?.token}`,
      },
    })
      .then(res => res.json())
      .then(data => {
        setTokenBalance(data['token_balance']);
        setSolBalance(data['sol_balance']);
      })
      .catch(error => {
        console.log(error);
      });
  }, []);

  return (
    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
      <Text>R{rand_in_reserve}</Text>
      <Text>RCoin: {issued_coins}</Text>
      <Text>Ratio: {ratio}</Text>
      <Text>Balance: {token_balance}</Text>
      <Text>SOL Balance: {sol_balance}</Text>
    </View>
  );
};

export default HomeScreen;
