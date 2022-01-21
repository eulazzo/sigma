import React, { useState, useEffect } from "react";
import {
  Alert,
  FlatList,
  Pressable,
  StyleSheet,
  SafeAreaView,
  Text,
  View,
} from "react-native";
import UserItem from "../components/UserItem";
import { Auth, DataStore } from "aws-amplify";
import { ChatRoom, ChatRoomUser, User } from "../src/models";

import NewGroupButton from "../components/NewGroupButton";
import { useNavigation } from "@react-navigation/native";

export default function UsersScreen() {
  const [users, setUsers] = useState<User[]>([]);
  const navigation = useNavigation();
  const [isNewGroup, setIsNewGroup] = useState(false);
  const [selectedUsers, setSelectedUsers] = useState<User[]>([]);

  useEffect(() => {
    DataStore.query(User).then(setUsers);
  }, []);

  const addUserToChatRoom = async (user, chatRoom) => {
    await DataStore.save(
      new ChatRoomUser({
        user,
        chatRoom,
      })
    );
  };

  const createChatRoom = async (users) => {
    //TO_DO if there is already a chatroom between these two users
    //then redirect to the existing chatroom.
    //Otherwise, create a new chatroom with these users.
    //This can be done filtering the ChatRoom with the usersId

    //getting the authenticated user and his dataBase.
    const authUser = await Auth.currentAuthenticatedUser();
    const dbUser = await DataStore.query(User, authUser.attributes.sub);
    
    if (!dbUser || dbUser.length > 1) {
      Alert.alert("Chat room was not possible to create");
      return;
    }
    //create a chat room
    const newChatRoomData = { newMessges: 0, Admin: dbUser };

    if (users.length > 1) {
      console.log("mais de um user")
      newChatRoomData.name = "New group";
      newChatRoomData.imageUri =
        "https://cdn.pixabay.com/photo/2016/11/14/17/39/group-1824145_1280.png";
    }
    const newChatRoom = await DataStore.save(new ChatRoom(newChatRoomData));

     

    // connect authenticated user with the chatRoom
    await addUserToChatRoom(dbUser, newChatRoom);

    // connect users with the chatRoom
    await Promise.all(
      users.map((user) => {
        addUserToChatRoom(user, newChatRoom);
      })
    );

    navigation.navigate("ChatRoom", { id: newChatRoom.id });
  };

  const isUserSelected = (user) => {
    return selectedUsers.some((selectedUser) => selectedUser.id === user.id);
  };

  const onUserPress = async (user) => {
    if (isNewGroup) {
      if (isUserSelected(user)) {
        setSelectedUsers(
          selectedUsers.filter((selectedUser) => selectedUser.id !== user.id)
        );
      } else {
        setSelectedUsers([...selectedUsers, user]);
      }
    } else {
      await createChatRoom([user]);
    }
  };

  const saveGroup = async () => {
    await createChatRoom(selectedUsers);
  };

  return (
    <SafeAreaView style={styles.page}>
      <FlatList
        data={users}
        renderItem={({ item }) => (
          <UserItem
            isSelected={isNewGroup ? isUserSelected(item) : undefined}
            onPress={() => onUserPress(item)}
            user={item}
          />
        )}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={() => (
          <NewGroupButton onPress={() => setIsNewGroup(!isNewGroup)} />
        )}
      />
      {isNewGroup && (
        <Pressable style={styles.button} onPress={saveGroup}>
          <Text style={styles.buttonText}>
            Save group ({selectedUsers.length})
          </Text>
        </Pressable>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  page: {
    backgroundColor: "#fafafa",
    flex: 1,
  },
  button: {
    backgroundColor: "#3777f0",
    marginHorizontal: 10,
    padding: 10,
    alignItems: "center",
    borderRadius: 10,
  },
  buttonText: {
    color: "#fafafa",
    fontWeight: "bold",
    letterSpacing: 0.7,
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
