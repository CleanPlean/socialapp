import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { auth } from './firebase';

import useCachedResources from './hooks/useCachedResources';
import useColorScheme from './hooks/useColorScheme';
import Navigation from './navigation';
import Auth from './auth';
import { LogBox } from 'react-native';

LogBox.ignoreLogs(['Setting a timer for a long period of time']);

export default function App() {
  const isLoadingComplete = useCachedResources();
  const colorScheme = useColorScheme();
  const [loginState, setLoginState] = useState(false);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(function (user: undefined) {
      if (user) {
        setLoginState(user);
      }
    });
    return unsubscribe;
  }, [])

  if (!isLoadingComplete) {
    return null;
  } else {
    return (
      <SafeAreaProvider>
        {loginState ? (
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
