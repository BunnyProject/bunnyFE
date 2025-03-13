import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { View, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { RootStackParamList } from '../types/types';
import { StackNavigationProp } from '@react-navigation/stack';

type HeaderNavigationProp = StackNavigationProp<RootStackParamList, 'MoreScreen'>;

const Header = () => {

  const navigation = useNavigation<HeaderNavigationProp>();

  return (
    <View style={styles.headerContainer}>
      <View style={styles.leftSpace} />

      <View style={styles.logoContainer}>
        <Image source={require('../assets/logo.png')} style={styles.logo} />
      </View>
      <TouchableOpacity
        style={styles.menuButton}
        onPress={() => navigation.navigate('MoreScreen')}
      >
        <Image source={require('../assets/menu.png')} style={styles.menuIcon} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    height: 60,
    backgroundColor: '#fff',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
  },
  leftSpace: {
    flex: 1,
  },
  logoContainer: {
    flex: 3,
    alignItems: 'center',
  },
  logo: {
    width: 120,
    height: 40, 
    resizeMode: 'contain',
  },
  menuButton: {
    flex: 1,
    alignItems: 'flex-end',
  },
  menuIcon: {
    width: 20,
    height: 20,
    resizeMode: 'contain',
  },
});

export default Header;
