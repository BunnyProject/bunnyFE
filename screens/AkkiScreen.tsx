import React, {useState} from 'react';
import {ScrollView, View, Text, StyleSheet, Image} from 'react-native';
import {useRoute, RouteProp} from '@react-navigation/native';
import CalendarComponent from '../components/CalendarComponent';

type RootStackParamList = {
  AkkiScreen: {
    selectedIcons: {name: string; source: any}[]; // 선택된 아이콘 타입 정의
  };
};

const AkkiScreen = () => {
  const route = useRoute<RouteProp<RootStackParamList, 'AkkiScreen'>>();
  const {selectedIcons} = route.params || {selectedIcons: []};
  const [selectedDate, setSelectedDate] = useState('');

  // 임의의 월별 총 금액 데이터
  const totalSavingsByCategory = {
    커피: 62000,
    담배: 23500,
    기타: 291000,
  };

  // 날짜 선택 시 처리
  const handleSelectDate = (date: string) => {
    setSelectedDate(date); // 선택된 날짜를 저장
  };

  return (
    <ScrollView style={styles.container}>
      {/* 상단 부분 (이미지 포함) */}
      <View style={styles.topSection}>
        <Image
          source={require('../assets/akki-back.png')}
          style={styles.bunnyImage}
        />
      </View>

      {/* 선택된 아이콘과 기타 버튼을 표시하는 카테고리 버튼 */}
      <View style={styles.categoryContainer}>
        {selectedIcons.map(icon => (
          <View key={icon.name} style={styles.category}>
            <Image source={icon.source} style={styles.iconImage} />
            <Text style={styles.iconText}>{icon.name}</Text>
          </View>
        ))}
        <View style={styles.category}>
          <Image
            source={require('../assets/icons/plus.png')}
            style={styles.iconImage}
          />
          <Text style={styles.iconText}>기타</Text>
        </View>
      </View>

      {/* 오늘의 아끼기 */}
      <View style={styles.savingSummary}>
        <View style={styles.titleContainer}>
          <Text style={styles.savingTitle}>오늘의 아끼기</Text>
          <Text style={styles.savingTotal}>총 2만 6,500원</Text>
        </View>
        <View style={styles.savingDetails}>
          <Text>커피</Text>
          <Text>6,500원</Text>
        </View>
        <View style={styles.savingDetails}>
          <Text>담배</Text>
          <Text>3,000원</Text>
        </View>
        <View style={styles.savingDetails}>
          <Text>기타</Text>
          <Text>1만 7,000원</Text>
        </View>
      </View>

      {/* 캘린더 컴포넌트 사용 */}
      <View style={styles.calendarSection}>
        <CalendarComponent onSelectDate={handleSelectDate} />
        {/* 월별 총 아끼기 금액 */}
        <View style={styles.monthlyTotalSection}>
          <Text style={styles.monthlyTotalTitle}>이번 달 아끼기 누적액</Text>
          <Text style={styles.monthlyTotalAmount}>총 37만 6,500원</Text>
          <Text style={styles.monthlyComparison}>
            지난 달 같은 기간보다 5만 8,000원 더 아꼈어요
          </Text>

          {/* 카테고리별 금액 및 이미지 */}
          <View style={styles.categoryTotal}>
            <Image source={require('../assets/icons/coffee.png')} style={styles.categoryIcon} />
            <Text style={styles.categoryName}>커피 14회</Text>
            <Text style={styles.categoryAmount}>6만 2,000원</Text>
          </View>
          <View style={styles.categoryTotal}>
            <Image source={require('../assets/icons/smoke.png')} style={styles.categoryIcon} />
            <Text style={styles.categoryName}>담배 39회</Text>
            <Text style={styles.categoryAmount}>2만 3,500원</Text>
          </View>
          <View style={styles.categoryTotal}>
            <Image source={require('../assets/icons/plus.png')} style={styles.categoryIcon} />
            <Text style={styles.categoryName}>기타 17회</Text>
            <Text style={styles.categoryAmount}>29만 1,000원</Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  topSection: {
    width: '100%', // 화면의 전체 너비로 설정
    height: 250,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#E0F7FA',
  },
  bunnyImage: {
    width: '100%',
    height: 250,
    resizeMode: 'cover',
  },
  categoryContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 30,
  },
  category: {
    alignItems: 'center',
    padding: 15,
    width: 95,
    borderRadius: 10,
    backgroundColor: '#fcfcfc',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  savingSummary: {
    borderRadius: 10,
    padding: 0,
    backgroundColor: '#fcfcfc',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
    marginHorizontal: 20,
    overflow: 'hidden',
  },
  savingTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    backgroundColor: '#98A2FF',
    color: '#FFFFFF',
    paddingVertical: 10,
    paddingHorizontal: 20,
    flex: 1,
  },
  titleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#98A2FF',
    paddingHorizontal: 10,
    paddingVertical: 3,
  },
  savingTotal: {
    fontSize: 16,
    color: '#FFFFFF',
    textAlign: 'right',
  },
  savingDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  calendarSection: {
    paddingHorizontal: 10,
    paddingVertical: 10,
    marginVertical: 20,
    marginBottom: 50,
    borderRadius: 10,
    backgroundColor: '#fcfcfc',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
    marginHorizontal: 20,
    overflow: 'hidden',
  },
  monthlyTotalSection: {
    paddingHorizontal: 20,
    paddingVertical: 20,
    backgroundColor: '#ffffff',
    marginVertical: 10,
    borderRadius: 10,
  },
  monthlyTotalTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  monthlyTotalAmount: {
    fontSize: 16,
    color: 'black',
    marginVertical: 5,
  },
  monthlyComparison: {
    fontSize: 14,
    color: '#878787',
  },
  categoryTotal: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 5,
  },
  categoryIcon: {
    width: 30,
    height: 30,
    marginRight: 10,
    resizeMode: 'contain',
  },
  categoryName: {
    fontSize: 14,
    color: 'black',
    flex: 1,
  },
  categoryAmount: {
    fontSize: 14,
    color: 'black',
  },
  iconImage: {
    width: 40,
    height: 40,
    resizeMode: 'contain',
  },
  iconText: {
    marginTop: 5,
    fontSize: 12,
    textAlign: 'center',
    color: '#808080',
  },
});

export default AkkiScreen;
