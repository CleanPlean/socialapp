import React from 'react';
import { useState, useEffect } from 'react';
import { Input, Button } from 'react-native-elements';
import { auth } from '../firebase';
import { View, Text, StyleSheet } from 'react-native';

const LoginScreen = ({ navigation }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    // useEffect(() => {
    //     const unsubscribe = auth.onAuthStateChanged(function (user) {
    //         if (user) {
    //             navigation.replace('Chat');
    //         } else {
    //             // No user is signed in.
    //             navigation.canGoBack() && navigation.popToTop();
    //         }
    //     });
    //     return unsubscribe;
    // }, [])

    const signIn = () => {
        auth.signInWithEmailAndPassword(email, password)
            .catch((error) => {
                var errorMessage = error.message;
                alert(errorMessage)
            });
    }

    return (
        <View style={styles.container}>
            <Input
                placeholder='Enter your email'
                label='Email'
                leftIcon={{ type: 'material', name: 'email' }}
                value={email}
                onChangeText={text => setEmail(text)}
            />
            <Input
                placeholder='Enter your password'
                label='Password'
                leftIcon={{ type: 'material', name: 'lock' }}
                value={password}
                onChangeText={text => setPassword(text)}
                secureTextEntry
            />
            <Button title="sign in" containerStyle={styles.button} onPress={signIn} />
            <Button title="register" containerStyle={styles.button} onPress={() => navigation.navigate('Register')} />
        </View>
    )
}

export default LoginScreen

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        padding: 10
    },
    button: {
        width: '100%',
        marginTop: 20
    }
})