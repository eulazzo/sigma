import React, { useEffect, useState } from "react";
import { Text, Image, View, Pressable, ActivityIndicator } from "react-native";
import { useNavigation } from "@react-navigation/core";
import styles from "./styles";
import { User } from "../../src/models";
import { Auth, DataStore } from "aws-amplify";
import { ChatRoomUser } from "../../src/models";

import DEFAULT_IMAGE from "../../assets/images/avatar.png";
const avatar = Image.resolveAssetSource(DEFAULT_IMAGE).uri;

export default function ChatRoomItem({ chatRoom }) {
  // const [users, setUsers] = useState<User[]>([]); //all user in this chatRoom
  const [user, setUser] = useState<User | null>(null); //the display user
  const navigation = useNavigation();

  useEffect(() => {
    const fetchUsers = async () => {
      const {
        attributes: { sub: authUserID },
      } = await Auth.currentAuthenticatedUser();

      const fetchedUsers = (await DataStore.query(ChatRoomUser))
        .filter((chatRoomUser) => chatRoomUser.chatRoom.id === chatRoom.id)
        .map((chatRoomUser) => chatRoomUser.user);

      // setUsers(fetchedUsers);

      //To not show myself on the chat room
      setUser(fetchedUsers.find((user) => user.id !== authUserID) || null);
    };

    fetchUsers();
  }, []);

  const onPress = () => {
    navigation.navigate("ChatRoom", { id: chatRoom.id });
  };

  return (
    <Pressable onPress={onPress} style={styles.container}>
      {user && (
        <>
          <Image
            source={{ uri: user?.imageUri || avatar }}
            style={styles.image}
          />

          {!!chatRoom.newMessges && (
            <View style={styles.badgeContainer}>
              <Text style={styles.badgeText}>{chatRoom.newMessges}</Text>
            </View>
          )}

          <View style={styles.rightContainer}>
            <View style={styles.row}>
              <Text style={styles.name}>{user?.name.split("@")[0]}</Text>
              <Text style={styles.text}>11:21Am</Text>
            </View>
            <Text numberOfLines={1} style={styles.text}>
              ashdashdusahdusahduashd shdusahdu hsud hush
              {/* {chatRoom.lastMessage?.content} */}
            </Text>
          </View>
        </>
      )}
    </Pressable>
  );
}
