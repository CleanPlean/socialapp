import { StyleSheet } from 'react-native';

import EditScreenInfo from '../components/EditScreenInfo';
import { TouchableOpacity } from 'react-native';
import { Text, View } from '../components/Themed';
import { Avatar, Icon } from 'react-native-elements';
import { useState, useLayoutEffect, useCallback, useEffect } from 'react';
import { getAuth } from "firebase/auth";
import { getFirestore, addDoc, collection, getDocs, doc, orderBy, query } from "firebase/firestore";
import { RootTabScreenProps } from '../types';
import { GiftedChat } from 'react-native-gifted-chat';
import { removeItemValue } from '../utils/asyncStorage';
import { USER_KEY } from '../constants';
import { app } from "../firebase";

interface User {
  _id: string,
  createdAt: Object,
  text: string,
  user: Object
}

export default function MessagesScreen({ navigation }: RootTabScreenProps<'MessagesScreen'>) {
  const db = getFirestore();
  const [messages, setMessages] = useState<User[]>([]);
  const auth = getAuth();

  const signOut = () => {
    auth.signOut().then(() => {
      // Sign-out successful.
    }).catch((error) => {
      // An error happened.
      alert(error)
    });
  }
  // _id: doc.data()._id,
  // createdAt: doc.data().createdAt.toDate(),
  // text: doc.data().text,
  // user: doc.data().user

  useLayoutEffect(() => {
    const _retreiveMessages = async () => {
      const q = query(collection(db, "chats"), orderBy("createdAt", 'desc'));
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((doc) => {
        // doc.data() is never undefined for query doc snapshots
        console.log(doc.id, " => ", doc.data());
      });
    }

    _retreiveMessages();
  })

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

  const onSend = useCallback(async (messages = []) => {
    setMessages(previousMessages => GiftedChat.append(previousMessages, messages))
    const {
      _id,
      createdAt,
      text,
      user,
    } = messages[0]

    const messageRef = await addDoc(collection(db, "chats"), {
      _id,
      createdAt,
      text,
      user,
    });

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
