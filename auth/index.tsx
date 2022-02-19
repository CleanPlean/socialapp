import React, { useState } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import { ColorSchemeName, Pressable } from 'react-native';

const Stack = createStackNavigator();

export default function Auth({ colorScheme }: { colorScheme: ColorSchemeName }) {
    return (
        <NavigationContainer>
            <Stack.Navigator >
                <Stack.Screen name="Login" component={LoginScreen} />
                <Stack.Screen name="Register" component={RegisterScreen} />
            </Stack.Navigator>
        </NavigationContainer>
    );
}
