import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableWithoutFeedback,
} from 'react-native';

const VideoList = (props) => {
  const name = props.name ?? `Video ${props.id}`;
  const [wstyle, setWstyle] = useState({
    marginBottom: 10,
    backgroundColor: '#dbd9de',
  });
  return (
    <TouchableWithoutFeedback
      onPress={props.onPress}
      onFocus={() => {
        setWstyle({
          marginBottom: 10,
          backgroundColor: '#dbd9de',
          borderColor: 'red',
          borderWidth: 2,
          marginLeft: '3%',
          marginRight: '3%',
        });
      }}
      onBlur={() => {
        setWstyle({
          marginBottom: 10,
          backgroundColor: '#dbd9de',
        });
      }}>
      <View style={wstyle}>
        <View style={styles.video}>
          <Image
            style={styles.Icon}
            source={{
              uri: 'https://img.icons8.com/nolan/64/video.png',
            }}
          />
          <View style={styles.InnerWrapper}>
            <Text style={styles.TextStyle}> {name}</Text>
          </View>
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
};
const styles = StyleSheet.create({
  video: {
    flex: 1,
    flexDirection: 'row',
  },
  Icon: {
    width: 100,
    height: 100,
    marginStart: 25,
  },
  InnerWrapper: {
    marginStart: 40,
    marginTop: 30,
  },
  TextStyle: {
    fontSize: 25,
  },
  btn: {},
});
export default VideoList;
