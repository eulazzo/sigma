/**
 * If you are not familiar with React Navigation, check out the "Fundamentals" guide:
 * https://reactnavigation.org/docs/getting-started
 *
 */
import { NavigationContainer, DefaultTheme, DarkTheme, useNavigation } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import * as React from 'react';
import { ColorSchemeName, View, Text, Image, useWindowDimensions, StyleSheet, Pressable } from 'react-native';
import { Feather, FontAwesome, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons'; 

import NotFoundScreen from '../screens/NotFoundScreen';
import { RootStackParamList } from '../types';
import LinkingConfiguration from './LinkingConfiguration';

import ChatRoomScreen from '../screens/ChatRoomScreen';
import HomeScreen from '../screens/HomeScreen';


export default function Navigation({ colorScheme }: { colorScheme: ColorSchemeName }) {
  return (
    <NavigationContainer
      linking={LinkingConfiguration}
      theme={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <RootNavigator />
    </NavigationContainer>
  );
}

// A root stack navigator is often used for displaying modals on top of all other content
// Read more here: https://reactnavigation.org/docs/modal
const Stack = createStackNavigator<RootStackParamList>();


function RootNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Home"
        component={HomeScreen}
        options={{
          headerTitle: (props) => <HomeHeader {...props} />,
        }}
      />
      <Stack.Screen
        name="ChatRoom"
        component={ChatRoomScreen}
        options={{
          headerBackTitleVisible: false,
          headerStyle: styles.header,
          headerTitle: ChatRoomHeader,
        }}
      />
       
       
    </Stack.Navigator>
  );
}


const HomeHeader = (props) => {
  const navigation = useNavigation();

  return (
    <View
      style={{
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      <Image
        style={{
          width: 30,
          height: 30,
          borderRadius: 15,
        }}
        source={{ uri: "https://thispersondoesnotexist.com/image" }}
      />
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

      <View style={{ flexDirection: "row", marginRight: 10 }}>
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

const ChatRoomHeader = (props) => {
 

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
        source={{ uri: "https://thispersondoesnotexist.com/image" }}
      />
      <Text
        style={{
          fontSize: 17,
          color: "#fafafa",
          flex: 1,
          marginLeft: 10,
          opacity: 0.7,
          fontWeight: "bold",
        }}
      >
        {props.children}
      </Text>

      <View
        style={{
          flexDirection: "row",
          backgroundColor: "#2c6bed",
        }}
      >
        <FontAwesome
          name="video-camera"
          size={24}
          color="#fafafa"
          style={{ marginHorizontal: 10, opacity: 0.7 }}
        />
        <Ionicons
          name="ios-call"
          size={24}
          color="#fafafa"
          style={{ marginHorizontal: 10, opacity: 0.7 }}
        />
        <MaterialCommunityIcons
          name="dots-vertical"
          size={24}
          color="#fafafa"
          style={{ marginHorizontal: 10, opacity: 0.7 }}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    backgroundColor: "#2c6bed",
  },
});