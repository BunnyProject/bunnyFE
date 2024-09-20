import React, {useState, useEffect, useMemo} from 'react';
import {View, Text, StyleSheet} from 'react-native';
import * as Progress from 'react-native-progress';
import {StackNavigationProp} from '@react-navigation/stack';
import {RootStackParamList} from '../navigation/MainNavigation';
import moment from 'moment-timezone';
import Svg, {Defs, LinearGradient, Stop, Circle} from 'react-native-svg';

type Info2ScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  'Home'
>;

type Props = {
  navigation: Info2ScreenNavigationProp;
};

export default function HomeScreen() {
  const [elapsedTime, setElapsedTime] = useState(0);
  const [earnings, setEarnings] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0); // 퇴근까지 남은 시간

  // 한국 시간(KST)으로 시작 시간 및 종료 시간 설정
  const startTime = useMemo(() => {
    return moment
      .tz('Asia/Seoul')
      .set({hour: 9, minute: 0, second: 0})
      .toDate();
  }, []);

  const endTime = useMemo(() => {
    return moment
      .tz('Asia/Seoul')
      .set({hour: 17, minute: 0, second: 0})
      .toDate();
  }, []);

  // 분당 금액
  const ratePerMinute = 50; // 임의로 분당 50원으로 설정

  // 이달의 목표 금액
  const monthlyGoal = 250000; // 250,000원 목표
  const todayEarnings = 68000; // 현재까지 번 금액 (임의로 설정)

  // 현재 시간으로부터 경과된 시간 계산
  useEffect(() => {
    const timer = setInterval(() => {
      const now = moment().tz('Asia/Seoul').toDate(); // 현재 시간을 한국 시간으로 설정
      if (now > endTime) {
        clearInterval(timer);
        setElapsedTime((endTime.getTime() - startTime.getTime()) / 1000); // 종료 후에는 종료 시간까지의 시간으로 설정
        setTimeLeft(0); // 퇴근 후 남은 시간은 0
      } else if (now < startTime) {
        setElapsedTime(0); // 시작 시간 이전에는 경과 시간 0으로 설정
        setTimeLeft((endTime.getTime() - startTime.getTime()) / 1000); // 남은 시간 계산
      } else {
        // 시간의 차이를 밀리초 단위로 계산한 후, 초 단위로 변환
        const elapsedSeconds = Math.floor(
          (now.getTime() - startTime.getTime()) / 1000,
        );
        setElapsedTime(elapsedSeconds);

        // 금액 계산 (분당 금액 기준, 소숫점 이하 버림)
        const currentEarnings = Math.floor(
          (elapsedSeconds / 60) * ratePerMinute,
        );
        setEarnings(currentEarnings);

        // 퇴근까지 남은 시간 계산
        const remainingSeconds = Math.floor(
          (endTime.getTime() - now.getTime()) / 1000,
        );
        setTimeLeft(remainingSeconds);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [startTime, endTime, ratePerMinute]);

  // 이달의 일수 계산
  const currentDate = moment().tz('Asia/Seoul');
  const currentDayOfMonth = moment().tz('Asia/Seoul').date(); // 한국 시간의 현재 날짜
  const totalDaysInMonth = moment().tz('Asia/Seoul').daysInMonth(); // 한국 시간의 이달 일수
  const month = currentDate.month() + 1;
  const dayOfWeekStr = currentDate.format('dddd'); // 현재 요일을 문자열로 ('Monday', 'Tuesday' 등)


  // 시간을 시:분:초 형식으로 포맷팅하는 함수
  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;
    return `${hours}시간 ${minutes}분 ${remainingSeconds}초`;
  };
  const progress =
    elapsedTime / ((endTime.getTime() - startTime.getTime()) / 1000);

  return (
    <View style={styles.container}>
      {/* 상단 타이머 및 금액 표시 */}
      <View style={styles.headerContainer}>
        <Text style={styles.header}>오늘의 버니</Text>
        <Text style={styles.today}>{month}월 {currentDayOfMonth}일 {dayOfWeekStr}</Text>
      </View>
      <View style={styles.circleContainer}>
        {/* Linear Gradient를 타이머의 배경으로 설정 */}
        {/* <LinearGradient
          colors={['#DECDFF', '#BCECFF']}
          style={styles.circleGradient}
        > */}
        {/* <Progress.Circle
            progress={elapsedTime / ((endTime.getTime() - startTime.getTime()) / 1000)} // 진행률 계산 (총 초 대비 경과된 초)
            size={200}
            thickness={10}
            showsText={true}
            formatText={formatText} // 경과된 시간과 퇴근까지 남은 시간 모두 표시
            color={'#98A2FF'}
            unfilledColor={'#E0E0E0'}
            borderWidth={0}
            textStyle={styles.circleText}
          /> */}
        {/* </LinearGradient> */}
        <Svg
          width={200}
          height={200}
          viewBox="0 0 200 200"
          style={{transform: [{rotate: '-90deg'}]}}>
          <Defs>
            <LinearGradient id="grad" x1="0" y1="0" x2="1" y2="0">
              <Stop offset="0%" stopColor="#DECDFF" />
              <Stop offset="100%" stopColor="#BCECFF" />
            </LinearGradient>
          </Defs>
          <Circle
            cx="100"
            cy="100"
            r="90"
            stroke="#f4f4f4" // 연한 회색 배경 색상
            strokeWidth="15"
            fill="none"
          />
          <Circle
            cx="100"
            cy="100"
            r="90"
            stroke="url(#grad)"
            strokeWidth="15"
            fill="none"
            strokeDasharray={565.48} // 전체 원의 둘레 (2 * Math.PI * r)
            strokeDashoffset={565.48 * (1 - progress)} // 진행률에 따른 offset 계산
            strokeLinecap="round"
          />
        </Svg>
        <View style={styles.progressTextContainer}>
          <Text style={styles.progressText}>{formatTime(elapsedTime)}</Text>
          <Text style={styles.progressSubText}>
            퇴근까지 {'\n'} {formatTime(timeLeft)}
          </Text>
        </View>
        <View style={styles.earnings}>
          <Text style={styles.earningsText}>{earnings.toLocaleString()}원</Text>
        </View>
      </View>

      {/* 이달의 목표 금액 및 진행 바 */}
      <Text style={styles.header}>이달의 아끼기 목표</Text>
      <View style={styles.monthlyGoalContainer}>
        {/* 목표 진행 바에 그라데이션 추가 */}
        <View style={styles.progressBarContainer}>
          <Progress.Bar
            progress={todayEarnings / monthlyGoal}
            width={null}
            height={10}
            color={'#8c9eff'}
            unfilledColor={'#E0E0E0'}
            borderWidth={0}
            style={styles.progressBarOverlay} // ProgressBar를 투명하게 해서 오버레이로 설정
          />
        </View>
        <View style={styles.goalTextContainer}>
          <Text style={styles.currentGoal}>
            {todayEarnings.toLocaleString()}원
          </Text>
          <Text style={styles.totalGoal}>{monthlyGoal.toLocaleString()}원</Text>
        </View>
      </View>

      {/* 한 달 중 현재 날짜 표시 (일직선 형태) */}
      <Text style={styles.header}>한 달의 진행</Text>
      <View style={styles.progressBarContainer}>
        <Progress.Bar
          progress={currentDayOfMonth / totalDaysInMonth}
          width={null}
          height={10}
          color={'#8c9eff'}
          unfilledColor={'#E0E0E0'}
          borderWidth={0}
          style={styles.progressBarOverlay}
        />
      </View>
      <View style={styles.dateTextContainer}>
        <Text>{currentDayOfMonth}일</Text>
        <Text>{totalDaysInMonth}일</Text>
      </View>
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
    gap: 10,
  },
  header: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: 'black',
  },
  today: {
    fontSize: 14,
    color: 'black',
    marginTop: 3,
  },
  circleContainer: {
    justifyContent: 'center',
    alignItems: 'center',
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
    position: 'absolute', // position을 absolute로 변경하여 Svg 위에 겹치도록 설정
    top: '40%', // 텍스트의 상하 위치를 조정
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
  },
  goalTextContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  currentGoal: {
    fontSize: 14,
    color: '#98A2FF',
  },
  totalGoal: {
    fontSize: 14,
    color: '#aaa',
  },
  dateTextContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  progressBarContainer: {
    position: 'relative',
    height: 10,
    marginBottom: 10,
  },
  gradient: {
    position: 'absolute',
    height: 10,
    borderRadius: 5,
  },
  progressBarOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
});
