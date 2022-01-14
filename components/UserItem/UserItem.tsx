import { useNavigation } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import { View, Text, Image, Pressable, Alert } from "react-native";
import styles from "./style";

import DEFAULT_IMAGE from "../../assets/images/noAvatar.png";
const avatar = Image.resolveAssetSource(DEFAULT_IMAGE).uri;
import { Auth, DataStore } from "aws-amplify";
import { ChatRoom, ChatRoomUser, User } from "../../src/models";

const UserItem = ({ user }) => {
  const navigation = useNavigation();

  console.log(user);

  const onPress = async () => {
    //TO_DO if there is already a chatroom between these two users
    //then redirect to the existing chatroom.
    //Otherwise, create a new chatroom with these users.
    //This can be done filtering the ChatRoom with the usersId

    //create a chat room
    const newChatRoom = await DataStore.save(new ChatRoom({ newMessges: 0 }));

    //getting the authenticated user and his dataBase.
    const authUser = await Auth.currentAuthenticatedUser();
    const dbUser = await DataStore.query(User, authUser.attributes.sub);

    if (!dbUser || dbUser.length > 1) {
      Alert.alert("Chat room was not possible to create");
      return;
    }

    // connect authenticated user with the chatRoom
    await DataStore.save(
      new ChatRoomUser({
        user: dbUser,
        chatRoom: newChatRoom,
      })
    );

    // connect clicked  user with the chatRoom
    await DataStore.save(
      new ChatRoomUser({
        user,
        chatRoom: newChatRoom,
      })
    );
    navigation.navigate("ChatRoom", { id: newChatRoom.id });
  };

  return (
    <Pressable onPress={onPress} style={styles.container}>
      <Image style={styles.image} source={{ uri: user.imageUri || avatar }} />
      <View style={styles.rightContainer}>
        <View style={styles.row}>
          <Text style={styles.name}>{user.name.split("@")[0]}</Text>
        </View>
      </View>
    </Pressable>
  );
};

export default UserItem;
