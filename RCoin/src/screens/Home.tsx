import React, { useEffect, useState } from 'react';
import Dashboard from './Dashboard';
import TransactionHistory from './TransactionHistory';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
const Stack = createNativeStackNavigator();


const Home = () => {
    return (
        <Stack.Navigator>
            <Stack.Screen name="Dashboard" component={Dashboard} options={{ headerShown: false }} />
            <Stack.Screen name="Balance" component={TransactionHistory} />
        </Stack.Navigator>
    )
};

export default Home;
