import { StyleSheet } from 'react-native';

import EditScreenInfo from '../components/EditScreenInfo';
import { TouchableOpacity } from 'react-native';
import { Text, View } from '../components/Themed';
import { Avatar, Icon } from 'react-native-elements';
import { useState, useLayoutEffect, useCallback, useEffect } from 'react';
import { auth, db } from '../firebase'
import { RootTabScreenProps } from '../types';
import { GiftedChat } from 'react-native-gifted-chat';
import { removeItemValue } from '../utils/asyncStorage';
import { USER_KEY } from '../constants';

export default function MessagesScreen({ navigation }: RootTabScreenProps<'MessagesScreen'>) {

  const [messages, setMessages] = useState([]);

  const signOut = () => {
    auth.signOut().then(() => {
      // Sign-out successful.
      removeItemValue(USER_KEY);
    }).catch((error) => {
      // An error happened.
      alert(error)
    });
  }

  useLayoutEffect(() => {
    const unsubscribe = db.collection('chats').orderBy('createdAt', 'desc').onSnapshot(snapshot => setMessages(
      snapshot.docs.map(doc => ({
        _id: doc.data()._id,
        createdAt: doc.data().createdAt.toDate(),
        text: doc.data().text,
        user: doc.data().user
      }))
    ))

    return unsubscribe;
  }, [])

  useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: () => (
        <View style={{ marginLeft: 20 }}>
          <Avatar
            rounded
            source={{
              uri: auth?.currentUser?.photoURL,
            }}
          />
        </View>
      ),
      headerRight: () => (
        <TouchableOpacity style={{
          marginRight: 10
        }}
        >
          <Icon type="antdesign" name="logout" size={24} color="black" onPress={signOut} />
        </TouchableOpacity>
      )
    })
  }, [navigation])

  const onSend = useCallback((messages = []) => {
    setMessages(previousMessages => GiftedChat.append(previousMessages, messages))
    const {
      _id,
      createdAt,
      text,
      user,
    } = messages[0]

    db.collection('chats').add({
      _id,
      createdAt,
      text,
      user,
    })
  }, [])

  return (
    <GiftedChat
      messages={messages}
      showAvatarForEveryMessage={true}
      onSend={messages => onSend(messages)}
      user={{
        _id: auth?.currentUser?.email,
        name: auth?.currentUser?.displayName,
        avatar: auth?.currentUser?.photoURL
      }}
    />
  )
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
});
