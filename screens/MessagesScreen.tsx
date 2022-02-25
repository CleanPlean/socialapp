import { StyleSheet, KeyboardAvoidingView } from 'react-native';

import EditScreenInfo from '../components/EditScreenInfo';
import { TouchableOpacity } from 'react-native';
import { Text, View } from '../components/Themed';
import { Avatar, Icon } from 'react-native-elements';
import { useState, useLayoutEffect, useCallback, useEffect } from 'react';
import { getAuth } from "firebase/auth";
import { getFirestore, addDoc, collection, getDocs, doc, onSnapshot, orderBy, query } from "firebase/firestore";
import { RootTabScreenProps } from '../types';
import { GiftedChat } from 'react-native-gifted-chat';
import { removeItemValue } from '../utils/asyncStorage';
import { USER_KEY } from '../constants';
import { app } from "../firebase";
import AccessoryBar from '../components/Chat/AccessoryBar';
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
  const [isLoading, setIsLoadingEarlier] = useState<Boolean>(false);
  const [isTyping, setIsTyping] = useState<Boolean>(false);

  const signOut = () => {
    auth.signOut().then(() => {
      // Sign-out successful.
    }).catch((error) => {
      // An error happened.
      alert(error)
    });
  }

  const _renderAccessory = () => (
    <AccessoryBar onSend={onSend} isTyping={setIsTyping(true)} />
  )

  const _onLoadEarlier = () => {
    setIsLoadingEarlier(true);
  };

  const _parsePatterns = (_linkStyle: any) => {
    return [
      {
        pattern: /#(\w+)/,
        style: { textDecorationLine: 'underline', color: 'darkorange' },
        onPress: () => Linking.openURL('http://gifted.chat'),
      },
    ]
  }

  useLayoutEffect(() => {
    const q = query(collection(db, "chats"), orderBy("createdAt", 'desc'));

    const unsuscribe = onSnapshot(q, (querySnapshot) => {
      const messages_from_db: Array<User> = [];
      querySnapshot.forEach((doc) => {
        messages_from_db.push({
          _id: doc.data()._id,
          createdAt: doc.data().createdAt.toDate(),
          text: doc.data().text,
          user: doc.data().user
        })
      })
      setMessages(messages_from_db);

    })

    return unsuscribe;
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
    <View style={{ flex: 1 }}>

      <GiftedChat
        messages={messages}
        showAvatarForEveryMessage={false}
        alwaysShowSend
        isLoadingEarlier={false}
        onSend={messages => onSend(messages)}
        scrollToBottom
        onLongPressAvatar={user => alert(JSON.stringify(user))}
        isTyping={isTyping}
        renderAccessory={Platform.OS === 'web' ? null : _renderAccessory}
        user={{
          _id: auth?.currentUser?.email,
          name: auth?.currentUser?.displayName,
          avatar: auth?.currentUser?.photoURL
        }}
      />
    </View>
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
