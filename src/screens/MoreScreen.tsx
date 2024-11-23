import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons'; // 아이콘 추가
import { useNavigation } from '@react-navigation/native';

const MoreScreen = () => {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      {/* 상단 뒤로가기 버튼 */}
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Ionicons name="arrow-back" size={24} color="#333" />
      </TouchableOpacity>

      {/* 내 정보 섹션 */}
      <Text style={styles.sectionTitle}>내 정보</Text>
      <View style={styles.section}>
        <TouchableOpacity
          style={styles.item}
          onPress={() => navigation.navigate('UserInfo2')}
        >
          <Text style={styles.itemText}>급여 / 근무시간 변경</Text>
          <Text style={styles.arrow}>›</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.item}
          onPress={() => navigation.navigate('IconSelectScreen')}
        >
          <Text style={styles.itemText}>아끼기 항목 변경</Text>
          <Text style={styles.arrow}>›</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.item}
          onPress={() => navigation.navigate('UserInfo')}
        >
          <Text style={styles.itemText}>내 개인 정보</Text>
          <Text style={styles.arrow}>›</Text>
        </TouchableOpacity>
      </View>

      {/* 기타 섹션 */}
      <Text style={styles.sectionTitle}>기타</Text>
      <View style={styles.section}>
        <TouchableOpacity style={styles.item}>
          <Text style={styles.itemText}>자주 묻는 질문</Text>
          <Text style={styles.arrow}>›</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.item}>
          <Text style={styles.itemText}>문의하기</Text>
          <Text style={styles.arrow}>›</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.item}>
          <Text style={styles.itemText}>리뷰 남기기</Text>
          <Text style={styles.arrow}>›</Text>
        </TouchableOpacity>
      </View>

      {/* 로그아웃 및 탈퇴하기 */}
      <View style={styles.footer}>
        <TouchableOpacity style={styles.logoutButton}>
          <Text style={styles.logoutText}>로그아웃</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.exitButton}>
          <Text style={styles.exitText}>탈퇴하기</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingVertical: 20,
    backgroundColor: '#FFFFFF',
  },
  backButton: {
    position: 'absolute',
    top: 20,
    left: 20,
    zIndex: 1,
  },
  section: {
    // marginBottom: 20,
    backgroundColor: '#F9F9F9',
    borderRadius: 10,
    padding: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 10,
    marginTop: 50,
  },
  item: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
  },
  itemText: {
    fontSize: 15,
    color: '#333333',
  },
  arrow: {
    fontSize: 30,
    color: '#98A2FF',
  },
  footer: {
    marginTop: 'auto',
    marginBottom: 50,
    backgroundColor: '#F9F9F9',
    borderRadius: 10,
    padding: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  logoutButton: {
    paddingVertical: 12,
  },
  exitButton: {
    paddingVertical: 12,
  },
  logoutText: {
    color: '#FF3B30',
    fontSize: 15,
  },
  exitText: {
    color: '#FF3B30',
    fontSize: 15,
  },
});

export default MoreScreen;
