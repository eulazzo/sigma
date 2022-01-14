import React, { useState, useEffect } from "react";

import {
  Text,
  Image,
  View,
  StyleSheet,
  FlatList,
  Pressable,
} from "react-native";
import ChatRoomItem from "../components/ChatRoomItem";

import chatRoomsData from "../assets/dummy-data/ChatRooms";
import { Auth, DataStore } from "aws-amplify";
import { ChatRoom, ChatRoomUser, Message } from "../src/models";

export default function TabOneScreen() {
  const [chatRooms, setChatRooms] = useState<ChatRoom[]>([]);
   
  const logout = () => Auth.signOut();

  useEffect(() => {
    const fetchChatRooms = async () => {
      const {
        attributes: { sub: AuthenticatedUserId },
      } = await Auth.currentAuthenticatedUser();

      const chatRooms = (await DataStore.query(ChatRoomUser))
        .filter((ChatRoomUser) => ChatRoomUser.user.id === AuthenticatedUserId)
        .map((chatRoomUser) => chatRoomUser.chatRoom);

      setChatRooms(chatRooms);
    };
    fetchChatRooms();
  }, []);


  

  return (
    <View style={styles.page}>
      <FlatList
        data={chatRooms}
        renderItem={({ item }) => <ChatRoomItem chatRoom={item} />}
        showsVerticalScrollIndicator={false}
        keyExtractor={({ item, id }) => `${String(id)}.${Math.random()}`}
      />
      {/* <Pressable onPress={logout} style={styles.logoutContainer}>
        <Text style={styles.logoutText}>Logout</Text>
      </Pressable> */}
    </View>
  );
}

const styles = StyleSheet.create({
  page: {
    backgroundColor: "#fafafa",
    flex: 1,
  },
  logoutContainer: {
    color: "#fff",
    backgroundColor: "blue",
    height: 50,
    margin: 10,
    borderRadius: 50,
    alignItems: "center",
    justifyContent: "center",
  },
  logoutText: {
    color: "#fafafa",
    fontSize: 16,
  },
});
