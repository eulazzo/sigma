import {
  FontAwesome,
  MaterialCommunityIcons,
  MaterialIcons,
} from "@expo/vector-icons";
import React from "react";
import { View, Text, Pressable, StyleSheet, TextInput } from "react-native";

const NewGroupButton = ({ onPress }) => {
 
  return (
    <Pressable onPress={onPress}>
      <View
        style={{
          flexDirection: "row",
          padding: 10,
          margin: 10,
          alignItems: "center",
        }}
      >
        <MaterialIcons name="group-add" size={30} color="#4f4f4f" />
        <Text style={{ marginLeft: 10, fontWeight: "bold" }}>New group</Text>
      </View>
    </Pressable>
  );
};

 

export default NewGroupButton;
