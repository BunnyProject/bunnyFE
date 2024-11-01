import React, { useState } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Image } from 'react-native';
import LandingScreen from '../screens/LandingScreen';
import UserInfoScreen from '../screens/UserInfoScreen';
import UserInfo2Screen from '../screens/UserInfo2Screen';
import ResultScreen from '../screens/ResultScreen';
import LoadingScreen from '../screens/LoadingScreen';
import HomeScreen from '../screens/HomeScreen';
import Header from '../components/Header';
import BunnyScreen from '../screens/BunnyScreen';
import AkkiScreen from '../screens/AkkiScreen';
import IconSelectScreen from '../screens/IconSelectScreen';
import AkkiStartScreen from '../screens/AkkiStartScreen';
import MoreScreen from '../screens/MoreScreen';

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
  Akki: undefined;
  IconSelectScreen: undefined;
  AkkiStartScreen: undefined;
  MoreScreen: undefined;
};

const Stack = createStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator();
const SavingStack = createStackNavigator();

const SavingStackNavigator = () => {
  // const [isFirstSavingClick, setIsFirstSavingClick] = useState(false);
  const [isFirstSavingClick, setIsFirstSavingClick] = useState(true);

  return (
    <SavingStack.Navigator>
      {isFirstSavingClick ? (
        <SavingStack.Screen
          name="AkkiStartScreen"
          component={AkkiStartScreen}
          options={{ headerShown: false }}
          listeners={{
            focus: () => setIsFirstSavingClick(false),
          }}
        />
      ) : (
        <SavingStack.Screen
          name="AkkiScreen"
          component={AkkiScreen}
          options={{ headerShown: false }}
        />
      )}
    </SavingStack.Navigator>
  );
};

const HomeTabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          let iconSource;
          let iconSize = size;

          if (route.name === 'Home') {
            iconSource = homeIcon;
            iconSize = 25;
          } else if (route.name === 'Bunny') {
            iconSource = bunnyIcon;
            iconSize = 30;
          } else if (route.name === 'Saving') {
            iconSource = savingIcon;
            iconSize = 30;
          }
          return (
            <Image
              source={iconSource}
              style={{ width: iconSize, height: iconSize, tintColor: color }}
              resizeMode="contain"
            />
          );
        },
        tabBarActiveTintColor: '#98A2FF',
        tabBarInactiveTintColor: '#B7B7B7',
        tabBarStyle: {
          height: 70,
          paddingBottom: 10,
          borderTopLeftRadius: 35,
          borderTopRightRadius: 35,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          marginBottom: 5,
        },
        headerShown: false,
      })}
    >
      <Tab.Screen name="Bunny" component={BunnyScreen} options={{ title: '버니' }} />
      <Tab.Screen name="Home" component={HomeScreen} options={{ title: '홈' }} />
      <Tab.Screen name="Saving" component={SavingStackNavigator} options={{ title: '아끼기' }} />
    </Tab.Navigator>
  );
};

const MainNavigator: React.FC = () => {
  return (
    <Stack.Navigator initialRouteName="Home">
      <Stack.Screen name="Landing" component={LandingScreen} options={{ headerShown: false }} />
      <Stack.Screen name="UserInfo" component={UserInfoScreen} options={{ headerShown: false }} />
      <Stack.Screen name="UserInfo2" component={UserInfo2Screen} options={{ headerShown: false }} />
      <Stack.Screen name="UserInfo3" component={UserInfo2Screen} options={{ headerShown: false }} />
      <Stack.Screen name="Loading" component={LoadingScreen} options={{ headerShown: false }} />
      <Stack.Screen name="Result" component={ResultScreen} options={{ headerShown: false }} />
      <Stack.Screen
        name="Home"
        component={HomeTabNavigator}
        options={{
          header: () => <Header />,
          headerTitle: '',
        }}
      />
      <Stack.Screen
        name="Bunny"
        component={HomeTabNavigator}
        options={{
          header: () => <Header />,
          headerTitle: '',
        }}
      />
      <Stack.Screen
        name="IconSelectScreen"
        component={IconSelectScreen}
        options={{
          header: () => <Header />,
          headerTitle: '',
        }}
      />
      <Stack.Screen
        name="Akki"
        component={AkkiScreen}
        options={{
          header: () => <Header />,
          headerTitle: '',
        }}
      />
      <Stack.Screen
        name="AkkiStartScreen"
        component={AkkiStartScreen}
        options={{
          header: () => <Header />,
          headerTitle: '',
        }}
      />
      <Stack.Screen
        name="MoreScreen"
        component={MoreScreen}
        options={{
          headerShown: false,
          headerTitle: '',
        }}
      />
    </Stack.Navigator>
  );
};

export default MainNavigator;