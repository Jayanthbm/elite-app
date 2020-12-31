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
  Form,
  Item,
  Input,
  Toast,
} from 'native-base';
import {BackHandler, Alert} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import * as CC from '../constants.js';
import Loader from '../components/Loader';
import DeviceInfo from 'react-native-device-info';
import axios from 'axios';
import InlineKeyboard from 'react-native-inline-keyboard';
import HomeScreen from './HomeScreen.js';
import Logo from '../components/Logo';
const LoginScreen = ({navigation}) => {
  const [loading, setLoading] = useState(false);
  const [storeId, setStoreId] = useState('');
  const [password, setPassword] = useState('');
  const [loggedIn, SetLoggedIn] = useState(false);
  const devicetype = DeviceInfo.getDeviceType();
  const [storeIdFocus, setStoreIdFocus] = useState(false);
  const [storepassFocus, setStorePassFocus] = useState(false);
  const [lbfocus, setLbfocus] = useState(false);
  const [storeIdModel, setStoreIdModel] = useState(false);
  const [storePassModel, setStorePassModel] = useState(false);
  const focusstyle = {
    borderColor: 'red',
    borderWidth: 1,
  };
  const normalstyle = {
    borderColor: 'none',
    marginBottom: '2%',
  };
  const Login = async () => {
    setLoading(true);
    try {
      if (storeId && password) {
        let res = await axios.post(CC.LOGIN, {
          storeId: storeId,
          password: password,
        });
        if (res.data.status === 'Success') {
          let token = res.data.token;
          await AsyncStorage.setItem('@token', token);
          setLoading(false);
          SetLoggedIn(true);
        } else {
          setLoading(false);
          Toast.show({
            text: 'Invalid Credentials',
            type: 'danger',
          });
        }
      } else {
        setLoading(false);
        Toast.show({
          text: 'Enter StoreId and Password',
          type: 'danger',
        });
      }
    } catch (error) {
      setLoading(false);
      Toast.show({
        text: 'Invalid Credentials',
        type: 'danger',
      });
    }
  };
  useEffect(() => {
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

    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction,
    );

    return () => backHandler.remove();
  }, []);
  return (
    <React.Fragment>
      {loggedIn && loggedIn === true ? (
        <HomeScreen />
      ) : (
        <React.Fragment>
          {loading && loading === true ? (
            <React.Fragment>
              <Loader text="Logging In.." status={true} />
            </React.Fragment>
          ) : (
            <React.Fragment>
              <Container>
                <Header>
                  <Left />
                  <Body>
                    <Title>Elite Login</Title>
                  </Body>
                  <Right />
                </Header>
                <Content>
                  <Logo />
                  {devicetype && devicetype === 'Tv' ? (
                    <React.Fragment>
                      <Content
                        style={{
                          marginTop: '10%',
                        }}>
                        <Content
                          style={
                            storeIdFocus && storeIdFocus === true
                              ? focusstyle
                              : normalstyle
                          }>
                          <Button
                            block
                            bordered
                            onPress={() => {
                              setStorePassModel(false);
                              setStoreIdFocus(false);
                              setStorePassFocus(false);
                              setStoreIdModel(true);
                            }}
                            onFocus={() => {
                              setStoreIdFocus(true);
                            }}
                            onBlur={() => {
                              setStoreIdFocus(false);
                            }}>
                            <Text>
                              {storeId && storeId.length > 0
                                ? storeId
                                : 'Enter Store Id'}
                            </Text>
                          </Button>
                          {storeIdModel && storeIdModel === true && (
                            <React.Fragment>
                              <InlineKeyboard
                                value={storeId}
                                onChange={(text) => setStoreId(text)}
                              />
                            </React.Fragment>
                          )}
                        </Content>
                        <Content
                          style={
                            storepassFocus && storepassFocus === true
                              ? focusstyle
                              : normalstyle
                          }>
                          <Button
                            block
                            bordered
                            onPress={() => {
                              setStoreIdModel(false);
                              setStoreIdFocus(false);
                              setStorePassFocus(false);
                              setStorePassModel(true);
                            }}
                            onFocus={() => {
                              setStorePassFocus(true);
                            }}
                            onBlur={() => {
                              setStorePassFocus(false);
                            }}>
                            <Text>
                              {password && password.length > 0
                                ? password
                                : 'Enter Password'}
                            </Text>
                          </Button>
                          {storePassModel && storePassModel === true && (
                            <React.Fragment>
                              <InlineKeyboard
                                value={password}
                                onChange={(text) => setPassword(text)}
                              />
                            </React.Fragment>
                          )}
                        </Content>
                        <Content
                          style={
                            lbfocus && lbfocus === true
                              ? focusstyle
                              : normalstyle
                          }>
                          <Button
                            block
                            success
                            onPress={Login}
                            onFocus={() => {
                              setLbfocus(true);
                            }}
                            onBlur={() => {
                              setLbfocus(false);
                            }}>
                            <Text>Login</Text>
                          </Button>
                        </Content>
                      </Content>
                    </React.Fragment>
                  ) : (
                    <React.Fragment>
                      <Form>
                        <Item>
                          <Input
                            placeholder="StoreId"
                            value={storeId}
                            autoCapitalize={'none'}
                            autoCompleteType={'off'}
                            autoCorrect={false}
                            autoFocus={true}
                            onChangeText={(text) => setStoreId(text)}
                          />
                        </Item>
                        <Item last>
                          <Input
                            placeholder="Password"
                            value={password}
                            autoCapitalize={'none'}
                            autoCompleteType={'off'}
                            autoCorrect={false}
                            secureTextEntry={true}
                            onChangeText={(text) => setPassword(text)}
                          />
                        </Item>
                      </Form>
                      <Button
                        block
                        success
                        onPress={() => {
                          Login();
                        }}>
                        <Text>Login</Text>
                      </Button>
                    </React.Fragment>
                  )}
                </Content>
              </Container>
            </React.Fragment>
          )}
        </React.Fragment>
      )}
    </React.Fragment>
  );
};

export default LoginScreen;
