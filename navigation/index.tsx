import {
  NavigationContainer,
  DefaultTheme,
  DarkTheme,
  useNavigation,
} from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import * as React from "react";
import {
  ColorSchemeName,
  View,
  Text,
  Image,
  StyleSheet,
  Pressable,
} from "react-native";
import {
  Feather,
  FontAwesome,
  Ionicons,
  MaterialCommunityIcons,
} from "@expo/vector-icons";

import { RootStackParamList } from "../types";
import LinkingConfiguration from "./LinkingConfiguration";

import ChatRoomScreen from "../screens/ChatRoomScreen";
import HomeScreen from "../screens/HomeScreen";
import UsersScreen from "../screens/UsersScren";
import UserProfileScreen from "../screens/UserProfileScreen";
import ChatRoomHeader from "./ChatRoomHeader";
import HomeHeader from "./HomeHeader";
import GroupInfoScreen from "../screens/GroupInfoScreen";
export default function Navigation({
  colorScheme,
}: {
  colorScheme: ColorSchemeName;
}) {
  return (
    <NavigationContainer
      linking={LinkingConfiguration}
      theme={colorScheme === "dark" ? DarkTheme : DefaultTheme}
    >
      <RootNavigator />
    </NavigationContainer>
  );
}

const Stack = createStackNavigator<RootStackParamList>();

function RootNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Home"
        component={HomeScreen}
        options={{
          headerTitle: (props) => <HomeHeader />,
        }}
      />
      <Stack.Screen
        name="ChatRoom"
        component={ChatRoomScreen}
        options={({ route }) => ({
          headerBackTitleVisible: false,
          headerStyle: styles.header,
          headerTitle: (props) => (
            <ChatRoomHeader {...props} id={route.params?.id} />
          ),
        })}
      />

      <Stack.Screen
        name="GroupInfo"
        component={GroupInfoScreen}
        options={{
          headerTitleAlign: "center",
          title: "Group Info",
          headerTintColor: "#222",
          headerTitleStyle: {
            fontWeight: "bold",
            fontSize: 15,
          },
        }}
      />
      <Stack.Screen
        name="UsersScreen"
        component={UsersScreen}
        options={{
          headerTitleAlign: "center",
          title: "Users",
          headerTintColor: "#222",
          headerTitleStyle: {
            fontWeight: "bold",
            fontSize: 15,
          },
        }}
      />
      <Stack.Screen
        name="UserProfileScreen"
        component={UserProfileScreen}
        options={{
          headerTitleAlign: "center",
          title: "Profile",
          headerTintColor: "#222",
          headerTitleStyle: {
            fontWeight: "bold",
            fontSize: 15,
          },
        }}
      />
    </Stack.Navigator>
  );
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: "#2c6bed",
  },
});
