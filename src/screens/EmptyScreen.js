import React, {useState, useEffect} from 'react';
import AsyncStorage from '@react-native-community/async-storage';
import Loader from '../components/Loader';
import HomeScreen from '../screens/HomeScreen';
import LoginScreen from '../screens/LoginScreen';

const EmptyScreen = ({navigation}) => {
  const [loggedIn, setLoggedIn] = useState(null);

  useEffect(() => {
    async function checkLogin() {
      try {
        const token = await AsyncStorage.getItem('@token');
        if (token !== null) {
          setLoggedIn(true);
        } else {
          setLoggedIn(false);
        }
      } catch (error) {
        setLoggedIn(false);
      }
    }
    checkLogin();
  }, []);

  if (loggedIn === null) {
    return <Loader text="Loading.." status={true} />;
  }
  if (loggedIn === true) {
    return <HomeScreen />;
  }
  if (loggedIn === false) {
    return <LoginScreen />;
  }
};

export default EmptyScreen;
