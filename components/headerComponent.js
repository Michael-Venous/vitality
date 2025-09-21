import { Image, StyleSheet, View } from 'react-native';

const Header = () => {
  return (
    <View style={styles.logoContainer}>
      <View style={styles.blueCircle} />
      <Image
        source={require('../assets/images/vitalitylogo.png')}
        style={styles.logo}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  logoContainer: {
    width: 60,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  blueCircle: {
    position: 'absolute',
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#1a3f5fff',
    opacity: 0.3,
  },
  logo: {
    width: 50,
    height: 50,
    resizeMode: 'contain',
    zIndex: 1,
  },
});

export default Header;