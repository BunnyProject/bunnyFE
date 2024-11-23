import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity, Alert} from 'react-native';
import {StackNavigationProp} from '@react-navigation/stack';
import {RouteProp} from '@react-navigation/native';
import {RootStackParamList} from '../types/types';
import useCreateUser from '../hooks/useCreateUser';
import AsyncStorage from '@react-native-async-storage/async-storage';

type ResultScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  'Result'
>;
type ResultScreenRouteProp = RouteProp<RootStackParamList, 'Result'>;

type Props = {
  navigation: ResultScreenNavigationProp;
  route: ResultScreenRouteProp;
};

const ResultScreen = ({navigation, route}: Props) => {
  const {name, birthDate, gender, job, salary, workDays, startTime, endTime} =
    route.params;
  const {isLoading, error, createNewUser} = useCreateUser();

  const dayMapping: {[key: string]: string} = {
    월: 'MONDAY',
    화: 'TUESDAY',
    수: 'WEDNESDAY',
    목: 'THURSDAY',
    금: 'FRIDAY',
    토: 'SATURDAY',
    일: 'SUNDAY',
  };

  const convertDaysToEnglish = (days: string[]): string[] => {
    return days.map(day => dayMapping[day] || day);
  };

  const handleCreateUser = async () => {
    const userData = {
      name,
      birth: birthDate,
      gender: gender === '여성' ? 'FEMALE' : 'MALE',
      job,
      monthMoney: salary,
      workDay: convertDaysToEnglish(workDays.map(day => day.toUpperCase())),
      workingTime: startTime + ':00', 
      quittingTime: endTime + ':00',
    };
  
    const success = await createNewUser(userData);
  
    if (success) {
      try {
        // 사용자 상태와 추가 정보 저장
        await AsyncStorage.setItem('isUserCreated', 'true');
        await AsyncStorage.setItem('userName', name); // 사용자 이름 저장
        await AsyncStorage.setItem('userId', '12345'); // 예시로 사용자 번호 저장
        navigation.navigate('Home');
      } catch (e) {
        console.error('Error saving user state:', e);
      }
    } else {
      Alert.alert('오류', error || '사용자 생성 중 문제가 발생했습니다.');
    }
  };
  
  return (
    <View style={styles.container}>
      <View style={styles.upper}>
        <Text style={styles.title}>{name} 님의 급여 및 근무 정보입니다.</Text>
        <View style={styles.card}>
          <View style={styles.row}>
            <Text style={styles.label}>이름</Text>
            <Text style={styles.value}>{name}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>생년월일</Text>
            <Text style={styles.value}>{birthDate}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>성별</Text>
            <Text style={styles.value}>{gender}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>직업</Text>
            <Text style={styles.value}>{job}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>급여</Text>
            <Text style={styles.value}>{salary} 만원</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>근무일</Text>
            <Text style={styles.value}>{workDays.join(', ')}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>출근 시간</Text>
            <Text style={styles.value}>{startTime}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>퇴근 시간</Text>
            <Text style={styles.value}>{endTime}</Text>
          </View>
        </View>
      </View>
      <TouchableOpacity
        style={styles.button}
        onPress={handleCreateUser}
        disabled={isLoading}>
        <Text style={styles.buttonText}>이대로 진행할게요</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingVertical: 50,
    // marginTop: 30
  },
  upper: {
    flex: 1,
    alignItems: 'center',
    width: '100%',
    gap: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
  card: {
    width: '90%',
    backgroundColor: '#ffffff',
    borderRadius: 10,
    padding: 30,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    color: '#000',
  },
  value: {
    fontSize: 16,
    color: '#8c9eff',
  },
  button: {
    marginBottom: 30,
    backgroundColor: '#8c9eff',
    paddingVertical: 15,
    borderRadius: 24,
    paddingHorizontal: 100,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
  },
});

export default ResultScreen;
