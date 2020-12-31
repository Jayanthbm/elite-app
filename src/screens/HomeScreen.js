/* eslint-disable react-native/no-inline-styles */
import React, {useState, useEffect} from 'react';

import {
  Container,
  Header,
  Left,
  Body,
  Title,
  Right,
  Button,
  Text,
  Content,
  Toast,
  List,
  ListItem,
  Icon,
  Card,
  CardItem,
} from 'native-base';
import {
  TouchableWithoutFeedback,
  TVEventHandler,
  BackHandler,
  Alert,
} from 'react-native';
import {navigate} from '../navigationRef';
import AsyncStorage from '@react-native-community/async-storage';
import * as CC from '../constants.js';
import Loader from '../components/Loader';
import axios from 'axios';
import Logo from '../components/Logo';
const HomeScreen = ({navigation}) => {
  const [loading, setLoading] = useState(null);
  const [vfiles, setVfiles] = useState(null);
  const [videoArray, setVideoArray] = useState(null);
  const [videoNames, setVideoNames] = useState(null);
  const [videoIds, setVideoIds] = useState(null);
  const [sv, setSv] = useState(null);
  useEffect(() => {
    setLoading(true);
    async function fetchVideos() {
      try {
        const token = await AsyncStorage.getItem('@token');
        const config = {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        };
        let url = CC.VIDEOS;
        let res = await axios.get(url, config);
        if (res.data.videos.length > 0) {
          setVfiles(null);
          setVideoArray(null);
          setVfiles(res.data.videos);
          setLoading(false);
        } else {
          setLoading(false);
          Toast.show({
            text: 'No Videos to show',
            buttonText: 'Okay',
            position: 'top',
          });
        }
      } catch (error) {
        Toast.show({
          text: 'No Videos to show',
          buttonText: 'Okay',
          position: 'top',
        });
        setLoading(false);
      }
    }
    fetchVideos();
  }, []);

  const backAction = () => {
    Alert.alert('Wait!', 'Do you want to Exit??', [
      {
        text: 'Cancel',
        onPress: () => null,
        style: 'cancel',
      },
      {text: 'YES', onPress: () => BackHandler.exitApp()},
    ]);
    return true;
  };
  useEffect(() => {
    let _tvEventHandler = new TVEventHandler();
    function _enableTVEventHandler() {
      _tvEventHandler.enable(this, function (cmp, evt) {
        if (evt && evt.eventType === 'right') {
          // console.log('right');
        } else if (evt && evt.eventType === 'up') {
          // console.log('up');
        } else if (evt && evt.eventType === 'left') {
          // console.log('left');
        } else if (evt && evt.eventType === 'down') {
          // console.log('down');
        } else if (evt && evt.eventType === 'playPause') {
          // console.log('playPause');
        }
      });
    }
    function _disableTVEventHandler() {
      if (_tvEventHandler) {
        _tvEventHandler.disable();
      }
    }
    _enableTVEventHandler();
    return () => _disableTVEventHandler();
  }, []);
  useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction,
    );

    return () => backHandler.remove();
  }, []);
  if (vfiles) {
    if (videoArray === null) {
      const keys = Object.keys(vfiles);
      let vArray = [];
      let vNames = [];
      let vIds = [];
      for (const key of keys) {
        vArray.push(vfiles[key].location);
        vNames.push(vfiles[key].videoName);
        vIds.push(vfiles[key].videoId);
      }
      setVideoArray(vArray);
      setVideoNames(vNames);
      setVideoIds(vIds);
    }
  }
  const removeData = async () => {
    try {
      await AsyncStorage.removeItem('@token');
    } catch (e) {
      // console.log(e);
    }
  };
  async function Logout() {
    removeData();
    return navigate('LoginScreen');
  }
  return (
    <React.Fragment>
      {loading && loading === true ? (
        <Loader text="Loading Videos.." status={true} />
      ) : (
        <React.Fragment>
          <Container>
            <Header>
              <Left />
              <Body>
                <Title>ELite Ads</Title>
              </Body>
              <Right>
                <Button danger onPress={Logout}>
                  <Text> Logout </Text>
                </Button>
              </Right>
            </Header>
            <Content>
              <Logo />
              {videoArray && videoArray.length > 0 ? (
                <React.Fragment>
                  <Button
                    block
                    success
                    large
                    onPress={() => {
                      navigate('VideoPlayer', {
                        videoArray,
                        videoNames,
                        videoIndex: 0,
                        videoIds,
                      });
                    }}>
                    <Text>Start Playing</Text>
                  </Button>
                  <Text />
                  <Card>
                    <CardItem header bordered>
                      <Text>Videos List</Text>
                    </CardItem>
                  </Card>
                  <Text />
                </React.Fragment>
              ) : (
                <React.Fragment>
                  <CardItem header bordered>
                    <Text>No Videos Found</Text>
                  </CardItem>
                </React.Fragment>
              )}
              <List>
                {videoArray &&
                  videoArray.map((vid, i) => (
                    <TouchableWithoutFeedback
                      key={i + videoNames[i]}
                      onPress={() => {
                        navigate('VideoPlayer', {
                          videoArray,
                          videoNames,
                          videoIndex: i,
                          videoIds,
                        });
                      }}
                      onFocus={() => {
                        setSv(i);
                      }}
                      onBlur={() => {
                        setSv(null);
                      }}>
                      <ListItem icon key={i} selected={sv === i ? true : false}>
                        <Left>
                          <Button style={{backgroundColor: '#FF9501'}}>
                            <Icon active name="videocam" />
                          </Button>
                        </Left>
                        <Body>
                          <Text>{videoNames[i]}</Text>
                        </Body>
                        <Right />
                      </ListItem>
                    </TouchableWithoutFeedback>
                  ))}
              </List>
            </Content>
          </Container>
        </React.Fragment>
      )}
    </React.Fragment>
  );
};
export default HomeScreen;
