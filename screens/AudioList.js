import React, { Component } from "react";
import { View, StyleSheet, Text, TextInput, Dimensions } from "react-native";
import { AudioContext } from "../context/AudioProvider";
import * as MediaLibrary from "expo-media-library";
import Screen from "../components/Screen";
import { DataProvider, LayoutProvider } from "recyclerlistview";
import { RecyclerListView } from "recyclerlistview";
import AudioListItem from "../components/AudioListItem";
import OptionModal from "../components/OptionModal";
import {
  play,
  pause,
  resume,
  playNext,
  updatePitch,
  selectAudio,
} from "../misc/AudioController";
import { goBack } from "./PlayListDetail";
import { storeAudioForNextOpening } from "../misc/helper";
//import { PlayRate } from "./Settings";
import { hidePlayList } from "./Playlist";
import Settings from "./Settings";
import { BannerAd, BannerAdSize, TestIds } from "react-native-google-mobile-ads";

const { height, width } = Dimensions.get("window");
//Doe saveAudioforNextPlay
//console.log(global.PlayRate);

class AudioList extends Component {

  // keyWordSetting = (value) => {
  //   //console.log(value);
  //   this.props.updateData(value)
  //   //console.log(this.props.sharedData);
  //   this.context.updateState(this.context, {
  //     contextValue: value,
  //   });
  // }

  static contextType = AudioContext;

  constructor(props) {
    super(props);
    this.state = { optionModalVisible: false, keyword: null };
    this.currentItem = {};
  }


  dataProvider = new DataProvider((r1, r2) => {
    return r1 !== r2;
  });

  layoutProvider = new LayoutProvider(
    (i) => "audio",
    (type, dim) => {
      dim.width = Dimensions.get("window").width;
      dim.height = 70;
    }
  );

  // onPlaybackStatusUpdate = async (playbackStatus) => {
  //   console.log("hier");
  //   if (playbackStatus.isLoaded && playbackStatus.isPlaying) {
  //     this.context.updateState(this.context, {
  //       playbackPosition: playbackStatus.positionMillis,
  //       playbackDuration: playbackStatus.durationMillis,
  //     });
  //   }
  //
  //   if (playbackStatus.didJustFinish) {
  //      const nextAudioIndex = this.context.currentAudioIndex + 1;
  //     if (nextAudioIndex >= this.context.totalAudioCount) {
  //        this.context.playbackObj.unloadAsync();
  //        return this.context.updateState(this.context, {
  //          soundObj: null,
  //          currentAudio: this.context.audioFiles[0],
  //          isPlaying: false,
  //          currentAudioIndex: 0,
  //          playbackPosition: null,
  //          playbackDuration: null,
  //        });
  //      }
  //      const audio = this.context.audioFiles[nextAudioIndex];
  //      const status = await playNext(this.context.playbackObj, audio.uri);
  //      this.context.updateState(this.context, {
  //        soundObj: status,
  //        currentAudio: audio,
  //       isPlaying: true,
  //        currentAudioIndex: nextAudioIndex,
  //      });
  //    }
  //  };

  handleAudioPress = async (audio) => {
    await selectAudio(audio, this.context);
  };

  componentDidMount() {
    this.context.loadPreviousAudio()
  }

  rowRenderer = (type, item, index, extendedState) => {
    return (
      <AudioListItem
        title={item.filename}
        isPlaying={extendedState.isPlaying}
        activeListItem={this.context.currentAudioIndex === index}
        duration={item.duration}
        onAudioPress={() => this.handleAudioPress(item)}
        onOptionPress={() => {
          this.currentItem = item;
          this.setState({ ...this.state, optionModalVisible: true });
        }}
      />
    );
  };

  navigateToPlaylist = () => {
    //
    console.log("navigate");
    this.context.updateState(this.context, {
      addToPlayList: this.currentItem,
    });
    this.props.navigation.navigate("Playlist");
  }

  handleKeyWordChange = (text) => {
    if (text != null) {
      this.setState({ keyword: text }, () => {
        // Filter audioFiles based on the keyword
        const { audioFiles } = this.context;
        const filteredAudioFiles = audioFiles.filter((audios) =>
          audios.filename.toLowerCase().includes(this.state.keyword.toLowerCase())
        );
        const newDataProvider = new DataProvider((r1, r2) => r1 !== r2).cloneWithRows(filteredAudioFiles);
        this.context.updateState(this.context, { dataProvider: newDataProvider });
      });
    }
  };


  render() {
    if (global.Hz === undefined) {
      global.Hz = 440
    }
    return (
      <>
        <View style={styles.viewStyle}>
          <Text style={{ fontWeight: 'bold', fontSize: 24, }}>{global.Hz} Hz mode</Text>
          <TextInput style={{
            width: width - 54,
            height: 48,
            margin: 13,
            borderWidth: 2,
            padding: 12,
            fontSize: 21,
            borderRadius: 15,
            color: 'blue',
          }} onChangeText={(value) => this.handleKeyWordChange(value)} value={this.state.keyword} placeholder={"Search your music"}></TextInput>
        </View >
        <AudioContext.Consumer>
          {({ dataProvider, isPlaying }) => {
            if (!dataProvider._data.length) return null;
            return (
              <View style={{ minHeight: 1, minWidth: 1, flex: 1 }}>
                {dataProvider && dataProvider.getSize() > 0 && (
                  <RecyclerListView
                    dataProvider={dataProvider}
                    layoutProvider={this.layoutProvider}
                    rowRenderer={this.rowRenderer}
                    extendedState={{ isPlaying }}
                  />
                )}
                <OptionModal
                  // onPlayPress={() => console.log("play")}
                  // onPlaylistPress={() => {
                  //   this.context.updateState(this.context, {
                  //     addToPlayList: this.currentItem,
                  //   });
                  //   this.props.navigation.navigate("Playlist");
                  // }}
                  options={[{ title: 'Add to playlist', onPress: this.navigateToPlaylist }]}
                  currentItem={this.currentItem}
                  onClose={() =>
                    this.setState({ ...this.state, optionModalVisible: false })
                  }
                  visible={this.state.optionModalVisible}
                />
              </View>
            );
          }}
        </AudioContext.Consumer>
        <View style = {styles.add}>
          <BannerAd unitId={TestIds.BANNER} size={BannerAdSize.BANNER}
            requestOptions={{ requestNonPersonalizedAdsOnly: true }} />
        </View>
      </>
    );
  }
}



const styles = StyleSheet.create({
  add: {
    alignItems: 'center',
    height: 60,
    justifyContent: 'flex-end',
  },
  testStyle: {
    flex: 1,
    alignContent: 'center',
  },
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  viewStyle: {
    flexDirection: 'column',
    alignItems: 'center',
    paddingLeft: 20,
    paddingBottom: 10
  }
});

export default AudioList;

