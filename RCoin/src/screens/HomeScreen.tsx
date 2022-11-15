import React, { useEffect, useState } from 'react';
import { Text, View, Image, TouchableOpacity } from "react-native-ui-lib";
import { useAuth } from '../contexts/Auth';
import Balance from '../components/Balances/Balance';
import ServiceLink from "../components/ServiceLink"
import style from '../style/style'
import { NavigationScreenProp } from 'react-navigation';

const HomeScreen = ({
  navigation,
}: {
  navigation: NavigationScreenProp<any, any>;
}) => {
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

  const divider = (
    <View style={style.thinDivider} />
  )

  return (
    <View flex>
      <TouchableOpacity onPress={() => navigation.navigate('Balance')}>
        <View margin-30>
          <Text text40>RCoin Balance</Text>
          <Balance confirmation={false} margin-30 />
          <View style={style.divider}>
            <Image
              source={require('../style/Divider.png')}
            />
          </View>
        </View>
      </TouchableOpacity>


      <Text marginH-30 text40 marginB-20 >Services</Text>

      {/* TODO: On press, go to the relevant pages */}
      {divider}
      <TouchableOpacity onPress={() => navigation.navigate('Issue')}>
        <ServiceLink title="Deposit" message={"Make a payment to acquire your RCoin.\nCompleted securely through paystack."} />
      </TouchableOpacity>
      {divider}
      <TouchableOpacity onPress={() => navigation.navigate('Transfer')}>
        <ServiceLink title="Transfer" message={"Send your RCoin to another user.\nYour transfer will be signed on the blockchain."} />
      </TouchableOpacity>
      {divider}
      <TouchableOpacity onPress={() => navigation.navigate('Withdraw')}>
        <ServiceLink title="Withdraw" message={"Withdraw your RCoin as Rand.\nCompleted securely through paystack."} />
      </TouchableOpacity>
      {divider}
    </View>
  );
};

export default HomeScreen;
