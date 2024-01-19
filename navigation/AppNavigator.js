import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import AudioList from '../screens/AudioList';
import Player from '../screens/Player';
import Playlist from '../screens/Playlist';
import PlayListDetail from '../screens/PlayListDetail';
import Settings from '../screens/Settings';
import { MaterialIcons, FontAwesome5, Ionicons } from '@expo/vector-icons';
import color from '../misc/color';
import { createStackNavigator } from '@react-navigation/stack';

const Tab = createBottomTabNavigator()
const Stack = createStackNavigator();

const PlayListScreen = () => {
  return (<Stack.Navigator screenOptions={{headerShown: false, animationEnabled: false}}>
    <Stack.Screen name = 'Playlist' component={Playlist}/>
    <Stack.Screen name = 'PlaylistDetail' component={PlayListDetail}/>
  </Stack.Navigator>)
}


const AppNavigator = () => {
    return (
      <Tab.Navigator screenOptions={{ gestureEnabled: false, animationEnabled: false }}>
        <Tab.Screen
          name="Music"
          component={AudioList}
          options={{
            tabBarIcon: ({ size, color }) => (
              <MaterialIcons name="headset" size={size} color={color} />
            ),
          }}
        />
        <Tab.Screen
          name="Player"
          component={Player}
          options={{
            tabBarIcon: ({ size, color }) => (
              <FontAwesome5 name="compact-disc" size={size} color={color} />
            ),
          }}
        />
        <Tab.Screen
          name="Playlist"
          component={PlayListScreen}
          options={{
            tabBarIcon: ({ size, color }) => (
              <MaterialIcons name="library-music" size={size} color={color} />
            ),
          }}
        />
        <Tab.Screen
          name="Settings"
          component={Settings}
          options={{
            tabBarIcon: ({ size, color }) => (
              <Ionicons name="ios-settings-outline" size={size} color={color} />
            ),
          }}
        />
      </Tab.Navigator>
    );
}



export default AppNavigator;