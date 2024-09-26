import React from 'react';
import { View, Image, StyleSheet, TouchableOpacity } from 'react-native';

const Header = () => {
  return (
    <View style={styles.headerContainer}>
      {/* 왼쪽 빈 공간 */}
      <View style={styles.leftSpace} />

      {/* 가운데 로고 */}
      <View style={styles.logoContainer}>
        <Image source={require('../assets/logo.png')} style={styles.logo} />
      </View>

      {/* 오른쪽 햄버거 메뉴 */}
      <TouchableOpacity
        style={styles.menuButton}
        onPress={() => {
          // 햄버거 메뉴 버튼 클릭 시 동작 정의
          console.log('햄버거 메뉴 클릭됨');
        }}
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
    // borderBottomWidth: 1,
    // borderBottomColor: '#ddd',
    // shadowColor: '#000',
    // shadowOffset: { width: 0, height: 2 },
    // shadowOpacity: 0.1,
    // shadowRadius: 4,
    // elevation: 3, 
  },
  leftSpace: {
    flex: 1,
  },
  logoContainer: {
    flex: 3,
    alignItems: 'center',
  },
  logo: {
    width: 120, // 로고의 너비 설정
    height: 40, // 로고의 높이 설정
    resizeMode: 'contain',
  },
  menuButton: {
    flex: 1,
    alignItems: 'flex-end',
  },
  menuIcon: {
    width: 20, // 햄버거 메뉴 아이콘의 너비 설정
    height: 20, // 햄버거 메뉴 아이콘의 높이 설정
    resizeMode: 'contain',
  },
});

export default Header;
