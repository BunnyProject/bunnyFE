import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {Image} from 'react-native'; // Image 추가
import LandingScreen from '../screens/LandingScreen';
import UserInfoScreen from '../screens/UserInfoScreen';
import UserInfo2Screen from '../screens/UserInfo2Screen';
import ResultScreen from '../screens/ResultScreen';
import LoadingScreen from '../screens/LoadingScreen';
import HomeScreen from '../screens/HomeScreen';
import Header from '../components/Header';
import BunnyScreen from '../screens/BunnyScreen';

// 이미지 경로 불러오기
const bunnyIcon = require('../assets/bunny.png');
const savingIcon = require('../assets/Akki.png');
const homeIcon = require('../assets/Home.png');

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
  Bunny: undefined;
};

const Stack = createStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator();

const HomeTabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({route}) => ({
        tabBarIcon: ({color, size}) => {
          let iconSource;
          let iconSize = size;
          if (route.name === 'Home') {
            iconSource = homeIcon; // 홈 탭 아이콘
            iconSize = 25;
          } else if (route.name === 'Bunny') {
            iconSource = bunnyIcon; // bunny.png 아이콘 설정
            iconSize = 30; // 아이콘 크기
          } else if (route.name === 'Saving') {
            iconSource = savingIcon; // Akki.png 아이콘 설정
            iconSize = 30; // 아이콘 크기
          }
          return (
            <Image
              source={iconSource}
              style={{width: iconSize, height: iconSize, tintColor: color}}
              resizeMode="contain"
            />
          );
        },
        tabBarActiveTintColor: '#98A2FF',
        tabBarInactiveTintColor: '#B7B7B7',
        tabBarStyle: {
          height: 70,
          paddingBottom: 10,
          borderTopLeftRadius: 35, // 왼쪽 상단 모서리 둥글게
          borderTopRightRadius: 35, // 오른쪽 상단 모서리 둥글게
          // overflow: 'hidden',
        },
        tabBarLabelStyle: {
          fontSize: 12,
          marginBottom: 5,
        },
      })}>
      <Tab.Screen
        name="Bunny"
        component={BunnyScreen}
        options={{title: '버니'}}
      />
      <Tab.Screen name="Home" component={HomeScreen} options={{title: '홈'}} />
      <Tab.Screen
        name="Saving"
        component={HomeScreen}
        options={{title: '아끼기'}}
      />
    </Tab.Navigator>
  );
};

const MainNavigator: React.FC = () => {
  return (
    <Stack.Navigator initialRouteName="Landing">
      <Stack.Screen
        name="Landing"
        component={LandingScreen}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="UserInfo"
        component={UserInfoScreen}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="UserInfo2"
        component={UserInfo2Screen}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="UserInfo3"
        component={UserInfo2Screen}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="Loading"
        component={LoadingScreen}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="Result"
        component={ResultScreen}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="Home"
        component={HomeTabNavigator}
        options={{
          header: () => <Header />,
          headerTitle: '', // 제목을 빈 문자열로 설정
        }}
      />
      <Stack.Screen
        name="Bunny"
        component={HomeTabNavigator}
        options={{
          header: () => <Header />,
          headerTitle: '', // 제목을 빈 문자열로 설정
        }}
      />
    </Stack.Navigator>
  );
};

export default MainNavigator;
