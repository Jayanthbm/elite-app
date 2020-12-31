import {Image, StyleSheet, View} from 'react-native';

import React from 'react';

let LogoSrc = require('../assets/logo.jpg');
const Logo = () => {
  return (
    <View style={styles.logoWrapper}>
      <Image style={styles.logo} source={LogoSrc} />
    </View>
  );
};

export default Logo;

const styles = StyleSheet.create({
  logoWrapper: {
    flex: 1,
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 20,
  },
  logo: {
    height: 180,
    width: 250,
  },
});
