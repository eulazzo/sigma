import {
  FontAwesome,
  Ionicons,
  MaterialCommunityIcons,
} from "@expo/vector-icons";
import { Auth, DataStore } from "aws-amplify";

import DEFAULT_IMAGE from "../assets/images/avatar.png";
const avatar = Image.resolveAssetSource(DEFAULT_IMAGE).uri;

import React, { useEffect, useState } from "react";
import { Image, Text, View } from "react-native";
import { ChatRoomUser } from "../src/models";
import { User } from "../src/models";
import moment from "moment";

const ChatRoomHeader = ({ id, children }) => {
  const [user, setUser] = useState<User | null>(null); //the display user

  useEffect(() => {
    const fetchUsers = async () => {
      if (!id) return;
      const {
        attributes: { sub: authUserID },
      } = await Auth.currentAuthenticatedUser();

      const fetchedUsers = (await DataStore.query(ChatRoomUser))
        .filter((chatRoomUser) => chatRoomUser.chatRoom.id === id)
        .map((chatRoomUser) => chatRoomUser.user)
        .find((user) => user.id !== authUserID);

      setUser(fetchedUsers || null);
    };
    fetchUsers();
  }, []);

  const verify = () => {
    if (!user?.name) return;
    if (user.name.includes("@")) {
      return user.name.split("@")[0];
    } else {
      return user.name;
    }
  };

  const getLastOnlineText = () => {
    if (!user?.lastOnlineAt) return null;
    //if lastOnlineAt is less than 5 minutes ago, show him as online
    const lastOnlineDiffMiliSeconds = moment().diff(moment(user.lastOnlineAt));
    if (lastOnlineDiffMiliSeconds < 5 * 60 * 1000) {
      //less than 5 min
      return "Online";
    } else {
      return `Seen online ${moment(user.lastOnlineAt).fromNow()}`;
    }
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
        source={{ uri: user?.imageUri ? user?.imageUri : avatar }}
      />
      <View style={{ flex: 1, marginLeft: 10 }}>
        <Text
          style={{
            fontSize: 15,
            color: "#fafafa",
            opacity: 0.7,
            fontWeight: "bold",
          }}
        >
          {verify()}
        </Text>
        <Text
          maxFontSizeMultiplier={1}
          // numberOfLines={1}
          style={{ color: "#fafafa", fontSize: 11, opacity: 0.7 }}
        >
          {getLastOnlineText()}
        </Text>
      </View>

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
