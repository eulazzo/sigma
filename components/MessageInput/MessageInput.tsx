import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Pressable,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import EmojiSelector from "react-native-emoji-selector";

import { Message } from "../../src/models/";
import { Auth, DataStore } from "aws-amplify";

import {
  SimpleLineIcons,
  Feather,
  MaterialCommunityIcons,
  AntDesign,
  Ionicons,
} from "@expo/vector-icons";
import { useRoute } from "@react-navigation/native";
import { ChatRoom } from "../../src/models";

const MessageInput = ({ chatRoom }) => {
  const [message, setMessage] = useState("");
  const [isEmojiPickerOpen, setIsEmojiPickerOpen] = useState(false);

  const sendMessage = async () => {
    // send message
    const {
      attributes: { sub: userAuthId },
    } = await Auth.currentAuthenticatedUser();

    const newMessage = await DataStore.save(
      new Message({
        content: message,
        userID: userAuthId,
        chatroomID: chatRoom.id,
      })
    );
    updateLastMessage(newMessage);
    setMessage("");
    setIsEmojiPickerOpen(false)
  };

  const updateLastMessage = async (newMessage) => {
    await DataStore.save(
      ChatRoom.copyOf(chatRoom, (updatedChatRoom) => {
        updatedChatRoom.LastMessage = newMessage;
      })
    );
  };

  const onPress = () => {
    if (message) {
      sendMessage();
    }
  };

  const sendEmoji = async () => {};

  return (
    <KeyboardAvoidingView
      style={{ ...styles.root, height: isEmojiPickerOpen ? "50%" : "auto" }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={100}
    >
      <View style={styles.row}>
        <View style={styles.inputContainer}>
          <Pressable
            onPress={() =>
              setIsEmojiPickerOpen((currentValue) => !currentValue)
            }
          >
            <SimpleLineIcons
              name="emotsmile"
              size={24}
              color="#595959"
              style={styles.icon}
            />
          </Pressable>

          <TextInput
            style={styles.input}
            value={message}
            onChangeText={setMessage}
            placeholder="Write something..."
          />

          <Feather
            name="camera"
            size={24}
            color="#595959"
            style={styles.icon}
          />
          <MaterialCommunityIcons
            name="microphone-outline"
            size={24}
            color="#595959"
            style={styles.icon}
          />
        </View>
        <Pressable onPress={onPress} style={styles.buttonContainer}>
          {message ? (
            <Ionicons name="send" size={18} color="white" />
          ) : (
            <AntDesign name="plus" size={24} color="white" />
          )}
        </Pressable>
      </View>
      {isEmojiPickerOpen && (
        <EmojiSelector
          columns={12}
          onEmojiSelected={(emoji) =>
            setMessage((currentMessage) => currentMessage + emoji)
          }
        />
      )}
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  root: {
    padding: 10,
  },
  inputContainer: {
    backgroundColor: "#f2f2f2",
    flex: 1,
    marginRight: 10,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: "#dedede",
    alignItems: "center",
    flexDirection: "row",
    padding: 5,
  },
  input: {
    flex: 1,
    marginHorizontal: 5,
  },
  icon: {
    marginHorizontal: 5,
  },
  buttonContainer: {
    width: 40,
    height: 40,
    backgroundColor: "#3777f0",
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
  },
  buttonText: {
    color: "white",
    fontSize: 35,
  },
  row: {
    flexDirection: "row",
  },
});

export default MessageInput;
