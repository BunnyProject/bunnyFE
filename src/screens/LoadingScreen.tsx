import React, {useEffect, useRef} from 'react';
import {View, Image, Text, StyleSheet, Animated} from 'react-native';
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
  const fadeValue1 = useRef(new Animated.Value(0)).current;
  const fadeValue2 = useRef(new Animated.Value(0)).current;
  const fadeValue3 = useRef(new Animated.Value(0)).current;
  const fadeValue4 = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // 각각의 dot에 대해 페이드 인/아웃 애니메이션 설정
    const animateDot = (fadeValue: Animated.Value, delay: number) => {
      return Animated.loop(
        Animated.sequence([
          Animated.timing(fadeValue, {
            toValue: 1,
            duration: 500,
            delay: delay,
            useNativeDriver: true,
          }),
          Animated.timing(fadeValue, {
            toValue: 0,
            duration: 500,
            useNativeDriver: true,
          }),
        ])
      ).start();
    };

    // 각 dot에 애니메이션 적용, 각각의 delay를 다르게 줘서 순차적 페이드
    animateDot(fadeValue1, 400);
    animateDot(fadeValue2, 500); // 0.25초 지연
    animateDot(fadeValue3, 600); // 0.5초 지연
    animateDot(fadeValue4, 700); // 0.75초 지연

    // 3초 후 결과 페이지로 이동
    const timer = setTimeout(() => {
      navigation.navigate('Result');
    }, 3000);

    return () => {
      clearTimeout(timer);
    };
  }, [navigation, fadeValue1, fadeValue2, fadeValue3, fadeValue4]);

  return (
    <View style={styles.container}>
      <Text style={styles.text}>
        홍길동 님의 기본급으로 {'\n'} 지금 벌고 계신 돈을 {'\n'} 계산해볼게요!
      </Text>
      <View style={styles.logoContainer}>
        <Image source={require('../assets/logo.png')} style={styles.logo} />
        <View style={styles.dotContainer}>
          <Animated.View style={{opacity: fadeValue1}}>
            <Text style={styles.dot}>●</Text>
          </Animated.View>
          <Animated.View style={{opacity: fadeValue2}}>
            <Text style={styles.dot}>●</Text>
          </Animated.View>
          <Animated.View style={{opacity: fadeValue3}}>
            <Text style={styles.dot}>●</Text>
          </Animated.View>
          <Animated.View style={{opacity: fadeValue4}}>
            <Text style={styles.dot}>●</Text>
          </Animated.View>
        </View>
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
    padding: 20,
  },
  text: {
    fontSize: 18,
    color: '#8c9eff',
    textAlign: 'center',
    marginBottom: 70,
  },
  subText: {
    fontSize: 14,
    color: '#aaa',
    textAlign: 'center',
    marginTop: 20,
  },
  logoContainer: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  logo: {
    width: 80,
    height: 100,
    marginBottom: 20,
    position: 'relative',
  },
  dotContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  dot: {
    fontSize: 30,
    color: '#8c9eff',
    marginHorizontal: 5,
  },
});

export default LoadingScreen;
