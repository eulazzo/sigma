import { useNavigation } from "@react-navigation/native";
import React from "react";
import { View, Text, Image, Pressable } from "react-native";
import styles from "./styles";

// import DEFAULT_IMAGE from "../../assets/images/noAvatar.png";
// const noAvatar = Image.resolveAssetSource(DEFAULT_IMAGE).uri;
// import { Auth, DataStore } from "aws-amplify";
// import { ChatRoom, ChatRoomUser, User } from "../../src/models";

const UserItem = ({ user }) => {
  return (
    <Pressable style={styles.container}>
      <Image style={styles.image} source={{ uri: user.imageUri }} />
      <View style={styles.rightContainer}>
        <View style={styles.row}>
          <Text style={styles.name}>{user.name.split("@")[0]}</Text>
        </View>
      </View>
    </Pressable>
  );
};

export default UserItem;
