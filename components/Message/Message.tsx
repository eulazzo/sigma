import { Auth, DataStore, Storage } from "aws-amplify";
import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, useWindowDimensions } from "react-native";

import { User } from "../../src/models";
import { S3Image } from "aws-amplify-react-native";
import AudioPlayer from "../AudioPlayer";
import { Audio } from "expo-av";

const blue = "#3777f0";
const grey = "lightgrey";

const Message = ({ message }) => {
  const [user, setUser] = useState<User | undefined>();
  const [isMe, setIsMe] = useState<boolean>(false);
  const [soundURI, setSoundURI] = useState<any | null>(null);
  const { width } = useWindowDimensions();

  useEffect(() => {
    DataStore.query(User, message.userID)
      .then(setUser)
      .catch((err) => console.log(err));
  }, []);

  useEffect(() => {
    if (message.audio) {
      Storage.get(message.audio).then(setSoundURI);
    }
  }, [message]);

  useEffect(() => {
    const checkIfItsMe = async () => {
      if (!user) return;

      const {
        attributes: { sub: authUserID },
      } = await Auth.currentAuthenticatedUser();

      setIsMe(user.id === authUserID);
    };
    checkIfItsMe();
  }, [user]);

  return (
    <View
      style={[
        styles.container,
        isMe ? styles.rightContainer : styles.leftContainer,
        { width: soundURI ? "75%" : "auto" },
      ]}
    >
      {message.image && (
        <View style={{ marginBottom: message.content ? 10 : 0 }}>
          <S3Image
            imgKey={message.image}
            style={{ width: width * 0.7, aspectRatio: 4 / 3 }}
            resizeMode="contain"
          />
        </View>
      )}

      {message.audio && <AudioPlayer soundURI={soundURI} />}

      {!!message.content && (
        <Text style={{ color: isMe ? "black" : "white" }}>
          {message.content}
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 10,
    margin: 10,
    borderRadius: 10,
    maxWidth: "75%",
  },
  leftContainer: {
    backgroundColor: blue,
    marginLeft: 10,
    marginRight: "auto",
  },
  rightContainer: {
    backgroundColor: grey,
    marginLeft: "auto",
    marginRight: 10,
  },
});

export default Message;
