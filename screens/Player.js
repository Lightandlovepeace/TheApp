import React, { useContext, useState, useEffect } from "react";
import { View, StyleSheet, Text, Dimensions } from "react-native";
import Screen from "../components/Screen";
import color from "../misc/color";
import { FontAwesome5 } from "@expo/vector-icons";
import Slider from "@react-native-community/slider";
import PlayerButton from "../components/PlayerButton";
import { AudioContext } from "../context/AudioProvider";
import { changeAudio, moveAudio, pause, play, playNext, resume, selectAudio, shuffleAudio } from "../misc/AudioController";
//import { PlayRate } from "./Settings";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import './Settings';
import { convertTime } from "../misc/helper";

const { width } = Dimensions.get("window");
global.shuffle = false;

const Player = () => {
  const [shuffle, setShuffle] = useState(false);
  const [currentPosition, setCurrentPosition] = useState(0);
  const context = useContext(AudioContext);
  const { playbackPosition, playbackDuration, currentAudio } = context;

  const calculateSeekbar = () => {
    if (playbackPosition !== null && playbackDuration !== null) {
      return playbackPosition / playbackDuration;
    }

    if (currentAudio.lastPosition) {
      return currentAudio.lastPosition / (currentAudio.duration * 1000)
    }
    return 0;
  };

  const handlePlayPause = async () => {
    await selectAudio(context.currentAudio, context);
  };

  const handlePrevious = async () => {
    await changeAudio(context, "previous")
    //    const { isLoaded } = await context.playbackObj.getStatusAsync();
    //    const isFirstAudio = context.currentAudioIndex <= 0;
    //    let audio = context.audioFiles[context.currentAudioIndex - 1];
    //    let index;
    //    let status;
    //
    //    if (!isLoaded && !isFirstAudio) {
    //      index = context.currentAudioIndex - 1;
    //      status = await play(context.playbackObj, audio.uri, global.PlayRate);
    //    }
    //
    //    if (isLoaded && !isFirstAudio) {
    //      index = context.currentAudioIndex - 1;
    //      status = await playNext(context.playbackObj, audio.uri);
    //    }
    //
    //    if (isFirstAudio) {
    //      index = context.totalAudioCount - 1;
    //      audio = context.audioFiles[index];
    //      status = await playNext(context.playbackObj, audio.uri);
    //    }
    //
    //    context.updateState(context, {
    //      currentAudio: audio,
    //      playbackObj: context.playbackObj,
    //      soundObj: status,
    //      isPlaying: true,
    //      currentAudioIndex: index,
    //      playbackPosition: null,
    //      playbackDuration: null,
    //    });
  };

  const handleNext = async () => {
    if (shuffle === false) {
      await changeAudio(context, "next");
    }
    if (shuffle === true) {
      await shuffleAudio(context, 'next');
    }
    //    const { isLoaded } = await context.playbackObj.getStatusAsync();
    //    const isLastAudio =
    //      context.currentAudioIndex + 1 === context.totalAudioCount;
    //   let audio = context.audioFiles[context.currentAudioIndex + 1];
    //    let index;
    //    let status;
    //
    //    if (!isLoaded && !isLastAudio) {
    //      index = context.currentAudioIndex + 1;
    //     status = await play(context.playbackObj, audio.uri, global.PlayRate);
    //    }
    //
    //    if (isLoaded && !isLastAudio) {
    //      index = context.currentAudioIndex + 1;
    //      status = await playNext(context.playbackObj, audio.uri);
    //    }
    //
    //    if (isLastAudio) {
    //      index = 0;
    //      audio = context.audioFiles[index];
    //      status = await playNext(context.playbackObj, audio.uri);
    //    }
    //
    //    context.updateState(context, {
    //      currentAudio: audio,
    //      playbackObj: context.playbackObj,
    //      soundObj: status,
    //      isPlaying: true,
    //      currentAudioIndex: index,
    //      playbackPosition: null,
    //      playbackDuration: null,
    //    });
  };

  const renderCurrentTime = () => {
    if (!context.soundObj && currentAudio.lastPosition) {
      return convertTime(currentAudio.lastPosition / 1000)
    }
    return convertTime(context.playbackPosition / 1000);
  }

  try {
    useEffect(() => {
      context.loadPreviousAudio();
    }, []);
  } catch (error) {
    console.log(error.message)
  }


  if (!context.currentAudio) return null;

  return (
    <Screen>
      <View style={styles.container}>
        <View style={styles.audioCountContainer}>
          <View style={{ flexDirection: "row" }}>
            {context.isPlayListRunning && (
              <>
                <Text style={{ fontWeight: "bold" }}>From Playlist:</Text>
                <Text>{context.activePlayList.title}</Text>
              </>
            )}
          </View>
          <Text style={styles.audioCount}>{`${context.currentAudioIndex + 1
            } / ${context.totalAudioCount}`}</Text>
        </View>
        <View style={styles.midBannerContainer}>
          <FontAwesome5
            name="music"
            size={290}
            color={context.isPlaying ? color.ACTIVE_BG : color.FONT_MEDIUM}
          />
        </View>
        <View style={styles.audioPlayerContainer}>
          <Text numberOfLines={1} style={styles.audioTitle}>
            {context.currentAudio.filename}
          </Text>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              paddingHorizontal: 15,
            }}
          >
            <Text>{convertTime(context.currentAudio.duration)}</Text>
            <Text>
              {currentPosition ? currentPosition : renderCurrentTime()}
            </Text>
          </View>
          <Slider
            style={{ width: width, height: 40 }}
            minimumValue={0}
            maximumValue={1}
            value={calculateSeekbar()}
            minimumTrackTintColor={color.FONT_MEDIUM}
            maximumTrackTintColor={color.ACTIVE_BG}
            onValueChange={(value) => {
              setCurrentPosition(
                convertTime(value * context.currentAudio.duration)
              );
            }}
            onSlidingStart={async () => {
              if (!context.isPlaying) {
                return;
              }
              try {
                await pause(context.playbackObj);
              } catch {
                console.log("error inside onSlideStart method", error);
              }
            }}
            onSlidingComplete={async (value) => {
              await moveAudio(context, value);
              setCurrentPosition(0);
            }}
          />
          <View style={styles.audioControllers}>
            {shuffle ? (
              <MaterialCommunityIcons
                name="shuffle-variant"
                size={52}
                color="black"
                style={{ paddingRight: 19 }}
                onPress={() => {
                  setShuffle(false);
                  global.shuffle = false;}}
              />
            ) : (
              <MaterialCommunityIcons
                name="shuffle-disabled"
                style={{ paddingRight: 19 }}
                size={52}
                color="black"
                onPress={() => {
                  setShuffle(true);
                  global.shuffle = true;
                }}
              />
            )}
            <PlayerButton onPress={handlePrevious} iconType="PREV" />
            <PlayerButton
              onPress={handlePlayPause}
              style={{ marginHorizontal: 30 }}
              iconType={context.isPlaying ? "PLAY" : "PAUSE"}
            />
            <PlayerButton onPress={handleNext} iconType="NEXT" style={{ paddingRight: 37 }} />
          </View>
        </View>
      </View>
    </Screen>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  audioControllers: {
    width,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingBottom: 34,
  },

  audioCount: {
    textAlign: "right",
    color: color.FONT_LIGHT,
    fontSize: 15,
  },
  midBannerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  audioTitle: {
    fontSize: 17,
    color: color.FONT,
    padding: 15,
  },
  audioCountContainer: {
    flexDirection: 'row',
    paddingHorizontal: 15,
    justifyContent: 'space-between',
  }
});

export default Player;
