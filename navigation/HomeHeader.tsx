import { Feather } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { Image, Pressable, Text, View } from "react-native";
import React, { useEffect, useState } from "react";
import { User } from "../src/models";
import { Auth, DataStore } from "aws-amplify";

import DEFAULT_IMAGE from "../assets/images/authUserAvatar.png";
const authAvatar = Image.resolveAssetSource(DEFAULT_IMAGE).uri;

const HomeHeader = () => {
  const [authUserData, setAuthUserData] = useState<User | undefined>();
  const navigation = useNavigation();

  useEffect(() => {
    const fetchAuthUserData = async () => {
      const {
        attributes: { sub: authUserID },
      } = await Auth.currentAuthenticatedUser();

      const fetchedDataUser = await DataStore.query(User, authUserID);
      setAuthUserData(fetchedDataUser);
    };
    fetchAuthUserData();
  }, []);

 

  return (
    <View
      style={{
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      <Pressable
        onPress={() => navigation.navigate("UserProfileScreen", authUserData)}
      >
        <Image
          style={{
            width: 30,
            height: 30,
            borderRadius: 15,
          }}
          source={{ uri: authUserData?.imageUri || authAvatar }}
        />
      </Pressable>
      <Text
        style={{
          flex: 1,
          textAlign: "center",
          marginLeft: 40,
          fontWeight: "bold",
          fontSize: 15,
        }}
      >
        Sigma
      </Text>

      <View style={{ flexDirection: "row" }}>
        <Feather
          name="camera"
          size={24}
          color="#222"
          style={{ marginHorizontal: 5 }}
        />
        <Pressable onPress={() => navigation.navigate("UsersScreen")}>
          <Feather
            name="edit-2"
            size={24}
            color="#222"
            style={{ marginHorizontal: 10 }}
          />
        </Pressable>
      </View>
    </View>
  );
};

export default HomeHeader;
