import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TextInput,
  Pressable,
} from "react-native";
import { SimpleLineIcons } from "@expo/vector-icons";
import { Auth, DataStore } from "aws-amplify";
import { ChatRoomUser, User } from "../src/models";
import { useRoute } from "@react-navigation/native";
import Users from "../assets/dummy-data/Users";

import DEFAULT_IMAGE from "../assets/images/authUserAvatar.png";
const authAvatar = Image.resolveAssetSource(DEFAULT_IMAGE).uri;

export const UserProfileScreen = () => {
  const [user, setUser] = useState<User | null>(null); //the display user
  const [name, setName] = useState("");

  const logout = () => Auth.signOut();

  useEffect(() => {
    const fetchUsers = async () => {
      const {
        attributes: { sub: authUserID },
      } = await Auth.currentAuthenticatedUser();

      const authUserData = (await DataStore.query(User)).find(
        (user) => user.id === authUserID
      );

      setUser(authUserData || null);
    };
    fetchUsers();
  }, []);

  const saveTheName = async () => {
    try {
      await DataStore.save(
        User.copyOf(user, (updated) => {
          updated.name = name;
        })
      );
    } catch (error) {
      console.log("Error", error);
    }
  };

  return (
    <View>
      <View style={styles.wrapper}>
        <Image
          style={styles.image}
          source={{ uri: user?.imageUri || authAvatar }}
        />
        <View style={styles.icon}>
          <SimpleLineIcons name="camera" size={25} color="#000" />
        </View>
        <Text style={styles.text}>{user?.name.split("@")[0]}</Text>
      </View>

      <View style={styles.inputContainer}>
        <Text style={{ flex: 1, fontSize: 16, opacity: 0.7 }}>Name</Text>
        <TextInput
          placeholder={"New Nickname"}
          value={name}
          style={{ color: "grey" }}
          onChangeText={setName}
        />
      </View>

      <View style={styles.saveOrLeaveContainer}>
        <Text onPress={saveTheName} style={styles.logoutText}>
          Save
        </Text>
        <View style={styles.logoutButton}>
          <SimpleLineIcons name="logout" size={25} color="#fafafa" />
          <Text
            onPress={logout}
            style={{ fontSize: 16, color: "#fafafa", marginLeft: 5 }}
          >
            Logout
          </Text>
        </View>
      </View>
    </View>
  );
};

export default UserProfileScreen;

const styles = StyleSheet.create({
  image: {
    width: 150,
    height: 150,
    borderRadius: 75,
  },
  wrapper: {
    alignItems: "center",
    padding: 30,
  },
  text: {
    fontSize: 20,
    color: "gray",
  },
  icon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#fafafa",
    alignItems: "center",
    justifyContent: "center",
    position: "absolute",
    top: 130,
    right: 125,
  },
  inputContainer: {
    flexDirection: "row",
    paddingHorizontal: 20,
    borderWidth: 1,
    borderColor: "lightgrey",
    padding: 15,
    backgroundColor: "#fafafa",
  },
  saveOrLeaveContainer: {
    marginTop: 15,
    marginHorizontal: 15,
    flexDirection: "row",
    margin: 5,
  },
  logoutText: {
    fontSize: 16,
    backgroundColor: "#3777f0",
    flex: 3,
    textAlign: "center",
    color: "#fafafa",
    padding: 10,
    borderRadius: 10,
    marginRight: 5,
  },
  logoutButton: {
    flexDirection: "row",
    backgroundColor: "#3777f0",
    alignItems: "center",
    textAlign: "center",
    padding: 10,
    borderRadius: 10,
  },
});
