import React, {useCallback, useEffect, useRef, useState} from 'react';
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
import {
  MarkedDates,
  MonthlySaving,
  RootStackParamList,
  TodaySavingCategory,
} from '../types/types';
import {useSaveMoney} from '../hooks/useSaveMoney';
import {useTodaySaving} from '../hooks/useTodaySaving';
import {useMonthlySavings} from '../hooks/useMonthlySavings';
import {refetchAll} from '../api/AkkiApi';

type Carrot = {id: number; fallAnim: Animated.Value; position: number};
type Category = {name: string; source: any; color?: string};

const bunnyImage = require('../assets/AkkiBunny.png');
const carrotImage = require('../assets/Carrot.png');

const getMemberNo = async (): Promise<number | null> => {
  const userId = await AsyncStorage.getItem('userId');
  return userId ? Number(userId) : null;
};

const getMonthStartAndEndDates = (
  year?: number,
  month?: number,
): {start: string; end: string} => {
  const now = new Date();
  const targetYear = year || now.getFullYear();
  const targetMonth = typeof month === 'number' ? month - 1 : now.getMonth();

  const start = new Date(targetYear, targetMonth, 1);
  const end = new Date(targetYear, targetMonth + 1, 0);

  return {
    start: start.toISOString().split('T')[0],
    end: end.toISOString().split('T')[0],
  };
};

const getPreviousMonthRange = (year: number, month: number) => {
  const prevMonth = month - 1 === 0 ? 12 : month - 1;
  const prevYear = month - 1 === 0 ? year - 1 : year;

  const start = new Date(prevYear, prevMonth - 1, 1);
  const end = new Date(prevYear, prevMonth, 0);

  return {
    start: start.toISOString().split('T')[0],
    end: end.toISOString().split('T')[0],
  };
};

