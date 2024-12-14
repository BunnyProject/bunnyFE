import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
} from 'react-native';
import {Calendar} from 'react-native-calendars';
import Modal from 'react-native-modal';
import {format, isValid} from 'date-fns';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {TextInput} from 'react-native-gesture-handler';
import {MarkedDates, MonthlySaving} from '../types/types';
import {useSaveDetail} from '../hooks/useSaveDetail';

type CalendarComponentProps = {
  onSelectDate: (date: string) => void;
  onOpenBottomSheet: () => void;
  savings: MonthlySaving[];
  category1: {name: string; source: any; color: string};
  category2: {name: string; source: any; color: string};
  category3: {name: string; source: any; color: string};
  memberNo: number;
  markedDates: MarkedDates;
  onMonthChange: (month: number, year: number) => void;
};

const CalendarComponent: React.FC<CalendarComponentProps> = ({
  onSelectDate,
  onOpenBottomSheet,
  memberNo,
  savings,
  category1,
  category2,
  category3,
  markedDates,
  onMonthChange,
}) => {
  const [isModalVisible, setModalVisible] = useState(false);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedSavings, setSelectedSavings] = useState<MonthlySaving[]>([]);
  const [editableAmounts, setEditableAmounts] = useState<{
    [key: number]: string;
  }>({});
  const {data} = useSaveDetail(memberNo, selectedDate);

  const handleDayPress = (day) => {
    onSelectDate(day.dateString);
  };

  const handleMonthChange = (month) => {
    onMonthChange(month.month, month.year); // 월/년 정보 전달
  };


  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };

  const onDayPress = (day: any) => {
    const filteredSavings = savings.filter(
      saving => saving.savingDay === day.dateString,
    );
    setSelectedDate(day.dateString);
    setSelectedSavings(filteredSavings);
    toggleModal();
    onSelectDate(day.dateString);
  };

  const getCategoryColor = (categoryName: string) => {
    if (categoryName === category1.name) return category1.color;
    if (categoryName === category2.name) return category2.color;
    if (categoryName === category3.name) return category3.color;
    return '#DECDFF';
  };

  // 금액 업데이트
  const updateAmount = (id: string, amount: string) => {
    setEditableAmounts(prev => ({...prev, [id]: amount}));
  };
  

  return (
    <View>
      <Calendar
        onDayPress={onDayPress}
        onMonthChange={handleMonthChange}
        markedDates={markedDates || {}}
         markingType="multi-dot"
        theme={{
          selectedDayBackgroundColor: '#98A2FF',
          todayTextColor: '#98A2FF',
          arrowColor: '#5F5F5F',
        }}
      />

      {/* 모달 팝업 */}
      <Modal
        isVisible={isModalVisible}
        onBackdropPress={toggleModal}
        style={styles.modal}>
        <View style={styles.modalContainer}>
          <ScrollView contentContainerStyle={styles.scrollContent}>
            <View style={styles.modalHeader}>
              <TouchableOpacity onPress={toggleModal}>
                <Ionicons name="close" size={24} color="#FF7B7B" />
              </TouchableOpacity>
            </View>
            {isValid(new Date(selectedDate)) ? (
              <View>
                <Text style={styles.modalTitle}>
                  {format(new Date(selectedDate), 'MM월 dd일')}
                </Text>
                <View style={styles.topRow}>
                  <View style={styles.topText}>
                    <Text style={styles.modalSubTitle}>
                      {format(new Date(selectedDate), 'yyyy년 MM월 dd일')}
                    </Text>
                    <Text style={styles.modalTotal}>
                      총{' '}
                      {data?.success.totalSavingMoney
                        ? data.success.totalSavingMoney.toLocaleString()
                        : 0}
                      원
                    </Text>
                  </View>
                  <TouchableOpacity
                    onPress={onOpenBottomSheet}
                    style={styles.addButtonContainer}>
                    <View style={styles.addButtonContent}>
                      <Ionicons name="add" size={20} color="#98A2FF" />
                      <Text style={styles.buttonText}>항목추가</Text>
                    </View>
                  </TouchableOpacity>
                </View>
                <View style={styles.categorySummary}>
                  {[category1, category2, category3].map((category, index) => {
                    if (!category) return null;

                    // API 데이터에서 해당 카테고리 이름과 detail이 일치하는 항목 찾기
                    const matchingDetails =
                      data?.success.detailSaveMoneyList.filter(item =>
                        item.detail.includes(category.name),
                      );

                    // 매칭된 금액의 합계 계산
                    const totalAmount = matchingDetails
                      ? matchingDetails.reduce(
                          (sum, item) => sum + item.savingPrice,
                          0,
                        )
                      : 0;

                    // 매칭된 횟수 계산
                    const totalCount = matchingDetails
                      ? matchingDetails.length
                      : 0;

                    return (
                      <View key={index} style={styles.categoryRow}>
                        <View
                          style={[
                            styles.dot,
                            {backgroundColor: category.color || '#D3D3D3'},
                          ]}
                        />
                        {category.source && (
                          <Image
                            source={category.source}
                            style={styles.iconImage}
                          />
                        )}
                        <View style={styles.categoryDetail}>
                          <Text style={styles.categoryText}>
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

                {/* 시간 순으로 정렬된 세부 내역 */}
                {data?.success.detailSaveMoneyList
                  ?.sort(
                    (a, b) =>
                      new Date(a.savingId).getTime() -
                      new Date(b.savingId).getTime(),
                  )
                  .map(item => {
                    const displayCategoryName =
                      item.categoryName.trim() || item.detail.trim();

                    return (
                      <View style={styles.detailRow} key={item.savingId}>
                        <View style={styles.detailText}>
                          {/* 각 카테고리 색상 및 이름 표시 */}
                          <View
                            style={[
                              styles.dot,
                              {
                                backgroundColor:
                                  getCategoryColor(displayCategoryName),
                              },
                            ]}
                          />
                          <Text style={styles.iconText}>
                            {displayCategoryName}
                          </Text>

                          {/* 금액 수정 가능 */}
                          <TextInput
                            style={styles.amountText}
                            keyboardType="numeric"
                            value={
                              editableAmounts[item.savingId]?.toString() ||
                              item.savingPrice.toString()
                            }
                            onChangeText={text =>
                              updateAmount(item.savingId.toString(), text)
                            }
                          />
                        </View>

                        {/* "기타"일 때만 세부 내용 추가 표시 */}
                        {item.categoryName === '기타' && (
                          <Text style={styles.iconText}>{item.detail}</Text>
                        )}

                        {/* 삭제 버튼 */}
                        <TouchableOpacity
                          onPress={() =>
                            console.log(`${item.savingId} 삭제 클릭`)
                          }>
                          <Ionicons name="trash-outline" size={20} />
                        </TouchableOpacity>
                      </View>
                    );
                  })}
              </View>
            ) : (
              <Text style={styles.modalTitle}>유효하지 않은 날짜</Text>
            )}
          </ScrollView>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  modal: {
    justifyContent: 'center',
    marginHorizontal: 20,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 10,
  },
  modalContainer: {
    height: '80%',
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 20,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 25,
    color: '#000000',
    textAlign: 'center',
  },
  modalSubTitle: {
    fontSize: 12,
    color: '#000000',
  },
  topText: {
    alignItems: 'flex-start',
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  addButtonContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 10,
  },
  addButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 16,
    marginLeft: 5,
    color: '#98A2FF',
  },
  modalTotal: {
    fontSize: 16,
    marginBottom: 10,
    color: '#000000',
  },
  categorySummary: {
    marginVertical: 15,
  },
  categoryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10,
    gap: 10,
  },
  iconImage: {
    width: 35,
    height: 35,
    marginRight: 10,
    resizeMode: 'contain',
  },
  categoryDetail: {
    flexDirection: 'column',
  },
  categoryText: {
    fontSize: 16,
  },
  categoryAmount: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000000',
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 5,
  },
  detailText: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconText: {
    fontSize: 14,
    marginLeft: 10,
  },
  amountText: {
    fontSize: 14,
    fontWeight: 'bold',
    marginLeft: 'auto',
  },
});

export default CalendarComponent;
