import React, {useState} from 'react';
import {
  ScrollView,
  View,
  Text,
  StyleSheet,
  Image,
  Modal,
  TouchableOpacity,
  TextInput,
  Button,
} from 'react-native';
import {useRoute, RouteProp} from '@react-navigation/native';
import CalendarComponent from '../components/CalendarComponent';
import Ionicons from 'react-native-vector-icons/Ionicons';

type RootStackParamList = {
  AkkiScreen: {
    selectedIcons: {name: string; source: any}[]; // 선택된 아이콘 타입 정의
  };
};

const AkkiScreen = () => {
  const route = useRoute<RouteProp<RootStackParamList, 'AkkiScreen'>>();
  const {selectedIcons} = route.params || {selectedIcons: []};
  const [selectedDate, setSelectedDate] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<{
    name: string;
    source: any;
  } | null>(null);
  const [inputAmount, setInputAmount] = useState('');

  const testData = [
    {
      name: '술',
      amount: 4500,
      time: '2024-10-01T09:30:00',
      id: '1',
      source: selectedIcons.find(icon => icon.name === '술')?.source,
    },
    {
      name: '술',
      amount: 800,
      time: '2024-10-01T11:00:00',
      id: '2',
      source: selectedIcons.find(icon => icon.name === '술')?.source,
    },
    {
      name: '쇼핑',
      amount: 25000,
      time: '2024-10-01T14:00:00',
      id: '3',
      source: selectedIcons.find(icon => icon.name === '쇼핑')?.source,
    },
    {
      name: '기타',
      amount: 2000,
      time: '2024-10-01T16:30:00',
      id: '4',
      source: require('../assets/icons/plus.png'),
    },  {
      name: '술',
      amount: 4500,
      time: '2024-10-01T09:30:00',
      id: '5',
      source: selectedIcons.find(icon => icon.name === '술')?.source,
    },
    {
      name: '술',
      amount: 800,
      time: '2024-10-01T11:00:00',
      id: '6',
      source: selectedIcons.find(icon => icon.name === '술')?.source,
    },
    {
      name: '쇼핑',
      amount: 25000,
      time: '2024-10-01T14:00:00',
      id: '7',
      source: selectedIcons.find(icon => icon.name === '쇼핑')?.source,
    },
    {
      name: '기타',
      amount: 2000,
      time: '2024-10-01T16:30:00',
      id: '8',
      source: require('../assets/icons/plus.png'),
    },  {
      name: '술',
      amount: 4500,
      time: '2024-10-01T09:30:00',
      id: '9',
      source: selectedIcons.find(icon => icon.name === '술')?.source,
    },
    {
      name: '술',
      amount: 800,
      time: '2024-10-01T11:00:00',
      id: '10',
      source: selectedIcons.find(icon => icon.name === '술')?.source,
    },
    {
      name: '쇼핑',
      amount: 25000,
      time: '2024-10-01T14:00:00',
      id: '11',
      source: selectedIcons.find(icon => icon.name === '쇼핑')?.source,
    },
    {
      name: '기타',
      amount: 2000,
      time: '2024-10-01T16:30:00',
      id: '12',
      source: require('../assets/icons/plus.png'),
    },
  ];

  // 전 페이지에서 선택된 두 카테고리에 기반한 초기 상태 설정
  const initialSavings = selectedIcons.reduce(
    (acc, icon) => {
      acc[icon.name] = 0;
      return acc;
    },
    {기타: 0},
  );

  const [savings, setSavings] = useState(initialSavings);

  // 날짜 선택 시 처리
  const handleSelectDate = (date: string) => {
    setSelectedDate(date); // 선택된 날짜를 저장
  };

  // 카테고리 버튼 클릭 시 팝업 열기
  const openModal = (category: {name: string; source: any}) => {
    setSelectedCategory(category);
    setModalVisible(true);
  };

  // 팝업 완료 버튼 클릭 시 처리
  const handleComplete = () => {
    if (selectedCategory && inputAmount) {
      setSavings(prevSavings => ({
        ...prevSavings,
        [selectedCategory.name]:
          prevSavings[selectedCategory.name] + parseInt(inputAmount, 10),
      }));
      setModalVisible(false);
      setInputAmount('');
    }
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
          <TouchableOpacity
            key={icon.name}
            style={styles.category}
            onPress={() => openModal(icon)}>
            <Image source={icon.source} style={styles.iconImage} />
            <Text style={styles.iconText}>{icon.name}</Text>
          </TouchableOpacity>
        ))}
        <TouchableOpacity
          style={styles.category}
          onPress={() =>
            openModal({
              name: '기타',
              source: require('../assets/icons/plus.png'),
            })
          }>
          <Image
            source={require('../assets/icons/plus.png')}
            style={styles.iconImage}
          />
          <Text style={styles.iconText}>기타</Text>
        </TouchableOpacity>
      </View>
      {/* 오늘의 아끼기 */}
      <View style={styles.savingSummary}>
        <View style={styles.titleContainer}>
          <Text style={styles.savingTitle}>오늘의 아끼기</Text>
          <Text style={styles.savingTotal}>
            총{' '}
            {Object.values(savings)
              .reduce((a, b) => a + b, 0)
              .toLocaleString()}
            원
          </Text>
        </View>
        {/* 선택된 카테고리들을 표시하고 기타를 항상 마지막에 표시 */}
        {selectedIcons.map(icon => (
          <View style={styles.savingDetails} key={icon.name}>
            <Text>{icon.name}</Text>
            <Text>{savings[icon.name]?.toLocaleString() || '0'}원</Text>
          </View>
        ))}
        <View style={styles.savingDetails}>
          <Text>기타</Text>
          <Text>{savings['기타'].toLocaleString()}원</Text>
        </View>
      </View>
      {/* 팝업 모달 */}
      <Modal visible={modalVisible} transparent={true} animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            {selectedCategory && (
              <>
                <View style={styles.modalDetail}>
                  <Image
                    source={selectedCategory.source}
                    style={styles.modalIcon}
                  />
                  <View style={styles.textBox}>
                    <Text style={styles.textBoxText}>
                      {selectedCategory.name}
                    </Text>
                  </View>
                  <Text style={styles.modalText}>을(를)</Text>
                </View>
                <View style={styles.modalDetail}>
                  <TextInput
                    style={styles.input}
                    placeholder="금액"
                    keyboardType="numeric"
                    value={inputAmount}
                    onChangeText={setInputAmount}
                  />
                  <Text style={styles.modalText}>원 아꼈어요.</Text>
                </View>
                <View style={styles.buttons}>
                  <TouchableOpacity
                    style={styles.cancelButton}
                    onPress={() => setModalVisible(false)}>
                    <Text style={styles.buttonText}>취소</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.completeButton}
                    onPress={handleComplete}>
                    <Text style={styles.buttonText}>완료</Text>
                  </TouchableOpacity>
                </View>
              </>
            )}
          </View>
        </View>
      </Modal>
      {/* 캘린더 컴포넌트 사용 */}
      <View style={styles.calendarSection}>
        <CalendarComponent
          onSelectDate={handleSelectDate}
          // selectedCategories={savings[selectedDate] || []}
          selectedCategories={testData}
        />
        {/* 월별 총 아끼기 금액 */}
        <View style={styles.monthlyTotalSection}>
          <Text style={styles.monthlyTotalTitle}>이번 달 아끼기 누적액</Text>
          <Text style={styles.monthlyTotalAmount}>총 37만 6,500원</Text>
          <Text style={styles.monthlyComparison}>
            지난 달 같은 기간보다{' '}
            <Text style={styles.amountHighlight}>5만 8,000원</Text> 더 아꼈어요
          </Text>

          {/* 카테고리별 금액 및 이미지 */}
          {selectedIcons.map(icon => (
            <View style={styles.categoryTotal} key={icon.name}>
              <Image source={icon.source} style={styles.categoryIcon} />
              <View style={styles.categoryDetail}>
                <Text style={styles.categoryName}>{icon.name} 14회</Text>
                <Text style={styles.categoryAmount}>
                  {savings[icon.name].toLocaleString()}원
                </Text>
              </View>
            </View>
          ))}
          <View style={styles.categoryTotal}>
            <Image
              source={require('../assets/icons/plus.png')}
              style={styles.categoryIcon}
            />
            <View style={styles.categoryDetail}>
              <Text style={styles.categoryName}>기타 17회</Text>
              <Text style={styles.categoryAmount}>
                {savings['기타'].toLocaleString()}원
              </Text>
            </View>
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
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: 300,
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 10,
  },
  modalDetail: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    padding: 5,
  },
  modalIcon: {
    width: 40,
    height: 40,
    marginBottom: 10,
    resizeMode: 'contain',
  },
  modalText: {
    fontSize: 16,
    marginBottom: 10,
    padding: 10,
    color: '#000000',
  },
  input: {
    width: '50%',
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    marginBottom: 10,
    borderRadius: 5,
    color: '#FF7B7B',
    textAlign: 'center',
  },
  textBox: {
    width: '50%',
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    justifyContent: 'center',
    marginBottom: 10,
    marginLeft: 10,
    backgroundColor: '#f9f9f9',
  },
  textBoxText: {
    fontSize: 16,
    color: '#FF7B7B',
    textAlign: 'center',
  },
  buttons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
  },
  cancelButton: {
    backgroundColor: '#A9A9A9',
    paddingVertical: 8,
    paddingHorizontal: 40,
    borderRadius: 10,
    alignItems: 'center',
  },
  completeButton: {
    backgroundColor: '#98A2FF',
    paddingVertical: 8,
    paddingHorizontal: 40,
    borderRadius: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  topSection: {
    width: '100%',
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
    marginVertical: 20,
    borderRadius: 10,
  },
  monthlyTotalTitle: {
    fontSize: 15,
    color: '#000000',
  },
  monthlyTotalAmount: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#000000',
    marginVertical: 7,
  },
  monthlyComparison: {
    fontSize: 14,
    color: '#878787',
    marginBottom: 10,
  },
  amountHighlight: {
    color: '#98A2FF',
  },
  categoryTotal: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginVertical: 10,
  },
  categoryDetail: {
    flexDirection: 'column',
    paddingLeft: 20,
  },
  categoryIcon: {
    width: 35,
    height: 35,
    marginRight: 10,
    resizeMode: 'contain',
  },
  categoryName: {
    fontSize: 14,
    color: '#737373',
    flex: 1,
  },
  categoryAmount: {
    fontSize: 14,
    color: '#000000',
    fontWeight: 'bold',
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