const AkkiScreen = () => {
  const route = useRoute<RouteProp<RootStackParamList, 'Akki'>>();
  // const { selectedIcons } = route.params || { selectedIcons: [] };
  const bunnyBounceAnim = useRef(new Animated.Value(0)).current;
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [category1, setCategory1] = useState<any>(null);
  const [category2, setCategory2] = useState<any>(null);
  const [category3, setCategory3] = useState<any>(null);
  const [selectedCategory, setSelectedCategory] = useState<any>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [inputAmount, setInputAmount] = useState('');
  const [isBottomSheetVisible, setBottomSheetVisible] = useState(false);
  const [detail, setDetail] = useState('');
  const [memberNo, setMemberNo] = useState<number | null>(null);
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth() + 1); // 현재 월
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear()); // 현재 연도
  const [markedDates, setMarkedDates] = useState({});
  const [todaySavingState, setTodaySavingState] = useState<any>(null);
  const [fallingCarrots, setFallingCarrots] = useState<Carrot[]>([]);
  const [monthlySavingsState, setMonthlySavingsState] = useState<
    MonthlySaving[]
  >([]);
  const [savingDetailsState, setSavingDetailsState] = useState<any>(null);
  const {start: prevStart, end: prevEnd} = getPreviousMonthRange(
    currentYear,
    currentMonth,
  );

  const {savings: prevSavings} = useMonthlySavings(
    memberNo || 0,
    prevStart,
    prevEnd,
    category1?.name || '',
    category2?.name || '',
    category3?.name || '',
  );

  const calculateDifference = () => {
    const currentTotal = monthlySavingsState.reduce(
      (sum, saving) => sum + saving.savingPrice,
      0,
    );
    const prevTotal = prevSavings.reduce(
      (sum, saving) => sum + saving.savingPrice,
      0,
    );

    const difference = currentTotal - prevTotal;
    return {
      difference,
      currentTotal,
      prevTotal,
    };
  };

  const {difference} = calculateDifference();

  const {loading} = useTodaySaving(memberNo || 0);
  const {saveMoney} = useSaveMoney();

  const DEFAULT_COLOR = '#DECDFF';
  const CATEGORY1_COLOR = '#98A2FF';
  const CATEGORY2_COLOR = '#ACD7FF';

  const addFallingCarrot = () => {
    const bunnyLeft = 150; // 토끼 이미지의 대략적인 `left` 위치
    const bunnyWidth = 100; // 토끼 이미지의 폭
    const carrotStartMin = bunnyLeft - 40; // 토끼 이미지의 왼쪽 경계
    const carrotStartMax = bunnyLeft + bunnyWidth + 40; // 토끼 이미지의 오른쪽 경계
  
    const randomX = Math.random() * (carrotStartMax - carrotStartMin) + carrotStartMin;
  
    const newCarrot = {
      id: Date.now(),
      fallAnim: new Animated.Value(-50), // 시작 위치
      position: randomX, // 랜덤한 x축 위치 (초기값)
    };

    setFallingCarrots(prev => [...prev, newCarrot]);

    // 애니메이션 시작
    Animated.timing(newCarrot.fallAnim, {
      toValue: 100,
      duration: 1500, // 떨어지는 시간
      useNativeDriver: true,
    }).start(() => { setFallingCarrots(prev => [...prev]);
    });
  };

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
      }
    };

    fetchCategories();
  }, []);

  const getCategoryColor = useCallback(
    (categoryName: string): string => {
      if (category1 && categoryName === category1.name) {
        return CATEGORY1_COLOR;
      } else if (category2 && categoryName === category2.name) {
        return CATEGORY2_COLOR;
      } else if (category3 && categoryName === category3.name) {
        return DEFAULT_COLOR;
      }
      return '#D3D3D3';
    },
    [category1, category2, category3],
  );

  useEffect(() => {
    if (!loading && monthlySavingsState) {
      const newMarkedDates: MarkedDates = {};

      monthlySavingsState.forEach((saving: MonthlySaving) => {
        const date = saving.savingDay;

        if (!newMarkedDates[date]) {
          newMarkedDates[date] = {marked: true, dots: []};
        }

        const existingDot = newMarkedDates[date].dots?.find(
          dot => dot.color === getCategoryColor(saving.categoryName),
        );

        if (!existingDot) {
          newMarkedDates[date].dots?.push({
            key: `${saving.savingId}`,
            color: getCategoryColor(saving.categoryName),
          });
        }
      });

      setMarkedDates(newMarkedDates);
    }
  }, [loading, monthlySavingsState, getCategoryColor]);

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

        // 저장 요청
        await saveMoney({
          memberNo: memberNo!,
          categoryId,
          categoryName: selectedCategory.name,
          detail: selectedCategory.name === '기타' ? detail : '',
          savingDay: today,
          savingPrice: Number(inputAmount),
        });

        if (memberNo) {
          const {start, end} = getMonthStartAndEndDates(
            currentYear,
            currentMonth,
          );
          const refetchedData = await refetchAll(memberNo!, start, end, today);

          // 상태 업데이트
          setTodaySavingState(refetchedData.todaySaving);
          setMonthlySavingsState(refetchedData.monthlySavings);
          setSavingDetailsState(refetchedData.savingDetails);
        }
        addFallingCarrot();

        // 모달 닫기 및 입력 초기화
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

  // 날짜 선택 시 처리
  const handleSelectDate = (date: string) => {
    setSelectedDate(date);
  };

  const handleMonthChange = async (month: number, year: number) => {
    try {
      setCurrentMonth(month);
      setCurrentYear(year);

      const {start, end} = getMonthStartAndEndDates(year, month);

      const refetchedData = await refetchAll(
        memberNo!,
        start,
        end,
        selectedDate,
      );

      setMonthlySavingsState(refetchedData.monthlySavings);
    } catch (error) {
      console.error('Error fetching monthly savings:', error);
    }
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
        {fallingCarrots.map(carrot => (
          <Animated.Image
            key={carrot.id}
            source={carrotImage}
            style={[
              styles.carrotImage,
              {
                position: 'absolute',
                left: carrot.position, // 고정된 위치 사용
                transform: [{translateY: carrot.fallAnim}],
              },
            ]}
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
          <Text style={styles.savingTotal}>
            총 {todaySavingState?.todayTotalMoney.toLocaleString() || '0'}원
          </Text>
        </View>
        {[
          {category: category1, color: CATEGORY1_COLOR},
          {category: category2, color: CATEGORY2_COLOR},
          {category: category3, color: DEFAULT_COLOR},
        ].map((entry, index) => {
          const matchingCategory =
            todaySavingState?.todaySavingCategoryList.find(
              (apiCategory: TodaySavingCategory) =>
                apiCategory.categoryName === entry.category?.name,
            );

          return (
            <View style={styles.savingDetails} key={index}>
              <Text>
                {entry.category?.name || '알 수 없음'}
                <View style={styles.dotsContainer}>
                  {/* totalSavingChance에 따라 점(dot) 추가 */}
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
          onOpenBottomSheet={handleOpenBottomSheet}
          savings={monthlySavingsState}
          category1={category1}
          category2={category2}
          category3={category3}
          memberNo={memberNo || 0}
          markedDates={markedDates}
          onMonthChange={handleMonthChange}
        />

        <AkkiBottomSheet
          isVisible={isBottomSheetVisible}
          onClose={handleCloseBottomSheet}
        />
        {/* 월별 총 아끼기 금액 */}
        <View style={styles.monthlyTotalSection}>
          <Text style={styles.monthlyTotalTitle}>이번 달 아끼기 누적액</Text>
          <Text style={styles.monthlyTotalAmount}>
            총{' '}
            {monthlySavingsState
              .reduce((sum, saving) => sum + saving.savingPrice, 0)
              .toLocaleString() || '0'}
            원
          </Text>
          <Text style={styles.monthlyComparison}>
            지난 달 같은 기간보다{' '}
            <Text
              style={[
                styles.amountHighlight,
                {color: difference > 0 ? '#98A2FF' : '#FF7B7B'},
              ]}>
              {Math.abs(difference).toLocaleString()}원
            </Text>{' '}
            {difference > 0 ? '더 아꼈어요' : '덜 아꼈어요'}
          </Text>

          {[category1, category2, category3].map((category, index) => {
            if (!category) return null;

            const filteredSavings = monthlySavingsState.filter(
              saving => saving.categoryName === category.name,
            );
            const totalAmount = filteredSavings.reduce(
              (sum, saving) => sum + saving.savingPrice,
              0,
            );
            const totalCount = filteredSavings.length;

            return (
              <View style={styles.categoryTotal} key={index}>
                <View
                  style={[
                    styles.dot,
                    {backgroundColor: category.color || DEFAULT_COLOR},
                  ]}
                />
                <Image source={category.source} style={styles.categoryIcon} />
                <View style={styles.categoryDetail}>
                  <Text style={styles.categoryName}>
                    {category.name} {totalCount}회
                  </Text>
                  <Text style={styles.categoryAmount}>
                    {totalAmount.toLocaleString()}원
                  </Text>
                </View>
              </View>
            );
          })}
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
    left: '50%',
    marginLeft: -50, 
  },
  carrotImage: {
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
