import AsyncStorage from '@react-native-async-storage/async-storage';

export const storeObjectData = async (value: Object, key: string) => {
    try {
        const jsonValue = JSON.stringify(value)
        await AsyncStorage.setItem(key, jsonValue)
    } catch (e) {
        alert('Error during storing Data')
    }
}
export const storeData = async (value: string, key: string) => {
    try {
        await AsyncStorage.setItem(key, value)
    } catch (e) {
        alert('Error during storing Data')
    }
}

export const getData = async (key: string) => {
    try {
        const value = await AsyncStorage.getItem(key)
        if (value !== null) {
            return value;
        }
    } catch (e) {
        alert('Error during getting Data')
    }
}

export const getObjectData = async (key: string) => {
    try {
        const jsonValue = await AsyncStorage.getItem(key)
        return jsonValue != null ? await JSON.parse(jsonValue) : null;
      } catch(e) {
        alert('Error during getting Data')
      }
}

export const removeItemValue = async (key: string) => {
    try {
        await AsyncStorage.removeItem(key);
        return true;
    }
    catch(exception) {
        return false;
    }
}