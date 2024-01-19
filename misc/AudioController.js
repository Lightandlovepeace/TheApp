// play audio
// Import the react-native-sound module

import {
  PitchCorrectionQuality,
  shouldCorrectPitch,
  rate,
} from "expo-av/build/AV.types";
import { storeAudioForNextOpening } from "./helper";
import { DeviceEventEmitter } from 'react-native';
import RNBluetoothClassic, {BluetoothEventType} from 'react-native-bluetooth-classic';
import { Component } from "react";


export const play = async (playbackObj, uri, lastPosition) => {
  try {
    if (!lastPosition)
      return await playbackObj.loadAsync(
        { uri },
        { shouldPlay: true, progressUpdateIntervalMillis: 1000 }
      );

    //if there is a lastPosition: then play audio from lastpost
    await playbackObj.loadAsync(
      { uri },
      { progressUpdateIntervalMillis: 1000 }
    );

    return await playbackObj.playFromPositionAsync(lastPosition);
  } catch (error) {
    console.log("error inside play helper method", error.message);
  }
};

//pause
export const pause = async (playbackObj) => {
  try {
    return await playbackObj.setStatusAsync({
      shouldPlay: false,
    });
  } catch (error) {
    console.log("error inside pause helper method", error.message);
  }
};
//resume
export const resume = async (playbackObj) => {
  try {
    return await playbackObj.playAsync();
  } catch (error) {
    console.log("error inside pause resume method", error.message);
  }
};

//select next
export const playNext = async (playbackObj, uri) => {
  try {
    await playbackObj.stopAsync();
    await playbackObj.unloadAsync();
    return await play(playbackObj, uri);
  } catch (error) {
    console.log("error inside playNext helper method");
  }
};

export const updatePitch = async (playbackObj, speed) => {
  try {
    //await playbackObj.stopAsync()
    //await playbackObj.unloadAsync()
    //await play(playbackObj,uri)
    if (playbackObj !== null) {
      return await playbackObj.setStatusAsync({
        rate: speed,
        shouldCorrectPitch: false,
        PitchCorrectionQuality: "High",
      });
    }
    if (playbackObj === null) {
      return;
    }
  } catch (error) {
    console.log("error inside updatePitch", error.message);
  }
};

export const selectAudio = async (audio, context, playListInfo = {}) => {
  const {
    soundObj,
    playbackObj,
    currentAudio,
    updateState,
    audioFiles,
    onPlaybackStatusUpdate,
  } = context;
  //play audio
  try {
    if (soundObj === null) {
      //playing audio for the first
      const status = await play(playbackObj, audio.uri, audio.lastPosition);
      const index = audioFiles.findIndex(({ id }) => id === audio.id);
      updateState(context, {
        currentAudio: audio,
        soundObj: status,
        isPlaying: true,
        currentAudioIndex: index,
        isPlayListRunning: false,
        activePlayList: [],
        ...playListInfo,
      });
      playbackObj.setOnPlaybackStatusUpdate(onPlaybackStatusUpdate);
      return storeAudioForNextOpening(audio, index);
    }

    //pause
    if (
      soundObj.isLoaded &&
      soundObj.isPlaying &&
      currentAudio.id === audio.id
    ) {
      const status = await pause(playbackObj, global.PlayRate);
      return updateState(context, {
        soundObj: status,
        isPlaying: false,
        playbackPosition: status.positionMillis,
      });
    }

    //update pitch
    //resume
    if (
      soundObj.isLoaded &&
      !soundObj.isPlaying &&
      currentAudio.id === audio.id
    ) {
      const status = await resume(playbackObj);
      return updateState(context, {
        soundObj: status,
        isPlaying: true,
        rate: 3,
      });
    }
    //select different audio
    if (soundObj.isLoaded && currentAudio.id !== audio.id) {
      const status = await playNext(playbackObj, audio.uri);
      const index = audioFiles.findIndex(({ id }) => id === audio.id);
      updateState(context, {
        currentAudio: audio,
        soundObj: status,
        isPlaying: true,
        currentAudioIndex: index,
        isPlayListRunning: false,
        activePlayList: [],
        ...playListInfo,
      });
      return storeAudioForNextOpening(audio, index);
    }
  } catch (error) {
    console.log("an error in the selectAudio method", error.message);
  }
};

const selectAudioFromPlayList = async (context, select) => {
  const { activePlayList, currentAudio, audioFiles, playbackObj, updateState } =
    context;
  let audio;
  let defaultIndex;
  let nextIndex;

  const indexOnPlayList = activePlayList.audios.findIndex(
    ({ id }) => id === currentAudio.id
  );

  if (select === "next") {
    nextIndex = indexOnPlayList + 1;
    defaultIndex = 0;
  }

  if (select === "previous") {
    nextIndex = indexOnPlayList - 1;
    defaultIndex = activePlayList.audios.length - 1;
  }
  audio = activePlayList.audios[nextIndex];

  if (!audio) audio = activePlayList.audios[defaultIndex];

  const indexOnAllList = audioFiles.findIndex(({ id }) => id === audio.id);

  const status = await playNext(playbackObj, audio.uri);
  return updateState(context, {
    soundObj: status,
    isPlaying: true,
    currentAudio: audio,
    currentAudioIndex: indexOnAllList,
  });
};

