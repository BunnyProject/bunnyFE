import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useEffect } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../types/types';

type Props = {
  navigation: StackNavigationProp<RootStackParamList, 'Saving'>;
};

const InitialScreen = ({ navigation }: Props) => {
  useEffect(() => {
    const checkSelectedIcons = async () => {
      const savedIcons = await AsyncStorage.getItem('selectedIcons');
      console.log('Saved Icons:', savedIcons);
      if (savedIcons) {
        navigation.replace('Akki'); // 데이터가 있으면 AkkiScreen으로 이동
      } else {
        navigation.replace('AkkiStartScreen'); // 데이터가 없으면 AkkiStartScreen으로 이동
      }
    };

    checkSelectedIcons();
  }, [navigation]);
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <ActivityIndicator size="large" color="#98A2FF" />
    </View>
  );
};

export default InitialScreen;
