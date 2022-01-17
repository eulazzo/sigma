import React, { useEffect, useState } from "react";
import { StyleSheet, FlatList, SafeAreaView } from "react-native";
import { useRoute, useNavigation } from "@react-navigation/core";
import { Message as MessageModel } from "../src/models";
import Message from "../components/Message";
import MessageInput from "../components/MessageInput";
import { DataStore, SortDirection } from "aws-amplify";
import { ChatRoom } from "../src/models";

export default function ChatRoomScreen() {
  const [messages, setMessages] = useState<MessageModel[]>([]);
  const [chatRoom, setChatRoom] = useState<ChatRoom | null>(null);

  const route = useRoute();
  const navigation = useNavigation();

  useEffect(() => {
    fetchChatRoom();
  }, []);

  useEffect(() => {
    fetchMessages();
  }, [chatRoom]);

  useEffect(() => {
    const subscription = DataStore.observe(MessageModel).subscribe((msg) => {
      // console.log(msg.model, msg.opType, msg.element);
      if (msg.model === MessageModel && msg.opType === "INSERT") {
        setMessages((existingMessages) => [msg.element, ...existingMessages]);
      }
    });
    return () => subscription.unsubscribe();
  }, []);

  const fetchMessages = async () => {
    if (!chatRoom) return;
    try {
      const fetchedMessages = await DataStore.query(
        MessageModel,
        (message) => message.chatroomID("eq", chatRoom?.id),
        {
          sort: (message) => message.createdAt(SortDirection.DESCENDING),
        }
      );
      setMessages(fetchedMessages);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchChatRoom = async () => {
    try {
      if (!route.params?.id) {
        console.log("No chatRoom Id provided!");
        return;
      }
      const chatRoom = await DataStore.query(ChatRoom, route.params.id);

      if (!chatRoom) {
        console.error("Couldn't find a chat  room with  this id ");
      } else {
        setChatRoom(chatRoom);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <SafeAreaView style={styles.page}>
      <FlatList
        data={messages}
        renderItem={({ item }) => <Message message={item} />}
        inverted
      />
      <MessageInput chatRoom={chatRoom} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  page: {
    backgroundColor: "white",
    flex: 1,
  },
});
