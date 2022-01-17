import React, { useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  TextInput,
  Pressable,
  KeyboardAvoidingView,
  Platform,
  Image,
} from "react-native";
import EmojiSelector from "react-native-emoji-selector";

import { Message } from "../../src/models/";
import { Auth, DataStore, Storage } from "aws-amplify";

import {
  SimpleLineIcons,
  Feather,
  MaterialCommunityIcons,
  AntDesign,
  Ionicons,
  EvilIcons,
} from "@expo/vector-icons";

import { ChatRoom } from "../../src/models";
import * as ImagePicker from "expo-image-picker";

const MessageInput = ({ chatRoom }) => {
  const [message, setMessage] = useState("");
  const [isEmojiPickerOpen, setIsEmojiPickerOpen] = useState(false);
  const [image, setImage] = useState(null);
  const [progress, setProgress] = useState(0);

  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.cancelled) {
      setImage(result.uri);
    }
  };

  const takePhoto = async () => {
    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });
    if (!result.cancelled) {
      setImage(result.uri);
    }
  };

  useEffect(() => {
    (async () => {
      if (Platform.OS !== "web") {
        try {
          const libraryResponse =
            await ImagePicker.requestMediaLibraryPermissionsAsync();

          const photoResponse =
            await ImagePicker.requestCameraPermissionsAsync();
          if (
            libraryResponse.status !== "granted" ||
            photoResponse.status !== "granted"
          ) {
            alert("Sorry, we need camera roll permissions to make this work");
          }
        } catch (error) {
          console.log(error);
        }
      }
    })();
  }, []);

  const resetFields = () => {
    setMessage("");
    setIsEmojiPickerOpen(false);
    setImage(null);
    setProgress(0);
  };

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
    resetFields();
  };

  const updateLastMessage = async (newMessage) => {
    await DataStore.save(
      ChatRoom.copyOf(chatRoom, (updatedChatRoom) => {
        updatedChatRoom.LastMessage = newMessage;
      })
    );
  };

  const progressCallback = (progress) => {
    console.log(`Uploaded: ${progress.loaded}/${progress.total}`);
    setProgress(progress.loaded / progress.total);
  };

  const sendImage = async () => {
    if (!image) return;

    const imageArray = image.split(".");
    const imageType = imageArray[imageArray.length - 1];

    const fileName = `${Date.now()}.${imageType}`;

    const blob = await getImageBlob();
    const { key } = await Storage.put(fileName, blob, { progressCallback });

    // send image
    const {
      attributes: { sub: userAuthId },
    } = await Auth.currentAuthenticatedUser();

    const newMessage = await DataStore.save(
      new Message({
        content: message,
        image: key,
        userID: userAuthId,
        chatroomID: chatRoom.id,
      })
    );
    updateLastMessage(newMessage);

    resetFields();
  };

  const getImageBlob = async () => {
    if (!image) return null;

    const response = await fetch(image);
    const blob = await response.blob();

    return blob;
  };

  const onPress = () => {
    if (image) {
      sendImage();
    } else if (message) {
      sendMessage();
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ ...styles.root, height: isEmojiPickerOpen ? "50%" : "auto" }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={100}
    >
      {image && (
        <View style={styles.sendImageContainer}>
          <Image
            source={{ uri: image }}
            style={{ width: 100, height: 100, borderRadius: 10 }}
          />

          <View
            style={{
              flex: 1,
              justifyContent: "flex-start",
              alignSelf: "flex-end",
            }}
          >
            <View
              style={{
                height: 5,
                borderRadius: 5,
                backgroundColor: "#3777f0",
                width: `${progress * 100}%`,
              }}
            ></View>
          </View>

          <EvilIcons
            onPress={() => setImage(null)}
            name="close"
            size={30}
            color="#000"
            style={{ margin: 5 }}
          />
        </View>
      )}

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
          <Pressable onPress={pickImage}>
            <Feather
              name="image"
              size={24}
              color="#595959"
              style={styles.icon}
            />
          </Pressable>
          <Pressable onPress={takePhoto}>
            <Feather
              name="camera"
              size={24}
              color="#595959"
              style={styles.icon}
            />
          </Pressable>

          <MaterialCommunityIcons
            name="microphone-outline"
            size={24}
            color="#595959"
            style={styles.icon}
          />
        </View>
        <Pressable onPress={onPress} style={styles.buttonContainer}>
          {message || image ? (
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
  sendImageContainer: {
    flexDirection: "row",
    margin: 10,
    alignSelf: "stretch",
    justifyContent: "space-between",
    borderWidth: 1,
    borderColor: "lightgrey",
    borderRadius: 10,
  },
});

export default MessageInput;
