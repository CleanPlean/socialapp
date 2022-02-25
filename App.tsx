import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import useCachedResources from './hooks/useCachedResources';
import useColorScheme from './hooks/useColorScheme';
import Navigation from './navigation';
import { getApps, initializeApp } from "firebase/app";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { firebaseConfig } from './firebase';
import { LogBox } from 'react-native';
import Auth from './auth';

LogBox.ignoreLogs(['Setting a timer for a long period of time']);
LogBox.ignoreLogs(["Seems like you're using an old API with gesture components, check out new Gestures system!"]);
LogBox.ignoreLogs(["AsyncStorage has been extracted from react-native core and will be removed in a future release"]);

// Editing this file with fast refresh will reinitialize the app on every refresh, let's not do that
if (!getApps().length) {
  initializeApp(firebaseConfig);
}

export default function App() {
  const isLoadingComplete = useCachedResources();
  const colorScheme = useColorScheme();
  const auth = getAuth();
  const [userLogged, setUserLogged] = useState(false);
  const user = auth.currentUser;

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {      
      if (user) {        
        setUserLogged(true);
      }else{
        setUserLogged(false) 
      }
    });
    return unsubscribe;
  }, [])

  if (!isLoadingComplete) {
    return null;
  } else {
    return (
      <SafeAreaProvider>
        {userLogged || user ? (
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
