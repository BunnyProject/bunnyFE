import React, {useEffect, useRef} from 'react';
import {View, Image, Text, StyleSheet, Animated, Easing} from 'react-native';
import {StackNavigationProp} from '@react-navigation/stack';
import {RootStackParamList} from '../navigation/MainNavigation';

type LoadingScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  'Loading'
>;

type Props = {
  navigation: LoadingScreenNavigationProp;
};

const LoadingScreen = ({navigation}: Props) => {
  // 애니메이션 값 생성
  const spinValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // 애니메이션 반복 재생
    Animated.loop(
      Animated.timing(spinValue, {
        toValue: 1,
        duration: 2000,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    ).start();

    // 3초 후 결과 페이지로 이동
    const timer = setTimeout(() => {
      navigation.navigate('Result');
    }, 30000);
    return () => {
      clearTimeout(timer);
    };
  }, [navigation, spinValue]);

  // 애니메이션 회전 값 설정
  const spin = spinValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <View style={styles.container}>
      <Text style={styles.text}>
        홍길동 님의 기본급으로  {'\n'} 지금 벌고 계신 돈을  {'\n'} 계산해볼게요!
      </Text>
      <View style={styles.logoContainer}>
        <Animated.View
          style={[styles.spinner, {transform: [{rotate: spin}]}]}
        >
          <View style={styles.circle} />
        </Animated.View>
        <Image source={require('../assets/logo.png')} style={styles.logo} />
      </View>
      <Text style={styles.subText}>잠시만 기다려주세요</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  text: {
    fontSize: 18,
    color: '#8c9eff',
    textAlign: 'center',
    marginBottom: 20,
  },
  subText: {
    fontSize: 14,
    color: '#aaa',
    textAlign: 'center',
    marginTop: 20,
  },
  logoContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  logo: {
    width: 70,
    height: 70,
    position: 'absolute',
    zIndex: 1,
  },
  spinner: {
    width: 140, // 스피너 크기 (로고 주위를 감쌈)
    height: 140, // 스피너 크기 (로고 주위를 감쌈)
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
  },
  circle: {
    width: 100, // 원형 스피너의 크기 (로고와의 간격 조정)
    height: 100, // 원형 스피너의 크기 (로고와의 간격 조정)
    borderWidth: 5,
    borderRadius: 50, // 원형을 만들기 위해 반지름을 절반으로 설정
    borderColor: '#8c9eff', // 스피너 색상
    borderStyle: 'dashed', 
  },
});

export default LoadingScreen;
