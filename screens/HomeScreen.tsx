import * as React from "react";

import { Text, Image, View, StyleSheet, FlatList, Pressable } from "react-native";
import ChatRoomItem from "../components/ChatRoomItem";

import chatRoomsData from "../assets/dummy-data/ChatRooms";
import {Auth} from 'aws-amplify'

export default function TabOneScreen() {
  const logout = () => Auth.signOut();

  return (
    <View style={styles.page}>
      <FlatList
        data={chatRoomsData}
        renderItem={({ item }) => <ChatRoomItem chatRoom={item} />}
        showsVerticalScrollIndicator={false}
      />
      <Pressable onPress={logout} style={styles.logoutContainer}>
        <Text style={styles.logoutText}>Logout</Text>
      </Pressable>
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
