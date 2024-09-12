import React from 'react';
import {View, Text, Image, TouchableOpacity, StyleSheet} from 'react-native';
import {StackNavigationProp} from '@react-navigation/stack';
import {RootStackParamList} from '../navigation/MainNavigation';

// 네비게이션 타입 정의
type LandingScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  'Landing'
>;

type Props = {
  navigation: LandingScreenNavigationProp;
};

const LandingScreen: React.FC<Props> = ({navigation}) => {
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
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('UserInfo')}>
        <Text style={styles.buttonText}>시작하기</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between', // 상단 콘텐츠와 하단 버튼 사이의 공간 유지
    alignItems: 'center',
    backgroundColor: '#ffffff',
    paddingVertical: 80,
  },
  content: {
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#98A2FF',
    marginTop: 70,
    textAlign: 'center',
  },
  logo: {
    width: 70,
  },
  subtitle: {
    fontSize: 14,
    color: '#B3B3B3',
    textAlign: 'center',
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
