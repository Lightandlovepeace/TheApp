import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useState, useContext, useEffect } from "react";
import {
  View,
  StyleSheet,
  Text,
  Button,
  ScrollView,
  TouchableOpacity,
  Alert
} from "react-native";
import color from "../misc/color";
import PlayListInputModal from "../components/PlayListInputModal";
import { AudioContext } from "../context/AudioProvider";
import { play } from "../misc/AudioController";
import PlayListDetail from "../components/PlayListDetail";
import 'react-native-gesture-handler'
import { useAtom } from "jotai";
import { isVisible } from "../misc/atom";


let selectedPlayList = {}

const Playlist = ({navigation}) => {
  const [showPlayList,setShowPlayList] = useState(false);
  //const [showPlayList, setShowPlayList] = useAtom(isVisible); 
  const [modalVisible, setModalVisible] = useState(false);
  const context = useContext(AudioContext);

  const { playList, addToPlayList, updateState } = context;

  const createPlayList = async (playListName) => {
    const result = await AsyncStorage.getItem("playlist");
    if (result !== null) {
      const audios = [];
      if (addToPlayList) {
        audios.push(addToPlayList);
      }
      const newList = {
        id: Date.now(),
        title: playListName,
        audios: audios,
      };
      const updatedList = [...playList, newList];
      updateState(context, { addToPlayList: null, playList: updatedList });
      await AsyncStorage.setItem("playlist", JSON.stringify(updatedList));
    }
    setModalVisible(false);
  };

  const renderPlayList = async () => {
    const result = await AsyncStorage.getItem("playlist");
    if (result === null) {
      const defaultPlayList = {
        id: Date.now(),
        title: "My Favourite",
        audios: [],
      };
      const newPlayList = [...playList, defaultPlayList];
      updateState(context, { playList: [...newPlayList] });
      return await AsyncStorage.setItem(
        "playlist",
        JSON.stringify([...newPlayList])
      );
    }

    updateState(context, { playList: JSON.parse(result) });
  };

  useEffect(() => {
    if (!playList.length) {
      renderPlayList();
    }
  }, []);

const handleBannerPress = async (playList)=> {
    if(addToPlayList){
        // check if that same audio is already inside our list or not
        const result = await AsyncStorage.getItem('playlist');

        let oldList = [];
        let updatedList = [];
        let sameAudio = false;
        if(result !== null){
            oldList = JSON.parse(result);
            
            updatedList = oldList.filter(list => {
                if(list.id === playList.id){
                    for(let audio of list.audios){
                        if(audio.id === addToPlayList.id) {
                            // alert that the audio is already in the playlist
                            sameAudio = true;
                            return;
                        }
                    }
                    //update the playlist:
                    list.audios = [...list.audios, addToPlayList]
                }
                return list;
            })
        }

        if(sameAudio){
            Alert.alert('Found same audio', `${addToPlayList.filename} is already 
            inside the list.`);
            sameAudio = false;
            return updateState(context, {addToPlayList: null});
        }

        updateState(context, {addToPlayList: null, playList: [...updatedList]});
        return AsyncStorage.setItem('playlist', JSON.stringify([...updatedList]));
    }

    // if there is no audio selected, open the list
    selectedPlayList = playList
    //setShowPlayList(true);
    navigation.navigate("PlaylistDetail", playList);
}

  return (
      <>
    <ScrollView contentContainerStyle={styles.container}>
      {playList.length
        ? playList.map((item) => (
            <TouchableOpacity key={item.id.toString()} 
            style={styles.playListBanner} 
            onPress ={()=> handleBannerPress(item)}>
              <Text>{item.title}</Text>
              <Text numberOfLines = {1} style={styles.audioCount}>{item.audios.length > 1 ? `${item.audios.length}
              Songs` : `${item.audios.length} Song` }</Text>
            </TouchableOpacity>
          ))
        : null}
      <TouchableOpacity
        onPress={() => setModalVisible(true)}
        style={{ marginTop: 15 }}
      >
        <Text style={styles.playListButton}>+ Add New Playlist</Text>
      </TouchableOpacity>
      <PlayListInputModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onSubmit={createPlayList}
      />
    </ScrollView>
    <PlayListDetail visible ={showPlayList} playList ={selectedPlayList}
        onClose={() => {
        setShowPlayList(false)
        }}
    />
    
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 23,
  },
  audioCount: {
    marginTop: 5,
    opacity: 0.5,
    fontSize: 14,
  },
  playListBanner: {
    padding: 5,
    backgroundColor: color.PLAYLIST_BG,
    borderRadius: 5,
    marginBottom: 12,
  },
  playListButton: {
    color: color.ACTIVE_BG,
    letterSpacing: 1,
    fontWeight: "bold",
    fontSize: 14,
    padding: 5,
  },
});

export default Playlist;
