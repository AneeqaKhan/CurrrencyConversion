import React, { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import FastImage from 'react-native-fast-image';
import SplashScreen from 'react-native-splash-screen';

const SplashScreenComponent: React.FC = () => {
  // useEffect(() => {
  //   setTimeout(() => {
  //     SplashScreen.hide();
  //   }, 5000); // Duration of your splash screen animation (5 seconds)
  // }, []);

  return (
    <View style={styles.container}>
      <FastImage
        style={styles.image}
        source={require('../images/Animation.gif')}
        resizeMode={FastImage.resizeMode.contain}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
  },
  image: {
    width: '50%',
    height: '50%',
  },
});

export default SplashScreenComponent;
