import React from 'react';
import {ScrollView, View, Text, StyleSheet, Image} from 'react-native';

const AkkiScreen = () => {
  return (
    <ScrollView style={styles.container}>
      {/* 상단 부분 (이미지 포함) */}
      <View style={styles.topSection}>
        <Image
          source={require('../assets/akki-back.png')}
          style={styles.bunnyImage}
        />
      </View>

      {/* 카테고리 버튼 */}
      <View style={styles.categoryContainer}>
        <View style={styles.category}>
          <Text>커피</Text>
        </View>
        <View style={styles.category}>
          <Text>담배</Text>
        </View>
        <View style={styles.category}>
          <Text>기타</Text>
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

      {/* 캘린더 */}
      <View style={styles.calendarSection}>
        <Text>2023년 5월</Text>
        {/* 캘린더 모양 구현은 생략 가능 */}
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
    marginVertical: 20,
  },
  category: {
    alignItems: 'center',
    padding: 30,
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
    padding: 0, // 패딩 제거, 안쪽 요소에 따로 패딩 설정
    backgroundColor: '#fcfcfc',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
    marginHorizontal: 20, // 가로 폭을 위 카테고리와 맞춤
    overflow: 'hidden', // 타이틀 부분만 색상 변경을 위한 설정
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
    backgroundColor: '#98A2FF', // 보라색 배경색 적용
    paddingHorizontal: 10, // 좌우 여백 추가
    paddingVertical: 3, // 상하 여백 추가
  },
  savingTotal: {
    fontSize: 16,
    color: '#FFFFFF',
    textAlign: 'right', // 오른쪽 정렬
  },
  savingDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20, 
    paddingVertical: 10, 
  },
  calendarSection: {
    paddingHorizontal: 20,
    paddingVertical: 10,
  },

});

export default AkkiScreen;