export const changeAudio = async (context, select) => {
  const {
    playbackObj,
    currentAudioIndex,
    totalAudioCount,
    audioFiles,
    updateState,
    onPlaybackStatusUpdate,
    isPlayListRunning,
  } = context;

  if (isPlayListRunning) return selectAudioFromPlayList(context, select);
  try {
    const { isLoaded } = await playbackObj.getStatusAsync();
    const isLastAudio = currentAudioIndex + 1 === totalAudioCount;
    const isFirstAudio = currentAudioIndex <= 0;
    let audio;
    let index;
    let status;

    if (select === "next") {
      audio = audioFiles[currentAudioIndex + 1];
      if (!isLoaded && !isLastAudio) {
        index = currentAudioIndex + 1;
        status = await play(playbackObj, audio.uri, global.PlayRate);
        playbackObj.setOnPlaybackStatusUpdate(onPlaybackStatusUpdate);
      }

      if (isLoaded && !isLastAudio) {
        index = currentAudioIndex + 1;
        status = await playNext(playbackObj, audio.uri);
      }

      if (isLastAudio) {
        index = 0;
        audio = audioFiles[index];
        if (isLoaded) {
          status = await playNext(playbackObj, audio.uri);
        } else {
          status = await play(playbackObj, audio.uri);
        }
      }
    }

    if (select === "previous") {
      //for previous
      audio = audioFiles[currentAudioIndex - 1];
      if (!isLoaded && !isFirstAudio) {
        index = currentAudioIndex - 1;
        status = await play(playbackObj, audio.uri, global.PlayRate);
        playbackObj.setOnPlaybackStatusUpdate(onPlaybackStatusUpdate);
      }

      if (isLoaded && !isFirstAudio) {
        index = currentAudioIndex - 1;
        status = await playNext(playbackObj, audio.uri);
      }

      if (isFirstAudio) {
        index = totalAudioCount - 1;
        audio = audioFiles[index];
        status = await playNext(playbackObj, audio.uri);
      }
    }

    updateState(context, {
      currentAudio: audio,
      soundObj: status,
      isPlaying: true,
      currentAudioIndex: index,
      playbackPosition: null,
      playbackDuration: null,
    });
  } catch (error) {
    console.log("An error has occured inside changeAudio", error.message);
  }
};

export const shuffleAudio = async (context, select) => {
  const {
    playbackObj,
    currentAudioIndex,
    totalAudioCount,
    audioFiles,
    updateState,
    onPlaybackStatusUpdate,
    isPlayListRunning,
  } = context;

  if (isPlayListRunning) return selectAudioFromPlayList(context, select);
  try {
    const { isLoaded } = await playbackObj.getStatusAsync();
    let audio;
    let index;
    let status;

    if (select === "next") {
      let change = Math.floor(Math.random() * (audioFiles.length - 1))
      audio = audioFiles[change];
      if (!isLoaded) {
        index = currentAudioIndex + 1;
        status = await play(playbackObj, audio.uri, global.PlayRate);
        playbackObj.setOnPlaybackStatusUpdate(onPlaybackStatusUpdate);
      }

      if (isLoaded) {
        index = change;
        status = await playNext(playbackObj, audio.uri);
      }
    }
    updateState(context, {
      currentAudio: audio,
      soundObj: status,
      isPlaying: true,
      currentAudioIndex: index,
      playbackPosition: null,
      playbackDuration: null,
    });
  } catch (error) {
    console.log("An error has occured inside changeAudio", error.message);
  }
};

export const moveAudio = async (context, value) => {
  const { soundObj, isPlaying, playbackObj, updateState } = context;
  if (soundObj === null || !isPlaying) {
    return;
  }

  try {
    const status = await playbackObj.setPositionAsync(
      Math.floor(soundObj.durationMillis * value)
    );
    updateState(context, {
      soundObj: status,
      playbackPosition: status.positionMillis,
    });

    await resume(playbackObj);
  } catch {
    console.log("error Inside onSlidingcomplete method", error);
  }
};

// // Initialize BluetoothClassic
// RNBluetoothClassic.startDiscovery(); // You may want to start scanning for Bluetooth devices

// DeviceEventEmitter.addListener('BluetoothClassicData', (data) => {
//   // Handle Bluetooth data received from the device
//   console.log('Bluetooth data received:', data);

//   // Parse the data and trigger corresponding actions
//   if (data === 'play') {
//     play(playbackObj);
//   } else if (data === 'pause') {
//     // Play action
//     pause(playbackObj);
//   } else if (data === 'next') {
//     selectAudio(playbackObj, 'next');
//   } else if (data === 'previous') {
//     // Previous action
//     selectAudio(playbackObj, 'previous');
//   }
//   // if (data.startsWith('play:')) {
//   //   const audioId = data.split(':')[1]; // Extract audio ID from the received data
//   //   const selectedAudio = AudioFiles.find((audio) => audio.id === audioId);
//   //   if (selectedAudio) {
//   //     selectAudio(selectedAudio, Context); // Assuming you have access to yourContext
//   //   }
//   // }
// });

// //Stop Bluetooth scanning when the component unmounts

// class AudioController extends Component {
//   componentWillUnmount() {
//     RNBluetoothClassic.stopDiscovery();
//     DeviceEventEmitter.removeAllListeners('BluetoothClassicData');
//   }
// }

// export default AudioController;