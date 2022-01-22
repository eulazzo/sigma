import {
  FontAwesome,
  Ionicons,
  MaterialCommunityIcons,
} from "@expo/vector-icons";
import { Auth, DataStore } from "aws-amplify";

import DEFAULT_IMAGE from "../assets/images/avatar.png";
const avatar = Image.resolveAssetSource(DEFAULT_IMAGE).uri;

import React, { useEffect, useState } from "react";
import { Image, Pressable, Text, View } from "react-native";
import { ChatRoom, ChatRoomUser } from "../src/models";
import { User } from "../src/models";
import moment from "moment";
import { useNavigation } from "@react-navigation/native";

const ChatRoomHeader = ({ id, children }) => {

  const [user, setUser] = useState<User | null>(null); //the display user
  const [allUsersInGroup, setAllUsersInGroup] = useState<User[]>([]);
  const [chatRoom, setChatRoom] = useState<ChatRoom | undefined>(undefined);
  const navigation = useNavigation();

  const fetchUsers = async () => {
    const {
      attributes: { sub: authUserID },
    } = await Auth.currentAuthenticatedUser();

    const fetchedUsers = (await DataStore.query(ChatRoomUser))
      .filter((chatRoomUser) => chatRoomUser.chatRoom.id === id)
      .map((chatRoomUser) => chatRoomUser.user);

    setAllUsersInGroup(fetchedUsers);
    setUser(fetchedUsers.find((user) => user.id !== authUserID) || null);
  };

  const fetchChatRoom = async () => {
    DataStore.query(ChatRoom, id).then(setChatRoom);
  };

  useEffect(() => {
    if (!id) return;
    fetchUsers();
    fetchChatRoom();
  }, []);

  const verifySpecialCaracteres = (name) => {
    if (!name) return;
    if (name.includes("@")) {
      return name.split("@")[0];
    } else {
      return name;
    }
  };

  const getLastOnlineText = () => {
    if (!user?.lastOnlineAt) return null;
    console.log("passei aki")
    //if lastOnlineAt is less than 5 minutes ago, show him as online
    const lastOnlineDiffMiliSeconds = moment().diff(moment(user.lastOnlineAt));
    if (lastOnlineDiffMiliSeconds < 5 * 60 * 1000) {
      //less than 5 min
      return "Online";
    } else {
      return `Seen online ${moment(user.lastOnlineAt).fromNow()}`;
    }
  };

  const isGroup = allUsersInGroup.length > 2;

  const getUsersName = () => {
    return allUsersInGroup
      .map((user) => verifySpecialCaracteres(user.name))
      .join(", ");
  };

  const openInfo = () => {
    //redirect to groupInfo
    navigation.navigate("GroupInfo",{id});
  };

  return (
    <View
      style={{
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginLeft: -25,
      }}
    >
      <Image
        style={{
          width: 32,
          height: 32,
          borderRadius: 16,
        }}
        source={{
          uri: chatRoom?.imageUri
            ? chatRoom?.imageUri
            : user?.imageUri
            ? user?.imageUri
            : avatar,
        }}
      />
      <Pressable onPress={openInfo} style={{ flex: 1, marginLeft: 10 }}>
        <Text
          style={{
            fontSize: 15,
            color: "#fafafa",
            opacity: 0.7,
            fontWeight: "bold",
          }}
        >
          {chatRoom?.name || user?.name}
        </Text>
        <Text
          maxFontSizeMultiplier={1}
          numberOfLines={1}
          style={{ color: "#fafafa", fontSize: 11, opacity: 0.7 }}
        >
          {isGroup ? getUsersName() : getLastOnlineText()}
        </Text>
      </Pressable>

      <View
        style={{
          flexDirection: "row",
          backgroundColor: "#2c6bed",
          alignItems: "center",
        }}
      >
        <FontAwesome
          name="video-camera"
          size={24}
          color="#fafafa"
          style={{ opacity: 0.7, marginRight: 15 }}
        />

        <Ionicons
          name="ios-call"
          size={24}
          color="#fafafa"
          style={{ opacity: 0.7, marginRight: 10 }}
        />
        <MaterialCommunityIcons
          name="dots-vertical"
          size={24}
          color="#fafafa"
          style={{ opacity: 0.7 }}
        />
      </View>
    </View>
  );
};

export default ChatRoomHeader;
