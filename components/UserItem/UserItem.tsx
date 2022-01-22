import { useNavigation } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import { View, Text, Image, Pressable, Alert } from "react-native";
import styles from "./style";

import DEFAULT_IMAGE from "../../assets/images/noAvatar.png";
import { Feather } from "@expo/vector-icons";
const avatar = Image.resolveAssetSource(DEFAULT_IMAGE).uri;

const UserItem = ({
  user,
  onPress,
  isSelected,
  isAdmin = false,
  onLongPress,
}) => {
  const verify = () => {
    if (!user.name) return;
    if (user?.name.includes("@")) {
      return user?.name.split("@")[0];
    } else {
      return user?.name;
    }
  };

  return (
    <Pressable
      onPress={onPress}
      style={styles.container}
      onLongPress={onLongPress}
    >
      <Image style={styles.image} source={{ uri: user.imageUri || avatar }} />
      <View style={styles.rightContainer}>
        <Text style={styles.name}>{verify()}</Text>
        {isAdmin && <Text>Admin</Text>}
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
