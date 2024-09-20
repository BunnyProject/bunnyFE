import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import {StackNavigationProp} from '@react-navigation/stack';
import {RootStackParamList} from '../navigation/MainNavigation';

type ResultScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  'Result'
>;

type Props = {
  navigation: ResultScreenNavigationProp;
};

// 임의의 데이터
const data = {
  monthly: '320만 원',
  weekly: '60만 원',
  daily: '10만 원',
  hourly: '1만 2500 원',
  perMinute: '208.3 원',
  perSecond: '3.47 원',
};

const ResultScreen = ({navigation}: Props) => {
  return (
    <View style={styles.container}>
      <View style={styles.upper}>
      <Text style={styles.title}>홍길동 님이 벌고 계시는 급여입니다.</Text>
      <View style={styles.card}>
        <View style={styles.row}>
          <Text style={styles.label}>월에</Text>
          <Text style={styles.value}>{data.monthly}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>주에</Text>
          <Text style={styles.value}>{data.weekly}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>일에</Text>
          <Text style={styles.value}>{data.daily}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>시간 당</Text>
          <Text style={styles.value}>{data.hourly}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>분 당</Text>
          <Text style={styles.value}>{data.perMinute}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>초 당</Text>
          <Text style={styles.value}>{data.perSecond}</Text>
        </View>
      </View>
      </View>
      <TouchableOpacity
        style={styles.button}
        onPress={() => {
          // 다음 페이지 이동 또는 다른 작업 처리
          navigation.navigate('Loading');
        }}
        >
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
    padding: 30,
  },
  upper: {
    flex: 1,
    alignItems: 'center',
    width: '100%',
    gap: 10,
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
