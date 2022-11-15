import React, { useEffect, useState } from 'react';
import HomeScreen from './HomeScreen';
import TransactionHistory from './TransactionHistory';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
const Stack = createNativeStackNavigator();


const Dashboard = () => {
    return (
        <Stack.Navigator>
            <Stack.Screen name="Dashboard" component={HomeScreen} options={{ headerShown: false }} />
            <Stack.Screen name="Balance" component={TransactionHistory} />
        </Stack.Navigator>
    )
};

export default Dashboard;
