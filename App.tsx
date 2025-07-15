import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { enableScreens } from 'react-native-screens';  // 여기에 추가
import MainNavigator from './src/navigation/MainNavigation';
import AsyncStorage from '@react-native-async-storage/async-storage';

// 네이티브 화면 처리 성능 향상을 위해 enableScreens 호출
enableScreens();

const App: React.FC = () => {
  useEffect(() => {
    // 앱 실행 시 초기화
    clearAsyncStorage();
  }, []);
  return (
    <NavigationContainer>
      <MainNavigator />
    </NavigationContainer>
  );
};

export default App;
const clearAsyncStorage = async () => {
  try {
    await AsyncStorage.clear();
    console.log('✅ AsyncStorage 초기화 완료');
  } catch (e) {
    console.error('❌ AsyncStorage 초기화 실패:', e);
  }
};