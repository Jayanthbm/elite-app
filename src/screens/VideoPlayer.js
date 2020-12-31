import React, {useState, useEffect, useRef} from 'react';
import {
  TouchableOpacity,
  TVEventHandler,
  BackHandler,
  StyleSheet,
  View,
} from 'react-native';
import {Button, Text} from 'native-base';
import {navigate} from '../navigationRef';
import Loader from '../components/Loader';
import * as CC from '../constants.js';
import AsyncStorage from '@react-native-community/async-storage';
import axios from 'axios';
import Video from 'react-native-video';
import MediaControls, {PLAYER_STATES} from 'react-native-media-controls';
import DeviceInfo from 'react-native-device-info';
const noop = () => {};
const VideoPlayer = ({navigation}) => {
  //Video ref
  const vP = useRef(null);
  const deviceType = DeviceInfo.getDeviceType();
  //Props from Home Screen
  const videoArray = navigation.state.params.videoArray;
  const videoNames = navigation.state.params.videoNames;
  const videoIds = navigation.state.params.videoIds;
  //Loading State
  const [isLoading, setIsLoading] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(
    navigation.state.params.videoIndex,
  );
  //VideoPlayer
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  // eslint-disable-next-line no-unused-vars
  const [isFullScreen, setIsFullScreen] = useState(true);
  const [playerState, setPlayerState] = useState(PLAYER_STATES.PLAYING);
  const [paused, setPaused] = useState(false);
  useEffect(() => {
    setIsLoading(true);
    async function updateVideo() {
      const token = await AsyncStorage.getItem('@token');
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      let url = CC.VHIT + videoIds[currentIndex];
      await axios.get(url, config);
    }
    updateVideo();
    setIsLoading(false);
  }, [videoIds, currentIndex]);
  //Backhandler
  const backAction = () => {
    navigate('HomeScreen');
    return true;
  };
  function _controller(control) {
    if (control === 'next') {
      if (currentIndex === videoArray.length - 1) {
        setCurrentIndex(0);
      } else {
        setCurrentIndex(currentIndex + 1);
      }
    }
    if (control === 'prev') {
      if (currentIndex === 0) {
        setCurrentIndex(0);
      } else {
        setCurrentIndex(currentIndex - 1);
      }
    }
    if (control === 'pp') {
      setPaused(!paused);
    }
  }
  //Tv Event Handler
  let _tvEventHandler = new TVEventHandler();
  function _enableTVEventHandler() {
    _tvEventHandler.enable(this, function (cmp, evt) {
      if (evt && evt.eventType === 'right') {
        _controller('next');
      } else if (evt && evt.eventType === 'up') {
        backAction();
      } else if (evt && evt.eventType === 'left') {
        _controller('prev');
      } else if (evt && evt.eventType === 'rewind') {
        _controller('prev');
      } else if (evt && evt.eventType === 'down') {
        backAction();
      } else if (evt && evt.eventType === 'playPause') {
        _controller('pp');
      }
    });
  }
  function _disableTVEventHandler() {
    if (_tvEventHandler) {
      _tvEventHandler.disable();
    }
  }
  useEffect(() => {
    _enableTVEventHandler();
    return () => _disableTVEventHandler();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction,
    );

    return () => backHandler.remove();
  }, []);

  const onSeek = (seek) => {
    vP?.current.seek(seek);
  };

  const onPaused = (playerstate) => {
    setPaused(!paused);
    setPlayerState(playerstate);
  };

  const onReplay = () => {
    setPlayerState(PLAYER_STATES.PLAYING);
    vP?.current.seek(0);
  };

  const onProgress = (data) => {
    if (!isLoading) {
      setCurrentTime(data.currentTime);
    }
  };

  const onLoad = (data) => {
    setDuration(data.duration);
    setIsLoading(false);
  };

  const onEnd = () => {
    _controller('next');
  };

  const onSeeking = (currenttime) => setCurrentTime(currenttime);
  return (
    <React.Fragment>
      {isLoading && isLoading === true ? (
        <Loader text="Loading Video" status={true} />
      ) : (
        <React.Fragment>
          <TouchableOpacity />
          <View style={styles.container}>
            <Video
              ref={(ref) => (vP.current = ref)}
              paused={paused}
              repeat={false}
              resizeMode="cover"
              source={{
                uri: videoArray[currentIndex],
              }}
              volume={1.0}
              onLoad={onLoad}
              onProgress={onProgress}
              onEnd={onEnd}
              style={styles.mediaPlayer}
            />
            <MediaControls
              mainColor="orange"
              isLoading={isLoading}
              isFullScreen={isFullScreen}
              progress={currentTime}
              duration={duration}
              playerState={playerState}
              onFullScreen={noop}
              onPaused={onPaused}
              onReplay={onReplay}
              onSeek={onSeek}
              onSeeking={onSeeking}
              showOnStart={false}>
              <MediaControls.Toolbar>
                <View style={styles.toolbar}>
                  <Text>{videoNames[currentIndex]} </Text>
                </View>
              </MediaControls.Toolbar>
            </MediaControls>
          </View>
          {deviceType === 'Handset' ||
            deviceType === 'Tablet' ||
            (deviceType === 'unknown' && (
              <View style={styles.buttonWrapper}>
                <>
                  <Button
                    title="Prev"
                    onPress={() => {
                      _controller('prev');
                    }}
                  />
                  <Button
                    title="Next"
                    onPress={() => {
                      _controller('next');
                    }}
                  />
                  <Button
                    title="Play/Pause"
                    onPress={() => {
                      _controller('pp');
                    }}
                  />
                  <Button
                    title="HOME"
                    onPress={() => {
                      navigate('HomeScreen');
                    }}
                  />
                </>
              </View>
            ))}
        </React.Fragment>
      )}
    </React.Fragment>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  toolbar: {
    marginTop: 30,
    backgroundColor: 'white',
    padding: 10,
    borderRadius: 5,
  },
  mediaPlayer: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
    backgroundColor: 'black',
  },
  buttonWrapper: {
    flexDirection: 'row',
    alignSelf: 'center',
    marginTop: 5,
  },
});
export default VideoPlayer;
