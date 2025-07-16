import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { enableScreens } from 'react-native-screens';  // 여기에 추가
import MainNavigator from './src/navigation/MainNavigation';
import AsyncStorage from '@react-native-async-storage/async-storage';

enableScreens();

const App: React.FC = () => {
  useEffect(() => {
    // clearAsyncStorage();
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