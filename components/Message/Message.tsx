import { Auth, DataStore } from "aws-amplify";
import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, useWindowDimensions } from "react-native";

import { User } from "../../src/models";
import { S3Image } from "aws-amplify-react-native";

const blue = "#3777f0";
const grey = "lightgrey";

const Message = ({ message }) => {
  const { width } = useWindowDimensions();

  const [user, setUser] = useState<User | undefined>();
  const [isMe, setIsMe] = useState<boolean>(false);

  useEffect(() => {
    DataStore.query(User, message.userID)
      .then(setUser)
      .catch((err) => console.log(err));
  }, []);

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
