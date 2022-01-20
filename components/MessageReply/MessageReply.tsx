import { Auth, DataStore, Storage } from "aws-amplify";
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  useWindowDimensions,
  Pressable,
} from "react-native";

import { User } from "../../src/models";
import { Message as MessageModel } from "../../src/models";
import { S3Image } from "aws-amplify-react-native";
import AudioPlayer from "../AudioPlayer";
import { Audio } from "expo-av";
import { Ionicons } from "@expo/vector-icons";

const blue = "#3777f0";
const grey = "lightgrey";

const MessageReply = (props) => {
  const { message: propMessage } = props;
  const [message, setMessage] = useState<MessageModel>(props.message);
  const [user, setUser] = useState<User | undefined>();
  const [isMe, setIsMe] = useState<boolean | null>(null);
  const [soundURI, setSoundURI] = useState<any | null>(null);
  const { width } = useWindowDimensions();

   



  //this is for reply message to works properly.
  //(make possible cancel a reply to reply another message)
  useEffect(() => {
    setMessage(propMessage);
  }, [propMessage]);

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
      
      <View style={styles.row}>
        {message.image && (
          <View style={{ marginBottom: message.content ? 10 : 0 }}>
            <S3Image
              imgKey={message.image}
              style={{ width: width * 0.65, aspectRatio: 4 / 3 }}
              resizeMode="contain"
            />
          </View>
        )}

        {message.audio && (
          <View style={{ flex: 1 }}>
            <AudioPlayer soundURI={soundURI} />
          </View>
        )}

        {!!message.content && (
          <Text style={{ color: isMe ? "black" : "white" }}>
            {message.content}
          </Text>
        )}

        {isMe && !!message.status && message.status !== "SENT" && (
          <Ionicons
            style={{ marginHorizontal: 2 }}
            name={
              message.status === "DELIVERED"
                ? "md-checkmark"
                : "md-checkmark-done"
            }
            size={20}
            color="#000"
          />
        )}
      </View>
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
  row: {
    flexDirection: "row",
    alignItems: "flex-end",
  },
  messageReply: {
    backgroundColor:"#f1f1f1",
    padding: 5,
    borderRadius:5,
    borderColor:"#3777f0",
    borderLeftWidth:3

  },
  leftContainer: {
    backgroundColor: "#3777f0",
    marginLeft: 10,
    marginRight: "auto",
  },
  rightContainer: {
    backgroundColor: grey,
    marginLeft: "auto",
    marginRight: 10,
    alignItems: "flex-end",

  },
});

export default MessageReply;
