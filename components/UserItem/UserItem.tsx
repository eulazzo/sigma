import { useNavigation } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import { View, Text, Image, Pressable, Alert } from "react-native";
import styles from "./style";

import DEFAULT_IMAGE from "../../assets/images/noAvatar.png";
import { Feather } from "@expo/vector-icons";
const avatar = Image.resolveAssetSource(DEFAULT_IMAGE).uri;

const UserItem = ({ user, onPress, isSelected }) => {
  console.log("oi", isSelected);

  const verify = () => {
    if (!user.name) return;
    if (user?.name.includes("@")) {
      return user?.name.split("@")[0];
    } else {
      return user?.name;
    }
  };

  return (
    <Pressable onPress={onPress} style={styles.container}>
      <Image style={styles.image} source={{ uri: user.imageUri || avatar }} />
      <View style={styles.rightContainer}>
        <View style={styles.row}>
          <Text style={styles.name}>{verify()}</Text>
        </View>
      </View>
      {isSelected !== undefined && (
        <Feather
          name={isSelected ? "check-circle" : "circle"}
          size={23}
          color={"#4f4f4f"}
        />
      )}
    </Pressable>
  );
};

export default UserItem;
