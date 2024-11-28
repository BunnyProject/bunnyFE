import React, {useState, useEffect, useMemo} from 'react';
import {View, Text, StyleSheet, ScrollView} from 'react-native';
import moment from 'moment-timezone';
import Svg, {Defs, LinearGradient, Stop, Circle} from 'react-native-svg';
import CustomSlider from '../components/Slider';

import {useHomeMoney, useTodayBunny} from '../hooks/useTodayBunny';

export default function BunnyScreen() {
  const { start, end, data, loading, error } = useTodayBunny(); // useTodayBunny 훅 사용
  const { data: homeMoneyData } = useHomeMoney(); // 추가 데이터 훅
  const totalWeeklyEarnings = 600000; // 이번 주 총 수익 금액
  const totalMonthlyEarnings = 2400000; // 이번 달 총 수익 금액
  const totalYearlyEarnings = 28800000; // 올해 총 수익 금액

  const [elapsedTime, setElapsedTime] = useState(0);
  const [earnings, setEarnings] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);

  const ratePerMinute = data?.minMoney || 280; // 분당 금액 기본값
  const ratePerSecond = homeMoneyData?.secondMoney || 0;
  const ratePerMin = homeMoneyData?.minMoney || 0;
  const ratePerHour = homeMoneyData?.hourMoney || 0;
  
  useEffect(() => {
    if (!start || !end) return;

    const totalWorkTime = (end.getTime() - start.getTime()) / (1000 * 60); // 분 단위 근무 시간
    const totalEarnings = Math.floor(totalWorkTime * ratePerMinute); // 하루 총 금액 계산

    const timer = setInterval(() => {
      const now = moment().tz('Asia/Seoul').toDate();

      if (now > end) {
        clearInterval(timer);
        setEarnings(totalEarnings); // 하루 총 금액으로 설정
        setTimeLeft(0);
      } else if (now < start) {
        setEarnings(0);
        setTimeLeft(totalWorkTime * 60); // 남은 시간 설정
      } else {
        const elapsedMinutes = Math.floor((now.getTime() - start.getTime()) / (1000 * 60));
        const currentEarnings = Math.floor(elapsedMinutes * ratePerMinute);
        setEarnings(currentEarnings);
        const remainingSeconds = Math.floor((end.getTime() - now.getTime()) / 1000);
        setTimeLeft(remainingSeconds);
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
  const currentDayOfWeek = currentDate.isoWeekday() - 1;
  const dayOfWeekStr = currentDate.format('dddd');

  const formattedElapsedTime =
    elapsedTime >= 8 * 3600 ? formatTime(8 * 3600) : formatTime(elapsedTime);
  const formattedTimeLeft =
    timeLeft <= 0 ? formatTime(0) : formatTime(timeLeft);

  const progress =
    start && end ? elapsedTime / ((end.getTime() - start.getTime()) / 1000) : 0;

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
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
          style={{ transform: [{ rotate: '-90deg' }] }}
        >
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
        <View style={styles.bottoms}>
          {['초당', '분당', '시간당'].map((label, index) => (
            <View
              style={[styles.bottomItems, index < 2 && styles.bottomBorder]}
              key={index}
            >
              <Text style={styles.bottomlabel}>{label}</Text>
              <Text style={styles.bottomItem}>
                {index === 0
                  ? ratePerSecond.toLocaleString()
                  : index === 1
                  ? ratePerMin.toLocaleString()
                  : ratePerHour.toLocaleString()}
                원
              </Text>
            </View>
          ))}
        </View>
      </View>
      <View style={styles.sliderContainer}>
        <View style={styles.headerContainer}>
          <Text style={styles.header}>이 주의 버니</Text>
          <Text style={styles.today}>{dayOfWeekStr}</Text>
        </View>
        <CustomSlider
          totalGoal={totalWeeklyEarnings}
          unit="week"
          startLabel="월요일"
          endLabel="금요일"
          step={4} // 월요일부터 금요일까지 5단계
          defaultValue={currentDayOfWeek > 4 ? 4 : currentDayOfWeek} // 주말이면 금요일로 설정
        />

        <View style={styles.headerContainer}>
          <Text style={styles.header}>이 달의 버니</Text>
          <Text style={styles.today}>{currentDayOfMonth}일</Text>
        </View>
        <CustomSlider
          totalGoal={totalMonthlyEarnings}
          unit="month"
          startLabel="1일"
          endLabel={`${currentDate.daysInMonth()}일`}
          step={currentDate.daysInMonth() - 1} // 한 달의 일수만큼 단계 설정
          defaultValue={currentDayOfMonth} // 현재 날짜에 해당하는 단계로 설정
        />

        <View style={styles.headerContainer}>
          <Text style={styles.header}>올해의 버니</Text>
          <Text style={styles.today}>{month}월</Text>
        </View>
        <CustomSlider
          totalGoal={totalYearlyEarnings}
          unit="year"
          startLabel="1월"
          endLabel="12월"
          step={11} // 1월부터 12월까지 12단계
          defaultValue={month} // 현재 월에 해당하는 단계로 설정
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    padding: 20,
    backgroundColor: '#fff',
    flexGrow: 1,
  },
  headerContainer: {
    flexDirection: 'row',
    alignContent: 'center',
    alignItems: 'flex-end',
    marginBottom: 10,
  },
  header: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'black',
  },
  today: {
    fontSize: 14,
    color: 'black',
    marginBottom: 1,
    marginLeft: 7,
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
  bottomBorder: {
    borderRightWidth: 2,
    borderColor: '#ffffff',
  },
  bottoms: {
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
    borderRadius: 24,
    backgroundColor: '#F6F6F6',
    paddingVertical: 17,
  },
  bottomItems: {
    flexDirection: 'column',
    alignItems: 'center',
    paddingRight: 30,
    paddingLeft: 30,
  },
  bottomlabel: {
    fontSize: 14,
    color: '#4f4f4f',
  },
  bottomItem: {
    fontSize: 14,
    color: '#000000',
    fontWeight: 'bold',
  },
  progressTextContainer: {
    position: 'absolute',
    top: '30%',
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
  sliderContainer: {
    marginBottom: 40,
  },
});
