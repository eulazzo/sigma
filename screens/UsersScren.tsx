import React, { useState, useEffect } from "react";
import { FlatList, StyleSheet, View } from "react-native";
import UserItem from "../components/UserItem";

import Users from "../assets/dummy-data/Users";

export default function UsersScreen() {
  return (
    <View style={styles.page}>
      <FlatList
        data={Users} 
        renderItem={({ item }) => <UserItem user={item} />}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
      />
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
