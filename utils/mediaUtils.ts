import * as Location from 'expo-location'
import * as ImagePicker from 'expo-image-picker'

import { Alert } from 'react-native'
import { useState } from 'react'

export async function getLocationAsync(onSend) {

    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
        alert('Permission to access location was denied');
        return;
    }
    const location = await Location.getCurrentPositionAsync({})
    if (location) {
        onSend([{ location: location.coords }])
    }
}

export async function pickImageAsync(onSend) {

    let permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (permissionResult.granted === false) {
        alert("Permission to access camera roll is required!");
        return;
    }

    let result = await ImagePicker.launchImageLibraryAsync();

    if (!result.cancelled) {
        onSend([{ image: result.uri }])
        return result.uri
    }
}

export async function takePictureAsync(onSend) {

    let permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (permissionResult.granted === false) {
        alert("Permission to access camera roll is required!");
        return;
    }

    const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [4, 3],
    })

    if (!result.cancelled) {
        onSend([{ image: result.uri }])
        return result.uri
    }
}