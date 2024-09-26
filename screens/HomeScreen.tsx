import React, {useState, useEffect, useMemo} from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import * as Progress from 'react-native-progress';
import moment from 'moment-timezone';
import Svg, {Defs, LinearGradient, Stop, Rect, Circle} from 'react-native-svg';
import Icon from 'react-native-vector-icons/FontAwesome';

export default function HomeScreen() {
  const [elapsedTime, setElapsedTime] = useState(0);
  const [earnings, setEarnings] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);

  const startTime = useMemo(() => {
    return moment
      .tz('Asia/Seoul')
      .set({hour: 18, minute: 22, second: 0})
      .toDate();
  }, []);

  const endTime = useMemo(() => {
    return moment
      .tz('Asia/Seoul')
      .set({hour: 20, minute: 0, second: 0})
      .toDate();
  }, []);

  const ratePerMinute = 50;

  const monthlyGoal = 250000;
  const todayEarnings = 68000;

  useEffect(() => {
    const timer = setInterval(() => {
      const now = moment().tz('Asia/Seoul').toDate();
      if (now > endTime) {
        clearInterval(timer);
        setElapsedTime((endTime.getTime() - startTime.getTime()) / 1000);
        setTimeLeft(0);
      } else if (now < startTime) {
        setElapsedTime(0);
        setTimeLeft((endTime.getTime() - startTime.getTime()) / 1000);
      } else {
        const elapsedSeconds = Math.floor(
          (now.getTime() - startTime.getTime()) / 1000,
        );
        setElapsedTime(elapsedSeconds);

        const currentEarnings = Math.floor(
          (elapsedSeconds / 60) * ratePerMinute,
        );
        setEarnings(currentEarnings);

        const remainingSeconds = Math.floor(
          (endTime.getTime() - now.getTime()) / 1000,
        );
        setTimeLeft(remainingSeconds);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [startTime, endTime, ratePerMinute]);

  const currentDate = moment().tz('Asia/Seoul');
  const currentDayOfMonth = moment().tz('Asia/Seoul').date();
  // const totalDaysInMonth = moment().tz('Asia/Seoul').daysInMonth();
  const month = currentDate.month() + 1;
  const dayOfWeekStr = currentDate.format('dddd');

  // 시간을 시:분:초 형식으로 포맷팅하는 함수
  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    // remainingSeconds 값이 소수점이 나오지 않도록 Math.floor 적용
    const remainingSeconds = Math.floor(seconds % 60);
    return `${hours}시간 ${minutes}분 ${remainingSeconds}초`;
  };

  // 퇴근 후 경과 시간도 정상적으로 8시간 0분 0초로 표시되도록 조건 추가
  const formattedElapsedTime = elapsedTime >= 8 * 3600 ? formatTime(8 * 3600) : formatTime(elapsedTime);
  const formattedTimeLeft = timeLeft <= 0 ? formatTime(0) : formatTime(timeLeft);
  
  const progress =
    elapsedTime / ((endTime.getTime() - startTime.getTime()) / 1000);

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
            <LinearGradient id="grad" x1="0" y1="0" x2="1" y2="0">
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
            stroke="url(#grad)"
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
              {todayEarnings.toLocaleString()}원
            </Text>
          <View style={styles.goalTextWrapper}>

            <Text style={styles.totalGoal}>
              {monthlyGoal.toLocaleString()}원
            </Text>
          <TouchableOpacity style={styles.iconButton}>
            <Icon name="pencil" size={15} color="#4f4f4f" />
          </TouchableOpacity>
          </View>

        </View>

        <View style={styles.progressBarContainer}>
          {/* 채워지지 않은 막대 그래프 (배경) */}
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
              width="100%" // 전체 바의 넓이
              height="20"
              fill="#f4f4f4" // 채워지지 않은 부분 색상
              rx="0" // 전체 배경은 직각으로 설정
              ry="0"
            />
            {/* 채워진 막대 그래프 */}
            <Rect
              x="0"
              y="0"
              width={`${(todayEarnings / monthlyGoal) * 100}%`} // 진행률에 따라 넓이 설정
              height="20"
              fill="url(#gradBar)"
              rx="10" // 채워진 부분만 모서리를 둥글게 설정
              ry="10"
            />
          </Svg>
        </View>
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
    marginBottom: 10,
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
});
