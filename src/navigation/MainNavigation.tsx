import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {Image} from 'react-native';
import LandingScreen from '../screens/LandingScreen';
import UserInfoScreen from '../screens/UserInfoScreen';
import UserInfo2Screen from '../screens/UserInfo2Screen';
import ResultScreen from '../screens/ResultScreen';
import LoadingScreen from '../screens/LoadingScreen';
import HomeScreen from '../screens/HomeScreen';
import BunnyScreen from '../screens/BunnyScreen';
import AkkiScreen from '../screens/AkkiScreen';
import IconSelectScreen from '../screens/IconSelectScreen';
import AkkiStartScreen from '../screens/AkkiStartScreen';
import MoreScreen from '../screens/MoreScreen';
import Header from '../components/Header';
import {RootStackParamList} from '../types/types';
import InitialScreen from '../screens/InitialScreen';

const bunnyIcon = require('../assets/bunny.png');
const savingIcon = require('../assets/Akki.png');
const homeIcon = require('../assets/Home.png');

const Stack = createStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator();

const TabBarIcon = ({
  routeName,
  color,
  size,
}: {
  routeName: string;
  color: string;
  size: number;
}) => {
  let iconSource;
  let iconSize = size;

  if (routeName === 'HomeTab') {
    iconSource = homeIcon;
    iconSize = 25;
  } else if (routeName === 'Bunny') {
    iconSource = bunnyIcon;
    iconSize = 30;
  } else if (routeName === 'Saving') {
    iconSource = savingIcon;
    iconSize = 30;
  }

  return (
    <Image
      source={iconSource}
      style={{width: iconSize, height: iconSize, tintColor: color}}
      resizeMode="contain"
    />
  );
};

const SavingStackNavigator = () => {
  const SavingStack = createStackNavigator();

  return (
    <SavingStack.Navigator screenOptions={{headerShown: false}}>
      <SavingStack.Screen name="InitialScreen" component={InitialScreen} />
      <SavingStack.Screen name="AkkiStartScreen" component={AkkiStartScreen} />
      <SavingStack.Screen
        name="IconSelectScreen"
        component={IconSelectScreen}
      />
      <SavingStack.Screen name="Akki" component={AkkiScreen} />
    </SavingStack.Navigator>
  );
};

const HomeTabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({route}) => ({
        tabBarIcon: ({color, size}) => (
          <TabBarIcon routeName={route.name} color={color} size={size} />
        ),
        tabBarActiveTintColor: '#98A2FF',
        tabBarInactiveTintColor: '#B7B7B7',
        tabBarStyle: {
          height: 70,
          paddingBottom: 10,
          borderTopLeftRadius: 35,
          borderTopRightRadius: 35,
          backgroundColor: '#FFFFFF',
          position: 'absolute',
          borderTopWidth: 0,
        
          elevation: 15,
          shadowColor: '#393939',
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.1,
          shadowRadius: 5,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          marginBottom: 5,
        },
        headerShown: false,
      })}>
      <Tab.Screen
        name="Bunny"
        component={BunnyScreen}
        options={{title: '버니'}}
      />
      <Tab.Screen
        name="HomeTab"
        component={HomeScreen}
        options={{title: '홈'}}
      />
      <Tab.Screen
        name="Saving"
        component={SavingStackNavigator}
        options={{title: '아끼기'}}
      />
    </Tab.Navigator>
  );
};

const HeaderWrapper = () => <Header />;

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
          header: HeaderWrapper,
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
