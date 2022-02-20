import { useEffect, useState } from 'react';
import { StyleSheet, ActivityIndicator, Share, Image, StatusBar } from 'react-native';
import { Button } from 'react-native-elements';
import { Text, View } from '../components/Themed';
import { RootTabScreenProps } from '../types';
import * as ImagePicker from "expo-image-picker";
import { getApps, initializeApp } from "firebase/app";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { firebaseConfig } from '../firebase';
import uuid from "uuid";
import * as Clipboard from "expo-clipboard";

// Editing this file with fast refresh will reinitialize the app on every refresh, let's not do that
if (!getApps().length) {
  initializeApp(firebaseConfig);
}

export default function PostScreen({ navigation }: RootTabScreenProps<'PostScreen'>) {
    const [state, setState] = useState({
        image: '',
        uploading: false,
    });

    useEffect(() => {
        async function requestPermission(){
            if (Platform.OS !== "web") {
                const {
                    status,
                } = await ImagePicker.requestMediaLibraryPermissionsAsync();         
                                
                if (status !== "granted") {
                    // alert("Sorry, we need camera roll permissions to make this work!");
                }
            }
        }

        requestPermission()
    })

    const _maybeRenderUploadingOverlay = () => {
        if (state.uploading) {
            return (
                <View
                    style={styles.absoluteFill}
                >
                    <ActivityIndicator color="#fff" animating size="large" />
                </View>
            );
        }
    };

    const _maybeRenderImage = () => {
        let { image } = state;
        if (!image) {
            return;
        }

        return (
            <View
                style={{
                    marginTop: 30,
                    width: 250,
                    borderRadius: 3,
                    elevation: 2,
                }}
            >
                <View
                    style={{
                        borderTopRightRadius: 3,
                        borderTopLeftRadius: 3,
                        shadowColor: "rgba(0,0,0,1)",
                        shadowOpacity: 0.2,
                        shadowOffset: { width: 4, height: 4 },
                        shadowRadius: 5,
                        overflow: "hidden",
                    }}
                >
                    <Image source={{ uri: image }} style={{ width: 250, height: 250 }} />
                </View>
                <Text
                    onPress={_copyToClipboard}
                    onLongPress={_share}
                    style={{ paddingVertical: 10, paddingHorizontal: 10 }}
                >
                    {image}
                </Text>
            </View>
        );
    };

    const _share = () => {
        Share.share({
            message: state.image,
            title: "Check out this photo",
            url: state.image,
        });
    };

    const _copyToClipboard = () => {
        Clipboard.setString(state.image);
        alert("Copied image URL to clipboard");
    };

    const _takePhoto = async () => {
        let pickerResult = await ImagePicker.launchCameraAsync({
            allowsEditing: true,
            aspect: [4, 3],
        });

        _handleImagePicked(pickerResult);
    };

    const _pickImage = async () => {
        let pickerResult = await ImagePicker.launchImageLibraryAsync({
            allowsEditing: true,
            aspect: [4, 3],
        });

        console.log({ pickerResult });

        _handleImagePicked(pickerResult);
    };

    const _handleImagePicked = async (pickerResult) => {
        try {
            setState({ uploading: true });

            if (!pickerResult.cancelled) {
                const uploadUrl = await uploadImageAsync(pickerResult.uri);
                setState({ image: uploadUrl });
            }
        } catch (e) {
            console.log(e);
            alert("Upload failed, sorry :(");
        } finally {
            setState({ uploading: false });
        }
    };



    async function uploadImageAsync(uri) {
        // Why are we using XMLHttpRequest? See:
        // https://github.com/expo/expo/issues/2402#issuecomment-443726662
        const blob = await new Promise((resolve, reject) => {
            const xhr = new XMLHttpRequest();
            xhr.onload = function () {
                resolve(xhr.response);
            };
            xhr.onerror = function (e) {
                console.log(e);
                reject(new TypeError("Network request failed"));
            };
            xhr.responseType = "blob";
            xhr.open("GET", uri, true);
            xhr.send(null);
        });

        const fileRef = ref(getStorage(), uuid.v4());
        const result = await uploadBytes(fileRef, blob);

        // We're done with the blob, close and release it
        blob.close();

        return await getDownloadURL(fileRef);
    }


    return (

        <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
            {!!state.image && (
                <Text
                    style={{
                        fontSize: 20,
                        marginBottom: 20,
                        textAlign: "center",
                        marginHorizontal: 15,
                    }}
                >
                    Example: Upload ImagePicker result
                </Text>
            )}

            <Button
                onPress={_pickImage}
                title="Pick an image from camera roll"
            />

            <Button onPress={_takePhoto} title="Take a photo" />

            {_maybeRenderImage()}
            {_maybeRenderUploadingOverlay()}

            <StatusBar barStyle="default" />
        </View>
    );

}



const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    separator: {
        marginVertical: 30,
        height: 1,
        width: '80%',
    },
    absoluteFill: {
        backgroundColor: "rgba(0,0,0,0.4)",
        alignItems: "center",
        justifyContent: "center",
    }
});
