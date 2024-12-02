import React, {useState, useEffect, useMemo} from 'react';
import {View, Text, StyleSheet, ScrollView} from 'react-native';
import moment from 'moment-timezone';
import Svg, {Defs, LinearGradient, Stop, Circle} from 'react-native-svg';
import CustomSlider from '../components/Slider';
import {useHomeMoney, useTodayBunny} from '../hooks/useTodayBunny';

interface Earnings {
  total: number;
  current: number;
}

export default function BunnyScreen() {
  const { start, end, data, loading, error } = useTodayBunny(); // useTodayBunny 훅 사용
  const { data: homeMoneyData } = useHomeMoney(); // 추가 데이터 훅
  const ratePerMinute = data?.minMoney || 280; // 분당 금액 기본값
  const [weeklyEarnings, setWeeklyEarnings] = useState<Earnings>({ total: 0, current: 0 });
  const [monthlyEarnings, setMonthlyEarnings] = useState<Earnings>({ total: 0, current: 0 });
  const [yearlyEarnings, setYearlyEarnings] = useState<Earnings>({ total: 0, current: 0 });
  const [elapsedTime, setElapsedTime] = useState(0);
  const [earnings, setEarnings] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);

  // const ratePerMinute = data?.minMoney || 280;
  const ratePerSecond = homeMoneyData?.secondMoney || 0;
  const ratePerMin = homeMoneyData?.minMoney || 0;
  const ratePerHour = homeMoneyData?.hourMoney || 0;
  
  useEffect(() => {
    if (!start || !end) return;

    const totalWorkTime = (end.getTime() - start.getTime()) / (1000 * 60); // 분 단위 근무 시간
    const totalEarnings = Math.floor(totalWorkTime * ratePerMinute); // 하루 총 금액 계산
    const dailyEarnings = Math.floor(totalWorkTime * ratePerMinute); // 하루 총 금액 (소수점 처리)


    // 이주의 버니 (5일 기준)
    const weeklyTotalEarnings = Math.floor(dailyEarnings * 5); // 주 5일 근무
    const daysInWeek = moment().isoWeekday(); // 현재 주차의 요일 (1=월요일, 7=일요일)
    const weeklyCurrentEarnings = Math.floor(dailyEarnings * Math.min(daysInWeek, 5)); // 현재 주차 동안의 금액
    setWeeklyEarnings({
      total: weeklyTotalEarnings,
      current: weeklyCurrentEarnings,
    });

    // 이달의 버니
    const daysInMonth = moment().daysInMonth(); // 현재 달의 총 일수
    const monthlyTotalEarnings = Math.floor(dailyEarnings * daysInMonth); // 월 근무 일수 기반
    const today = moment().date(); // 현재 일자
    const monthlyCurrentEarnings = Math.floor(dailyEarnings * Math.min(today, daysInMonth)); // 현재까지의 금액
    setMonthlyEarnings({
      total: monthlyTotalEarnings,
      current: monthlyCurrentEarnings,
    });

    // 올해의 버니
    const yearlyTotalEarnings = Math.floor(dailyEarnings * 261); // 261일 근무 (52주 * 5일 기준)
    const daysPassedThisYear = moment().dayOfYear(); // 올해 경과된 일수
    const yearlyCurrentEarnings = Math.floor(dailyEarnings * daysPassedThisYear); // 현재까지의 금액
    setYearlyEarnings({
      total: yearlyTotalEarnings,
      current: yearlyCurrentEarnings,
    });

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
        const elapsedSeconds = Math.floor((now.getTime() - start.getTime()) / 1000);
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
  const currentDayOfWeek = currentDate.isoWeekday() - 1;
  const dayOfWeekStr = currentDate.format('dddd');

  const formattedElapsedTime = formatTime(elapsedTime);

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
          totalGoal={weeklyEarnings.total}
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
          totalGoal={monthlyEarnings.total}
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
          totalGoal={yearlyEarnings.total}
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
