import React, { useContext } from "react";
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity, ScrollView,
} from "react-native";
import { useBle } from '../misc/useBle';
import { AudioContext } from "../context/AudioProvider";
import color from "../misc/color";
import { updatePitch } from "../misc/AudioController";
//import { like_black } from "../misc/color";

if (global.Hz == undefined) {
  global.Hz = 440;
}

const Settings = () => {
  const context = useContext(AudioContext);
  return (
    <View contentContainerStyle={styles.container}>
      <View style={styles.viewStyle}>
        <Text
          style={{
            fontWeight: "bold",
            fontSize: 24,
            marginLeft: 50,
            marginRight: 50,
          }}
        >
          Hz mode: {global.Hz}
        </Text>
      </View>
      <Text style={styles.topText}>Select Frequency:</Text>
      <ScrollView>
        <TouchableOpacity
          onPress={() => {
            global.PlayRate = 0.99654545454;
            updatePitch(context.playbackObj, global.PlayRate);
            global.Hz = 174;
          }}
          style={styles.container}
        >
          <Text style={styles.hz174}>F3 = 174Hz</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            global.PlayRate = 1.02811363636;
            updatePitch(context.playbackObj, global.PlayRate);
            global.Hz = 285;
          }}
          style={styles.container}
        >
          <Text style={styles.Hz285}>C#4 = 285Hz</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            global.PlayRate = 1.00986363636;
            updatePitch(context.playbackObj, global.PlayRate);
            global.Hz = 396;
          }}
          style={styles.container}
        >
          <Text style={styles.hz396}>G4 = 396Hz</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            global.PlayRate = 1.00404545455;
            updatePitch(context.playbackObj, global.PlayRate);
            global.Hz = 417;
          }}
          style={styles.container}
        >
          <Text style={styles.hz417}>G#4 = 417Hz</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            global.PlayRate = 0.98181818181;
            updatePitch(context.playbackObj, global.PlayRate);
            global.Hz = 432;
          }}
          style={styles.container}
        >
          <Text style={styles.hz432}>A4 = 432Hz</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            global.PlayRate = 1;
            updatePitch(context.playbackObj, global.PlayRate);
            global.Hz = 440;
          }}
          style={styles.container}
        >
          <Text style={styles.hz440}>A4 = 440Hz</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            global.PlayRate = 1.00909090909;
            updatePitch(context.playbackObj, global.PlayRate);
            global.Hz = 528;
          }}
          style={styles.container}
        >
          <Text style={styles.hz528}>C5 = 528Hz</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            global.PlayRate = 1.02690909091;
            updatePitch(context.playbackObj, global.PlayRate);
            global.Hz = 639;
          }}
          style={styles.container}
        >
          <Text style={styles.hz639}>D#5 = 639Hz</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            global.PlayRate = 1.00136363636;
            updatePitch(context.playbackObj, global.PlayRate);
            global.Hz = 741;
          }}
          style={styles.container}
        >
          <Text style={styles.hz741}>F#5 = 741Hz</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            global.PlayRate = 1.02575;
            updatePitch(context.playbackObj, global.PlayRate);
            global.Hz = 852;
          }}
          style={styles.container}
        >
          <Text style={styles.hz852}>G#5 = 852Hz</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            global.PlayRate = 0.9749090909;
            updatePitch(context.playbackObj, global.PlayRate);
            global.Hz = 963;
          }}
          style={styles.container}
        >
          <Text style={styles.hz963}>B5 = 963Hz</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

const ChangeRate174 = () => {
  console.log('hey')
  global.PlayRate = 0.99654545454;
}

const styles = StyleSheet.create({
  topText: {
    fontSize: 34,
    textAlign: "center",
    padding: 10,
    paddingTop: 0,
  },
  hz417: {
    fontWeight: "bold",
    fontSize: 14,
  },
  container: {
    padding: 15,
    backgroundColor: color.PLAYLIST_BG,
    borderRadius: 5,
  },
  hz174: {
    fontWeight: "bold",
    fontSize: 14,
  },
  Hz285: {
    fontWeight: "bold",
    fontSize: 14,
  },
  hz396: {
    fontWeight: "bold",
    fontSize: 14,
  },
  hz432: {
    fontWeight: "bold",
    fontSize: 14,
  },
  hz440: {
    color: "black",
    fontWeight: "bold",
    fontSize: 14,
  },
  hz528: {
    fontWeight: "bold",
    fontSize: 14,
  },
  hz639: {
    fontWeight: "bold",
    fontSize: 14,
  },
  hz741: {
    fontWeight: "bold",
    fontSize: 14,
  },
  hz852: {
    fontWeight: "bold",
    fontSize: 14,
  },
  hz963: {
    fontWeight: "bold",
    fontSize: 14,
  },
});
//export {PlayRate};

export default Settings;
