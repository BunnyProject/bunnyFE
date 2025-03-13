import React, { useEffect, useState } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { RootStackParamList } from '../types/types';

// 네비게이션 타입 정의
type LandingScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  'Landing'
>;

type Props = {
  navigation: LandingScreenNavigationProp;
};

const LandingScreen: React.FC<Props> = ({ navigation }) => {
  const [isLoading, setIsLoading] = useState(true); // 로딩 상태
  const [isUserCreated, setIsUserCreated] = useState<boolean | null>(null); // 사용자 생성 여부
  const logStoredData = async () => {
    try {
      // await AsyncStorage.clear();
      const keys = await AsyncStorage.getAllKeys(); // 모든 키 가져오기
      const data = await AsyncStorage.multiGet(keys); // 모든 키의 값 가져오기
      console.log('AsyncStorage Data:', data); // 콘솔에 출력
    } catch (e) {
      console.error('Failed to load AsyncStorage data', e);
    }
  };
  
  useEffect(() => {
    logStoredData();
    const checkUserState = async () => {
      try {
        const userCreated = await AsyncStorage.getItem('isUserCreated');
        setIsUserCreated(userCreated === 'true');
      } catch (e) {
        console.error('Failed to check user state:', e);
        setIsUserCreated(false); // 에러 발생 시 기본값으로 이동
      } finally {
        setIsLoading(false); // 로딩 종료
      }
    };

    checkUserState();
  }, []);

  // 로딩 중에는 로딩 상태 표시
  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>로딩 중...</Text>
      </View>
    );
  }

  const handleStart = () => {
    if (isUserCreated) {
      navigation.replace('Home');
    } else {
      navigation.replace('UserInfo');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        안녕하세요. {'\n'}
        버니입니다
      </Text>
      <Image source={require('../assets/logo.png')} style={styles.logo} />
      <Text style={styles.subtitle}>
        버니와 함께 지금 벌고 있는 돈을 {'\n'} 확인해 볼까요?
      </Text>
      <TouchableOpacity style={styles.button} onPress={handleStart}>
        <Text style={styles.buttonText}>시작하기</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    paddingVertical: 80,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffffff',
  },
  loadingText: {
    fontSize: 18,
    color: '#B3B3B3',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#98A2FF',
    marginTop: 50,
    textAlign: 'center',
  },
  logo: {
    width: 70,
    marginTop: -50,
  },
  subtitle: {
    fontSize: 14,
    color: '#B3B3B3',
    textAlign: 'center',
    marginTop: -70,
  },
  button: {
    backgroundColor: '#98A2FF',
    borderRadius: 24,
    paddingVertical: 15,
    paddingHorizontal: 40,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
});

export default LandingScreen;
