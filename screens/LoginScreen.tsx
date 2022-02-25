import React from 'react';
import { useState, useEffect } from 'react';
import { Input, Button } from 'react-native-elements';
import { getApps, initializeApp } from "firebase/app";
import { getAuth, signInWithEmailAndPassword,  } from "firebase/auth";
import { StyleSheet } from 'react-native';
import { firebaseConfig } from '../firebase';
import { View } from '../components/Themed';
import { RootTabScreenProps } from '../types';


const LoginScreen = ({ navigation }: RootTabScreenProps<'LoginScreen'>) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const auth = getAuth();

    const signIn = () => {
        signInWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                const user = userCredential.user;
            })
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
            <Button title="Sign in" containerStyle={styles.button} onPress={signIn} />
            <Button title="Register" containerStyle={styles.button} onPress={() => navigation.navigate('Register')} />
        </View>
    )
}

export default LoginScreen

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 10,
    },
    button: {
        width: '100%',
        marginTop: 20
    }
})