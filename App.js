import React from 'react';
import {createAppContainer, createSwitchNavigator} from 'react-navigation';
import {Root} from 'native-base';
import {setNavigator} from './src/navigationRef';
import EmptyScreen from './src/screens/EmptyScreen.js';
import LoginScreen from './src/screens/LoginScreen';
import HomeScreen from './src/screens/HomeScreen.js';
import VideoPlayer from './src/screens/VideoPlayer';

const switchNavigator = createSwitchNavigator({
  EmptyScreen: EmptyScreen,
  LoginScreen: LoginScreen,
  HomeScreen: HomeScreen,
  VideoPlayer: VideoPlayer,
});

const App = createAppContainer(switchNavigator);

export default () => (
  <Root>
    <App
      ref={(navigator) => {
        setNavigator(navigator);
      }}
    />
  </Root>
);
