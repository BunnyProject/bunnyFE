import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { enableScreens } from 'react-native-screens';  // 여기에 추가
import MainNavigator from './navigation/MainNavigation';

// 네이티브 화면 처리 성능 향상을 위해 enableScreens 호출
enableScreens();

const App: React.FC = () => {
  return (
    <NavigationContainer>
      <MainNavigator />
    </NavigationContainer>
  );
};

export default App;
