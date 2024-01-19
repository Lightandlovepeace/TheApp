import 'react-native-gesture-handler';
import * as React from 'react';
import 'react-native-reanimated';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { AudioProvider } from './context/AudioProvider';
import AppNavigator from './navigation/AppNavigator';
import color from './misc/color';

const MyTheme = {
  ...DefaultTheme,
  colors: {
    background: "#123",
    primary: "#222",
    card: '#369',
    text: '#770',
    border: "#369",
    notification: "#000",
    //...DefaultTheme.colors,
    background: color.APP_BG,
  }
}

const Tab = createBottomTabNavigator();

// function AudioList() {
//   return (
//     <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
//       <Text>Player</Text>
//     </View>
//   );
// }

// function Player() {
//   return (
//     <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
//       <Text>Player</Text>
//     </View>
//   );
// }

// function Playlist() {
//   return (
//     <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
//       <Text>Player</Text>
//     </View>
//   );
// }


// Sentry.init({
//   dsn: 'https://f93d65cfba359f82a72f180bc0e45f41@o4506134155165696.ingest.sentry.io/4506134224830464',
//   enableInExpoDevelopment: true,
//   debug: true, // If `true`, Sentry will try to print out useful debugging information if something goes wrong with sending the event. Set it to `false` in production
// });


export default function App() {
  return ( 
    <NavigationContainer theme={MyTheme}>
      <AudioProvider>     
        <AppNavigator/>
      </AudioProvider>
    </NavigationContainer>
  );
}