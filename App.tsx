import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import useCachedResources from './hooks/useCachedResources';
import useColorScheme from './hooks/useColorScheme';
import Navigation from './navigation';
import Auth from './auth';
import { LogBox } from 'react-native';
import {storeObjectData, getObjectData, removeItemValue} from './utils/asyncStorage';
import { USER_KEY } from './constants';

LogBox.ignoreLogs(['Setting a timer for a long period of time']);
LogBox.ignoreLogs(["Seems like you're using an old API with gesture components, check out new Gestures system!"]);
LogBox.ignoreLogs(["AsyncStorage has been extracted from react-native core and will be removed in a future release"]);

export default function App() {
  const isLoadingComplete = useCachedResources();
  const colorScheme = useColorScheme();
  const [loginState, setLoginState] = useState(getObjectData(USER_KEY));

  // useEffect(() => {
  //   const unsubscribe = auth.onAuthStateChanged(function (user: undefined) {
  //     if (user) {        
  //       storeObjectData(user, USER_KEY);
  //       setLoginState(user);
  //     }else{
  //       setLoginState({uid: false});
  //       removeItemValue(USER_KEY);  
  //     }
  //   });
  //   return unsubscribe;
  // }, [])

  if (!isLoadingComplete) {
    return null;
  } else {
    return (
      <SafeAreaProvider>
        {true ? (
          <Navigation colorScheme={colorScheme} />
        )
          :
          <Auth colorScheme={colorScheme} />
        }
        <StatusBar />
      </SafeAreaProvider>
    );
  }
}
