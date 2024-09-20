import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import LandingScreen from '../screens/LandingScreen';
import UserInfoScreen from '../screens/UserInfoScreen';
import UserInfo2Screen from '../screens/UserInfo2Screen';
import ResultScreen from '../screens/ResultScreen';
import LoadingScreen from '../screens/LoadingScreen';
import HomeScreen from '../screens/HomeScreen';

// Stack navigator 타입 정의
export type RootStackParamList = {
  Landing: undefined;
  UserInfo: undefined;
  UserInfo2: undefined;
  UserInfo3: {
    salaryType: string;
    salary: string;
    workDays: string[];
    startTime: string;
    endTime: string;
  };
  Loading: undefined;
  Result: undefined;
  Home: undefined;
};

const Stack = createStackNavigator<RootStackParamList>();

const MainNavigator: React.FC = () => {
  return (
    <Stack.Navigator initialRouteName="Landing">
      <Stack.Screen name="Landing" component={LandingScreen} />
      <Stack.Screen name="UserInfo" component={UserInfoScreen} />
      <Stack.Screen name="UserInfo2" component={UserInfo2Screen} />
      <Stack.Screen name="UserInfo3" component={UserInfo2Screen} />
      <Stack.Screen name="Loading" component={LoadingScreen} />
      <Stack.Screen name="Result" component={ResultScreen} />
      <Stack.Screen name="Home" component={HomeScreen} />
    </Stack.Navigator>
  );
};

export default MainNavigator;
