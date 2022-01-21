import React, { useEffect, useState } from "react";
import { Text, Image, View, Pressable, ActivityIndicator } from "react-native";
import { useNavigation } from "@react-navigation/core";
import styles from "./styles";
import { Message, User } from "../../src/models";
import { Auth, DataStore } from "aws-amplify";
import { ChatRoomUser } from "../../src/models";
import TimeAgo from "react-native-timeago";
import DEFAULT_IMAGE from "../../assets/images/avatar.png";
const avatar = Image.resolveAssetSource(DEFAULT_IMAGE).uri;

export default function ChatRoomItem({ chatRoom }) {
  const [allUsersInGroup, setAllUsersInGroup] = useState<User[]>([]); //all user in this chatRoom
  const [user, setUser] = useState<User | null>(null); //the display user
  const [lastMessage, setLastMessage] = useState<Message | undefined>();
  const navigation = useNavigation();

  useEffect(() => {
    const fetchUsers = async () => {
      const {
        attributes: { sub: authUserID },
      } = await Auth.currentAuthenticatedUser();

      const fetchedUsers = (await DataStore.query(ChatRoomUser))
        .filter((chatRoomUser) => chatRoomUser.chatRoom.id === chatRoom.id)
        .map((chatRoomUser) => chatRoomUser.user);

      setAllUsersInGroup(fetchedUsers);

      //To not show myself on the chat room
      setUser(fetchedUsers.find((user) => user.id !== authUserID) || null);
    };

    fetchUsers();
  }, []);

  useEffect(() => {
    if (!chatRoom.chatRoomLastMessageId) return;

    DataStore.query(Message, chatRoom.chatRoomLastMessageId).then(
      setLastMessage
    );
  }, []);

  const onPress = () => {
    navigation.navigate("ChatRoom", { id: chatRoom.id });
  };

  const isGroup = allUsersInGroup.length > 2;


  const verifySpecialCaracteres = (name) => {
    if (!name) return;
    if (name.includes("@")) {
      return name.split("@")[0];
    } else {
      return name;
    }
  };

  return (
    <Pressable onPress={onPress} style={styles.container}>
      {user && (
        <>
          <Image
            source={{
              uri: chatRoom?.imageUri
                ? chatRoom?.imageUri
                : user?.imageUri
                ? user?.imageUri
                : avatar,
            }}
            style={styles.image}
          />

          {!!chatRoom.newMessges && (
            <View style={styles.badgeContainer}>
              <Text style={styles.badgeText}>{chatRoom.newMessges}</Text>
            </View>
          )}

          <View style={styles.rightContainer}>
            <View style={styles.row}>
              <Text style={styles.name}>
                {isGroup ? chatRoom.name : verifySpecialCaracteres(user?.name)}
              </Text>
              {lastMessage?.createdAt && (
                <Text style={styles.text}>
                  <TimeAgo time={lastMessage.createdAt} />
                </Text>
              )}
            </View>
            <Text numberOfLines={1} style={styles.text}>
              {lastMessage?.content ||
                `Start a conversation ${isGroup ? "on" : "with"} ${
                  isGroup ? chatRoom.name : user?.name
                }`}
            </Text>
          </View>
        </>
      )}
    </Pressable>
  );
}
