import React, {useState, useEffect} from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import moment from 'moment-timezone';
import Svg, {Defs, LinearGradient, Stop, Rect, Circle} from 'react-native-svg';
import Icon from 'react-native-vector-icons/FontAwesome';
import SavingsModal from '../components/SavingModal';
import {useTodayBunny} from '../hooks/useTodayBunny';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {PostTargetRequest} from '../types/types';
// import {NavigationProp, useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import {RootStackParamList} from '../types/types';
// import {iconData} from './IconSelectScreen';

type HomeScreenProps = {
  navigation: StackNavigationProp<RootStackParamList, 'Home'>;
};

// const getMemberNo = async (): Promise<number | null> => {
//   const userId = await AsyncStorage.getItem('userId');
//   return userId ? Number(userId) : null;
// };

export default function HomeScreen({navigation}: HomeScreenProps) {
  const {start, end, data, loading} = useTodayBunny();
  const [elapsedTime, setElapsedTime] = useState(0);
  const [earnings, setEarnings] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [monthlyGoal, setMonthlyGoal] = useState(0);

  const ratePerMinute = data?.minMoney || 0;
  const todayEarnings = ratePerMinute * 60 * 8;

  const loadMonthlyTarget = async () => {
    try {
      const savedTarget = await AsyncStorage.getItem('totalTargetAmount');
      if (savedTarget) {
        setMonthlyGoal(Number(savedTarget)); // 문자열을 숫자로 변환
      } else {
        setMonthlyGoal(0); // 저장된 목표가 없으면 기본값 설정
      }
    } catch (error) {
      console.error('Failed to load monthly target:', error);
      setMonthlyGoal(0); // 오류 발생 시 기본값 설정
    }
  };
  
  const handleEditTarget = async () => {
    try {
      // selectedIcons 확인
      const selectedIcons = await AsyncStorage.getItem('selectedIcons');
      if (!selectedIcons) {
        // selectedIcons가 없으면 AkkiStartScreen으로 이동
        navigation.navigate('AkkiStartScreen');
        return;
      }

      // selectedIcons가 있으면 모달 열기
      setIsModalVisible(true);
    } catch (error) {
      console.error('Failed to check selectedIcons:', error);
      navigation.navigate('AkkiStartScreen'); // 오류 발생 시 안전하게 AkkiStartScreen으로 이동
    }
  };

  // 컴포넌트 마운트 시 목표 로드
  useEffect(() => {
    loadMonthlyTarget();
  }, []);

  useEffect(() => {
    if (!start || !end || ratePerMinute === 0) return;

    const timer = setInterval(() => {
      const now = moment().tz('Asia/Seoul').toDate();
      if (now > end) {
        clearInterval(timer);
        setElapsedTime((end.getTime() - start.getTime()) / 1000);
        setTimeLeft(0);
      } else if (now < start) {
        setElapsedTime(0);
        setTimeLeft((end.getTime() - start.getTime()) / 1000);
      } else {
        const elapsedSeconds = Math.floor(
          (now.getTime() - start.getTime()) / 1000,
        );
        setElapsedTime(elapsedSeconds);
        setEarnings(Math.floor((elapsedSeconds / 60) * ratePerMinute));
        setTimeLeft(Math.floor((end.getTime() - now.getTime()) / 1000));
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [start, end, ratePerMinute]);

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${hours}시간 ${minutes}분 ${remainingSeconds}초`;
  };

  if (loading) {
    return <Text>Loading...</Text>;
  }

  const currentDate = moment().tz('Asia/Seoul');
  const currentDayOfMonth = currentDate.date();
  const month = currentDate.month() + 1;
  const dayOfWeekStr = currentDate.format('dddd');

  const formattedElapsedTime = formatTime(elapsedTime);

  const formattedTimeLeft =
    timeLeft <= 0 ? formatTime(0) : formatTime(timeLeft);

  const progress =
    start && end
      ? Math.max(
          0,
          Math.min(elapsedTime / ((end.getTime() - start.getTime()) / 1000), 1),
        )
      : 0;

  const toggleModal = () => {
    setIsModalVisible(!isModalVisible);
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.header}>오늘의 버니</Text>
        <Text style={styles.today}>
          {month}월 {currentDayOfMonth}일 {dayOfWeekStr}
        </Text>
      </View>
      <View style={styles.circleContainer}>
        <Svg
          width={200}
          height={200}
          viewBox="0 0 200 200"
          style={{transform: [{rotate: '-90deg'}]}}>
          <Defs>
            <LinearGradient id="gradUnique" x1="0" y1="0" x2="1" y2="0">
              <Stop offset="0%" stopColor="#DECDFF" />
              <Stop offset="100%" stopColor="#BCECFF" />
            </LinearGradient>
          </Defs>
          <Circle
            cx="100"
            cy="100"
            r="90"
            stroke="#f4f4f4"
            strokeWidth="15"
            fill="none"
          />
          <Circle
            cx="100"
            cy="100"
            r="90"
            stroke="url(#gradUnique)"
            strokeWidth="15"
            fill="none"
            strokeDasharray={565.48}
            strokeDashoffset={565.48 * (1 - progress)}
            strokeLinecap="round"
          />
        </Svg>
        <View style={styles.progressTextContainer}>
          <Text style={styles.progressText}>{formattedElapsedTime}</Text>
          <Text style={styles.progressSubText}>
            퇴근까지 {'\n'} {formattedTimeLeft}
          </Text>
        </View>
        <View style={styles.earnings}>
          <Text style={styles.earningsText}>{earnings.toLocaleString()}원</Text>
        </View>
      </View>

      {/* 이달의 목표 금액 및 진행 바 */}
      <Text style={styles.header}>이달의 아끼기 목표</Text>
      <View style={styles.monthlyGoalContainer}>
        <View style={styles.goalTextContainer}>
          <Text style={styles.currentGoal}>
            {monthlyGoal ? `${todayEarnings.toLocaleString()}원` : '???'}
          </Text>
          <View style={styles.goalTextWrapper}>
            <Text style={styles.totalGoal}>
              {monthlyGoal ? `${monthlyGoal.toLocaleString()}원` : '???'}
            </Text>
            <TouchableOpacity
              style={styles.iconButton}
              onPress={handleEditTarget}>
              <Icon name="pencil" size={15} color="#4f4f4f" />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.progressBarContainer}>
          <Svg height="20" width="100%">
            <Defs>
              <LinearGradient id="gradBar" x1="0" y1="0" x2="1" y2="0">
                <Stop offset="0%" stopColor="#DECDFF" />
                <Stop offset="100%" stopColor="#BCECFF" />
              </LinearGradient>
            </Defs>
            <Rect
              x="0"
              y="0"
              width="100%"
              height="20"
              fill="#f4f4f4"
              rx="0"
              ry="0"
            />
            <Rect
              x="0"
              y="0"
              width={`${(todayEarnings / monthlyGoal) * 100}%`}
              height="20"
              fill="url(#gradBar)"
              rx="10"
              ry="10"
            />
          </Svg>
        </View>
      </View>
      <SavingsModal
        isVisible={isModalVisible}
        onClose={toggleModal}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  headerContainer: {
    flexDirection: 'row',
    alignContent: 'center',
    alignItems: 'center',
    gap: 10,
  },
  header: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'black',
    marginBottom: 10,
  },
  today: {
    fontSize: 14,
    color: 'black',
    marginBottom: 6,
    marginLeft: -2,
  },
  circleContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 40,
    borderRadius: 15,
    backgroundColor: '#fcfcfc',
    padding: 33,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  circleGradient: {
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 100,
    padding: 15,
  },
  circleText: {
    fontSize: 16,
    color: '#000000',
    marginTop: 5,
  },
  earnings: {
    margin: 20,
    backgroundColor: '#8c9eff',
    paddingVertical: 10,
    paddingHorizontal: 40,
    borderRadius: 24,
  },
  earningsText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  progressTextContainer: {
    position: 'absolute',
    top: '40%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  progressText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000000',
    textAlign: 'center',
  },
  progressSubText: {
    fontSize: 12,
    color: '#aaa',
    textAlign: 'center',
    marginTop: 5,
  },
  monthlyGoalContainer: {
    marginBottom: 40,
    borderRadius: 15,
    backgroundColor: '#fcfcfc',
    padding: 30,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  goalTextContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  goalTextWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  currentGoal: {
    fontSize: 16,
    color: '#98A2FF',
    marginRight: 10, // currentGoal과 totalGoal 사이에 간격 추가
  },
  totalGoal: {
    fontSize: 16,
    color: '#000000',
  },
  iconButton: {
    marginLeft: 10, // totalGoal과 아이콘 사이에 간격 추가
  },
  progressBarContainer: {
    position: 'relative',
    height: 20,
    marginBottom: 10,
    borderRadius: 10,
    overflow: 'hidden',
  },
  estimatedAmountText: {
    fontSize: 16,
    color: '#8c9eff',
    fontWeight: 'bold',
    marginTop: 10,
    textAlign: 'center',
  },
  sliderLabel: {
    fontSize: 14,
    color: '#555',
    marginBottom: 10,
    textAlign: 'center',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    width: 300,
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 10,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  goalInput: {
    width: '100%',
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    paddingHorizontal: 10,
    marginBottom: 20,
    borderRadius: 5,
    textAlign: 'center',
  },
  saveButton: {
    backgroundColor: '#98A2FF',
    paddingVertical: 10,
    paddingHorizontal: 30,
    borderRadius: 5,
  },
  saveButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});
