import { useRoute } from "@react-navigation/native";
import { Auth, DataStore } from "aws-amplify";
import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, FlatList, Image, Alert } from "react-native";
import UserItem from "../../components/UserItem";

import { ChatRoom, ChatRoomUser, User } from "../../src/models";

const GroupInfoScreen = () => {
  const [chatRoomDataInfo, setChatRoomDataInfo] = useState<ChatRoom | null>(
    null
  );
  const [allUsersInGroup, setAllUsersInGroup] = useState<User[]>([]);
  const {
    params: { id },
  } = useRoute();

  const fetchUsers = async () => {
    try {
      const fetchedUsers = (await DataStore.query(ChatRoomUser))
        .filter((chatRoomUser) => chatRoomUser.chatRoom.id === id)
        .map((chatRoomUser) => chatRoomUser.user);
      setAllUsersInGroup(fetchedUsers);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchUsers();
    fetchChatRoom();
  }, []);

  const fetchChatRoom = async () => {
    try {
      if (!id) {
        console.log("No chatRoom Id provided!");
        return;
      }
      const chatRoom = await DataStore.query(ChatRoom, id);

      if (!chatRoom) {
        console.error("Couldn't find a chat  room with  this id ");
      } else {
        setChatRoomDataInfo(chatRoom);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const confirmDelete = async (user) => {
    //check if the user is admin of the group
    const {
      attributes: { sub: authUserID },
    } = await Auth.currentAuthenticatedUser();

    if (chatRoomDataInfo?.Admin?.id !== authUserID) {
      if (user.id === chatRoomDataInfo?.Admin?.id) {
        Alert.alert("Only admin can remove users of the group!");
        return;
      }
    }

    if (user.id === chatRoomDataInfo?.Admin?.id) {
      Alert.alert("You are the admin, you cannot delete yourself");
      return;
    }
    Alert.alert(
      "This action require your confirmation",
      `Are you sure you want to remove ${user.name
        .split("@")[0]
        .toUpperCase()} from the group`,
      [
        {
          text: "Delete",
          onPress: () => deleteUser(user),
          style: "destructive",
        },
        {
          text: "Cancel",
          style: "cancel",
        },
      ]
    );
  };

  const deleteUser = async (user) => {
    const chatRoomUserToDelete = (await DataStore.query(ChatRoomUser)).filter(
      (chatRoomUser) =>
        chatRoomUser.chatRoom.id === chatRoomDataInfo?.id &&
        chatRoomUser.user.id === user.id
    );
    if (chatRoomUserToDelete.length) {
      await DataStore.delete(chatRoomUserToDelete[0]);
      setAllUsersInGroup(
        allUsersInGroup.filter((userInGroup) => userInGroup.id !== user.id)
      );
    }
  };

  return (
    <View style={styles.root}>
      <View>
        <Image
          source={{ uri: chatRoomDataInfo?.imageUri }}
          style={{ width: "100%", height: 100 }}
        />
      </View>
      <Text style={styles.title}>{chatRoomDataInfo?.name}</Text>
      <Text style={{ marginLeft: 15, fontSize: 16, fontWeight: "bold" }}>
        Users ({allUsersInGroup?.length})
      </Text>

      <FlatList
        data={allUsersInGroup}
        renderItem={({ item }) => (
          <UserItem
            user={item}
            isSelected={undefined}
            onPress={null}
            isAdmin={chatRoomDataInfo?.Admin?.id === item.id}
            onLongPress={() => confirmDelete(item)}
          />
        )}
      />
    </View>
  );
};

export default GroupInfoScreen;

const styles = StyleSheet.create({
  root: {
    backgroundColor: "#fafafa",
    padding: 10,
    flex: 1,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
    paddingVertical: 10,
  },
});
