import { Feather } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import { View, Text, Pressable } from "react-native";
import { Audio, AVPlaybackStatus } from "expo-av";
import { StyleSheet } from "react-native";

const AudioPlayer = ({ soundURI }) => {
  const [sound, setSound] = useState<Audio.Sound | null>(null);
  const [paused, setPaused] = useState(true);
  const [audioProgress, setAudioProgress] = useState(0);
  const [audioDuration, setAudioDuration] = useState(0);

  const loadSound = async () => {
    if (!soundURI) return;
    const { sound } = await Audio.Sound.createAsync(
      { uri: soundURI },
      {},
      onPlaybackStatusUpdate
    );
    setSound(sound);
  };

  useEffect(() => {
    loadSound();
    ()=> {
      if (sound){
        sound.unloadAsync()
      }
    }
  }, [soundURI]);

  const onPlaybackStatusUpdate = (status: AVPlaybackStatus) => {
    if (!status.isLoaded) return;

    setAudioProgress(status.positionMillis / (status?.durationMillis || 1));
    setPaused(!status.isPlaying);
    setAudioDuration(status.durationMillis || 0);
  };

  const playOrPauseSound = async () => {
    if (!sound) return;

    if (paused) {
      await sound.playFromPositionAsync(0);
    } else {
      await sound.pauseAsync();
    }
  };

  const getDurationFormated = () => {
    const minutes = Math.floor(audioDuration / (60 * 1000));
    const seconds = Math.floor((audioDuration % (60 * 1000)) / 1000);

    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  return (
    <View style={styles.sendAudioContainer}>
      <Pressable onPress={playOrPauseSound}>
        <Feather name={paused ? "play" : "pause"} size={24} color="grey" />
      </Pressable>

      <View style={styles.audioProgresBG}>
        <View
          style={[styles.audioProgresFG, { left: `${audioProgress * 100}%` }]}
        ></View>
      </View>

      <Text>{getDurationFormated()}</Text>
    </View>
  );
};

const styles = StyleSheet.create({

  sendAudioContainer: {
    marginVertical: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: "lightgrey",
    borderRadius: 10,
    alignSelf: "stretch",
    justifyContent: "space-between",
    flexDirection: "row",
    alignItems: "center",
    backgroundColor:"#fafafa",
  },
  audioProgresBG: {
    height: 3,
    flex: 1,
    backgroundColor: "lightgrey",
    borderRadius: 10,
    margin: 10,
  },
  audioProgresFG: {
    width: 10,
    height: 10,
    borderRadius: 10,
    backgroundColor: "#3777fb",
    position: "absolute",
    top: -3,
  },
});

export default AudioPlayer;
