import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TextInput,
  Platform,
} from "react-native";
import { S3Image } from "aws-amplify-react-native";
import { SimpleLineIcons } from "@expo/vector-icons";
import { Auth, DataStore, Storage } from "aws-amplify";
import { User } from "../src/models";
import * as ImagePicker from "expo-image-picker";
import DEFAULT_IMAGE from "../assets/images/authUserAvatar.png";
import { LongPressGestureHandler } from "react-native-gesture-handler";

const authAvatar = Image.resolveAssetSource(DEFAULT_IMAGE).uri;

export const UserProfileScreen = () => {
  const [user, setUser] = useState<User | null>(null); //the display user
  const [name, setName] = useState("");
  // const [name, setName] = useState(user.name);
  const [image, setImage] = useState(null);

  // useEffect(() => {
  //   const subscription = DataStore.observe(User, user.id).subscribe((msg) => {
  //     if (msg.model === User && msg.opType === "UPDATE") {
  //       setUser((existingMessages) => [msg.element, ...existingMessages]);
  //     }
  //   });
  //   return () => subscription.unsubscribe();
  // }, []);

  const logout = async () => {
    await DataStore.clear();
    await Auth.signOut();
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

  useEffect(() => {
    const fetchUser = async () => {
      const {
        attributes: { sub: authUserID },
      } = await Auth.currentAuthenticatedUser();

      const authUserData = (await DataStore.query(User)).find(
        (user) => user.id === authUserID
      );

      setUser(authUserData || null);
    };
    fetchUser();
  }, []);

  const saveTheName = async () => {
    try {
      await DataStore.save(
        User.copyOf(user, (updated) => {
          updated.name = name;
        })
      );
    } catch (error) {
      console.log("Error>:", error);
    } finally {
      if (image) {
        sendImage();
      }
    }
  };

  const pickerImage = async () => {
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

  const getImageBlob = async () => {
    if (!image) return null;

    const response = await fetch(image);
    const blob = await response.blob();

    return blob;
  };

  const sendImage = async () => {
    if (!image) return;

    const imageArray = image.split(".");
    const imageType = imageArray[imageArray.length - 1];
    const fileName = `${Date.now()}.${imageType}`;

    const blob = await getImageBlob();

    //save image on s3 bucket on amazon
    const { key } = await Storage.put(fileName, blob);

    //save a link to user model

    await DataStore.save(
      User.copyOf(user, (updated) => {
        updated.imageUri = key;
      })
    );
  };

  const verify = () => {
    if (!user?.name) return;
    if (user.name.includes("@")) {
      return user.name.split("@")[0];
    } else {
      return user.name;
    }
  };

  return (
    <View>
      <View style={styles.wrapper}>
        <Image
          style={styles.image}
          source={{ uri: user?.imageUri || authAvatar }}
        />

        <View style={styles.icon}>
          <SimpleLineIcons
            onPress={pickerImage}
            name="camera"
            size={25}
            color="#000"
          />
        </View>
        <Text style={styles.text}>{verify()}</Text>
      </View>

      <View style={styles.inputContainer}>
        <Text style={{ flex: 1, fontSize: 16, opacity: 0.7 }}>Name</Text>
        <TextInput
          placeholder={"New Nickname"}
          value={name}
          style={{ color: "grey" }}
          onChangeText={setName}
        />
      </View>

      <View style={styles.saveOrLeaveContainer}>
        <Text onPress={saveTheName} style={styles.logoutText}>
          Save
        </Text>
        <View style={styles.logoutButton}>
          <SimpleLineIcons name="logout" size={25} color="#fafafa" />
          <Text
            onPress={logout}
            style={{ fontSize: 16, color: "#fafafa", marginLeft: 5 }}
          >
            Logout
          </Text>
        </View>
      </View>
    </View>
  );
};

export default UserProfileScreen;

const styles = StyleSheet.create({
  image: {
    width: 150,
    height: 150,
    borderRadius: 75,
  },
  wrapper: {
    alignItems: "center",
    padding: 30,
  },
  text: {
    fontSize: 20,
    color: "gray",
  },
  icon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#fafafa",
    alignItems: "center",
    justifyContent: "center",
    position: "absolute",
    top: 130,
    right: 125,
  },
  inputContainer: {
    flexDirection: "row",
    paddingHorizontal: 20,
    borderWidth: 1,
    borderColor: "lightgrey",
    padding: 15,
    backgroundColor: "#fafafa",
  },
  saveOrLeaveContainer: {
    marginTop: 15,
    marginHorizontal: 15,
    flexDirection: "row",
    margin: 5,
  },
  logoutText: {
    fontSize: 16,
    backgroundColor: "#3777f0",
    flex: 3,
    textAlign: "center",
    color: "#fafafa",
    padding: 10,
    borderRadius: 10,
    marginRight: 5,
  },
  logoutButton: {
    flexDirection: "row",
    backgroundColor: "#3777f0",
    alignItems: "center",
    textAlign: "center",
    padding: 10,
    borderRadius: 10,
  },
});
