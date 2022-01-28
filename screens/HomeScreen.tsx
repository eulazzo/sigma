import React, { useState, useEffect } from "react";

import { View, StyleSheet, FlatList, Text } from "react-native";
import ChatRoomItem from "../components/ChatRoomItem";

import { Auth, DataStore } from "aws-amplify";
import { ChatRoom, ChatRoomUser, Message } from "../src/models";

export default function TabOneScreen() {
  const [chatRooms, setChatRooms] = useState<ChatRoom[]>([]);

   

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
      {chatRooms ? (
        <FlatList
          data={chatRooms}
          renderItem={({ item }) => <ChatRoomItem chatRoom={item} />}
          showsVerticalScrollIndicator={false}
          keyExtractor={({ item, id }) => `${String(id)}.${Math.random()}`}
        />
      ) : (
        <Text style={{ color: "grey", fontSize: 20, letterSpacing: 0.3 }}>
          Start a conversation
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  page: {
    backgroundColor: "#fafafa",
    flex: 1,
  },
});
