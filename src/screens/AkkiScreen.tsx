import React, {useEffect, useRef, useState} from 'react';
import {
  Animated,
  ScrollView,
  View,
  Text,
  StyleSheet,
  Image,
  Modal,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import {useRoute, RouteProp} from '@react-navigation/native';
import CalendarComponent from '../components/CalendarComponent';
import AkkiBottomSheet from '../components/AkkiBottomSheet';
import {iconData} from './IconSelectScreen';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {RootStackParamList} from '../types/types';
import {useSaveMoney} from '../hooks/useSaveMoney';
import {useTodaySaving} from '../hooks/useTodaySaving';

type Carrot = {id: number; fallAnim: Animated.Value; position: number};
type Category = {name: string; source: any; color?: string};

const bunnyImage = require('../assets/AkkiBunny.png');
const carrotImage = require('../assets/Carrot.png');

const getMemberNo = async (): Promise<number | null> => {
  const userId = await AsyncStorage.getItem('userId');
  return userId ? Number(userId) : null;
};

const AkkiScreen = () => {
  const route = useRoute<RouteProp<RootStackParamList, 'Akki'>>();
  const [category1, setCategory1] = useState<Category | null>(null);
  const [category2, setCategory2] = useState<Category | null>(null);
  const [category3, setCategory3] = useState<Category | null>(null);
  const [detail, setDetail] = useState(''); // Detail input state
  const {selectedIcons} = route.params || {selectedIcons: []};
  const [selectedDate, setSelectedDate] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(
    null,
  );
  const [inputAmount, setInputAmount] = useState('');
  const [isBottomSheetVisible, setBottomSheetVisible] = useState(false);
  const [memberNo, setMemberNo] = useState<number | null>(null);

  const bunnyBounceAnim = useRef(new Animated.Value(0)).current;
  const [accumulatedCarrots, setAccumulatedCarrots] = useState<Carrot[]>([]);
  const [savings, setSavings] = useState<Record<string, number>>({기타: 0});

  const {saveMoney} = useSaveMoney();
  const {todaySaving, loading, error, refetch} = useTodaySaving(memberNo || 0);

  const DEFAULT_COLOR = '#DECDFF';
  const CATEGORY1_COLOR = '#98A2FF';
  const CATEGORY2_COLOR = '#ACD7FF';

  useEffect(() => {
    const fetchCategories = async () => {
      const fetchedMemberNo = await getMemberNo();
      setMemberNo(fetchedMemberNo);

      const savedIcons = await AsyncStorage.getItem('selectedIcons');
      if (savedIcons) {
        const {firstCategory, secondCategory, otherCategoryName} =
          JSON.parse(savedIcons);
        const category1Data = iconData.find(
          icon => icon.name === firstCategory,
        );
        const category2Data = iconData.find(
          icon => icon.name === secondCategory,
        );
        const category3Data = iconData.find(
          icon => icon.name === otherCategoryName,
        );

        // category1 설정
        if (category1Data) {
          setCategory1({
            ...category1Data,
            color: CATEGORY1_COLOR,
          });
        } else {
          setCategory1({
            name: '',
            source: null,
            color: CATEGORY1_COLOR,
          });
        }

        // category2 설정
        if (category2Data) {
          setCategory2({
            ...category2Data,
            color: CATEGORY2_COLOR,
          });
        } else {
          setCategory2({
            name: '',
            source: null,
            color: CATEGORY2_COLOR,
          });
        }

        if (category3Data) {
          setCategory3({
            ...category3Data,
            color: DEFAULT_COLOR,
          });
        } else {
          setCategory3({
            name: '',
            source: null,
            color: DEFAULT_COLOR,
          });
        }

        setSavings(prev => ({
          ...prev,
          [firstCategory]: 0,
          [secondCategory]: 0,
          [otherCategoryName]: 0,
        }));
      }
    };

    fetchCategories();
  }, []);

  const handleCategoryPress = (icon: Category) => {
    setSelectedCategory(icon);
    setModalVisible(true); // 모달 열기

    // 토끼 튀는 애니메이션
    Animated.sequence([
      Animated.timing(bunnyBounceAnim, {
        toValue: -10,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(bunnyBounceAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();
  };
  const handleComplete = async () => {
    if (selectedCategory && inputAmount) {
      try {
        const savedIcons = await AsyncStorage.getItem('selectedIcons');
        const parsedIcons = savedIcons ? JSON.parse(savedIcons) : {};

        const categoryId =
          selectedCategory.name === parsedIcons.firstCategory
            ? parsedIcons.firstCategoryId
            : selectedCategory.name === parsedIcons.secondCategory
            ? parsedIcons.secondCategoryId
            : parsedIcons.otherCategoryId;

        const today = new Date().toISOString().split('T')[0];

        await saveMoney({
          memberNo: memberNo!,
          categoryId,
          categoryName: selectedCategory.name,
          detail: selectedCategory.name === '기타' ? detail : '',
          savingDay: today,
          savingPrice: Number(inputAmount),
        });

        // 새로 추가된 데이터를 반영하기 위해 API 재호출
        if (memberNo) {
          await refetch(memberNo);
        }

        setModalVisible(false);
        setInputAmount('');
        setDetail('');
      } catch (error) {
        console.error('Error saving money:', error);
      }
    }
  };

  const handleOpenBottomSheet = () => {
    setBottomSheetVisible(true);
  };

  const handleCloseBottomSheet = () => {
    setBottomSheetVisible(false);
  };

  const testData = [
    {
      name: '술',
      source: require('../assets/icons/alcohol.png'),
      amount: 4500,
      time: '2024-10-01T09:30:00',
      id: '1',
      color: '#98A2FF',
    },
    {
      name: '쇼핑',
      source: require('../assets/icons/shopping.png'),
      amount: 12000,
      time: '2024-10-01T11:00:00',
      id: '2',
      color: '#ACD7FF',
    },
    {
      name: '기타',
      source: require('../assets/icons/plus.png'),
      amount: 5000,
      time: '2024-10-02T15:00:00',
      id: '3',
      color: DEFAULT_COLOR,
    },
    {
      name: '술',
      source: require('../assets/icons/alcohol.png'),
      amount: 3200,
      time: '2024-10-02T20:30:00',
      id: '4',
      color: '#98A2FF',
    },
    {
      name: '쇼핑',
      source: require('../assets/icons/shopping.png'),
      amount: 6500,
      time: '2024-10-03T18:45:00',
      id: '6',
      color: '#ACD7FF',
    },
  ];

  // 날짜 선택 시 처리
  const handleSelectDate = (date: string) => {
    setSelectedDate(date);
  };

  return (
    <ScrollView style={styles.container}>
      {/* 토끼와 당근 애니메이션 섹션 */}
      <View style={styles.topSection}>
        <Image
          source={require('../assets/akki-back.png')}
          style={styles.backImage}
        />
        <Animated.Image
          source={bunnyImage}
          style={[
            styles.bunnyImage,
            {transform: [{translateY: bunnyBounceAnim}]},
          ]}
        />
        {accumulatedCarrots.map((carrot, index) => (
          <Image
            key={carrot.id}
            source={carrotImage}
            style={[styles.carrotImage, {left: 200 + index * 20, bottom: 10}]}
          />
        ))}
      </View>
      {/* 선택된 아이콘과 기타 버튼을 표시하는 카테고리 버튼 */}
      <View style={styles.categoryContainer}>
        {category1 && (
          <TouchableOpacity
            style={[styles.category]}
            onPress={() => handleCategoryPress(category1)}>
            <Image source={category1.source} style={styles.iconImage} />
            <Text style={styles.iconText}>{category1.name}</Text>
          </TouchableOpacity>
        )}
        {category2 && (
          <TouchableOpacity
            style={[styles.category]}
            onPress={() => handleCategoryPress(category2)}>
            <Image source={category2.source} style={styles.iconImage} />
            <Text style={styles.iconText}>{category2.name}</Text>
          </TouchableOpacity>
        )}
        {category3 && (
          <TouchableOpacity
            style={[styles.category]}
            onPress={() => handleCategoryPress(category3)}>
            <Image source={category3.source} style={styles.iconImage} />
            <Text style={styles.iconText}>{category3.name}</Text>
          </TouchableOpacity>
        )}
      </View>
      <View style={styles.savingSummary}>
        <View style={styles.titleContainer}>
          <Text style={styles.savingTitle}>오늘의 아끼기</Text>
          {loading ? (
            <Text style={styles.loadingText}>로딩 중...</Text>
          ) : error ? (
            <Text style={styles.errorText}>오류 발생: {error}</Text>
          ) : (
            <Text style={styles.savingTotal}>
              총 {todaySaving?.todayTotalMoney.toLocaleString() || '0'}원
            </Text>
          )}
        </View>
        {!loading &&
          !error &&
          [
            {category: category1, color: CATEGORY1_COLOR},
            {category: category2, color: CATEGORY2_COLOR},
            {category: category3, color: DEFAULT_COLOR},
          ].map((entry, index) => {
            const matchingCategory = todaySaving?.todaySavingCategoryList.find(
              apiCategory => apiCategory.categoryName === entry.category?.name,
            );

            return (
              <View style={styles.savingDetails} key={index}>
                <Text>{entry.category?.name || '알 수 없음'}
                <View style={styles.dotsContainer}>
                  {Array.from({
                    length: matchingCategory?.totalSavingChance || 0,
                  }).map((_, dotIndex) => (
                    <View
                      key={dotIndex}
                      style={[styles.dot, {backgroundColor: entry.color}]}
                    />
                  ))}
                </View>
                </Text>
                <Text>
                  {matchingCategory
                    ? matchingCategory.totalSavingCategoryMoney.toLocaleString()
                    : '0'}
                  원
                </Text>
              </View>
            );
          })}
      </View>

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
                    {selectedCategory?.name === '기타' ? (
                      <TextInput
                        style={styles.textBoxTextInput}
                        placeholder="기타"
                        value={detail}
                        onChangeText={setDetail}
                      />
                    ) : (
                      <Text style={styles.textBoxText}>
                        {selectedCategory?.name}
                      </Text>
                    )}
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
          onOpenBottomSheet={handleOpenBottomSheet}
        />

        <AkkiBottomSheet
          isVisible={isBottomSheetVisible}
          onClose={handleCloseBottomSheet}
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
          {[category1, category2].map((category, index) =>
            category ? (
              <View style={styles.categoryTotal} key={index}>
                <View
                  style={[
                    styles.dot,
                    {backgroundColor: category.color || DEFAULT_COLOR},
                  ]}
                />
                <Image source={category.source} style={styles.categoryIcon} />
                <View style={styles.categoryDetail}>
                  <Text style={styles.categoryName}>{category.name} 14회</Text>
                  <Text style={styles.categoryAmount}>
                    {savings[category.name]?.toLocaleString() || '0'}원
                  </Text>
                </View>
              </View>
            ) : null,
          )}
          <View style={styles.categoryTotal}>
            <View style={[styles.dot, {backgroundColor: DEFAULT_COLOR}]} />
            <Image
              source={require('../assets/icons/plus.png')}
              style={styles.categoryIcon}
            />
            <View style={styles.categoryDetail}>
              <Text style={styles.categoryName}>기타 17회</Text>
              <Text style={styles.categoryAmount}>
                {savings['기타'].toLocaleString() || '0'}원
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
  textBoxTextInput: {
    fontSize: 16,
    color: '#FF7B7B',
    textAlign: 'center',
    padding: -10,
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
    position: 'relative',
  },
  backImage: {
    width: '100%',
    height: 250,
    resizeMode: 'cover',
    position: 'absolute',
    top: 0,
  },
  bunnyImage: {
    width: 100,
    height: 100,
    resizeMode: 'contain',
    position: 'absolute',
    top: '50%',
  },
  carrotImage: {
    position: 'absolute',
    width: 30,
    height: 30,
    resizeMode: 'contain',
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
  titleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#98A2FF',
    paddingHorizontal: 10,
    paddingVertical: 10,
  },
  savingTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  savingTotal: {
    fontSize: 16,
    color: '#FFFFFF',
  },
  savingDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 10,
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 14,
    color: '#808080',
  },
  errorText: {
    fontSize: 14,
    color: '#FF7B7B',
  },
  iconWithDots: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dotsContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingLeft: 10,
    // marginRight: 50,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 2,
  },
  amountText: {
    color: '#FF7B7B',
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
  // iconImage: {
  //   width: 40,
  //   height: 40,
  //   resizeMode: 'contain',
  // },
  // iconText: {
  //   marginTop: 5,
  //   fontSize: 12,
  //   textAlign: 'center',
  //   color: '#808080',
  // },
});

export default AkkiScreen;
