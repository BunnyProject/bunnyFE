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

type CalendarComponentProps = {
  selectedCategories: {
    name: string;
    source: any;
    amount: number;
    time: string;
    id: string;
    color: string;
  }[];
  onSelectDate: (date: string) => void;
  onOpenBottomSheet: () => void;
};

const CalendarComponent: React.FC<CalendarComponentProps> = ({
  selectedCategories,
  onSelectDate,
  onOpenBottomSheet,
}) => {
  const [isModalVisible, setModalVisible] = useState(false);
  const [selectedDate, setSelectedDate] = useState('');
  const [editableAmounts, setEditableAmounts] = useState(
    selectedCategories.reduce((acc, item) => {
      acc[item.id] = item.amount.toString();
      return acc;
    }, {} as {[key: string]: string}),
  );

  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };

  const onDayPress = (day: any) => {
    setSelectedDate(day.dateString);
    toggleModal();
    onSelectDate(day.dateString);
  };

  // 금액 업데이트
  const updateAmount = (id: string, amount: string) => {
    setEditableAmounts(prev => ({...prev, [id]: amount}));
  };

  // 카테고리별 총 금액 계산
  const getCategoryTotals = () => {
    const categoryMap: {[key: string]: number} = {};
    selectedCategories.forEach(item => {
      if (categoryMap[item.name]) {
        categoryMap[item.name] += item.amount;
      } else {
        categoryMap[item.name] = item.amount;
      }
    });
    return categoryMap;
  };

  const categoryTotals = getCategoryTotals();

  return (
    <View>
      <Calendar
        onDayPress={onDayPress}
        markedDates={{
          [selectedDate]: {
            selected: true,
            marked: true,
            selectedColor: '#98A2FF',
          },
        }}
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
                      {selectedCategories
                        .reduce((sum, item) => sum + item.amount, 0)
                        .toLocaleString()}
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
                {/* 카테고리별 총 금액 표시 */}
                <View style={styles.categorySummary}>
                  {Object.keys(categoryTotals).map((category, index) => {
                    const icon = selectedCategories.find(
                      item => item.name === category,
                    )?.source;
                    return (
                      <View key={index} style={styles.categoryRow}>
                        <View
                            style={[styles.dot, {backgroundColor: icon.color}]}
                          />
                        {icon && (
                          <Image source={icon} style={styles.iconImage} />
                        )}
                        <View style={styles.categoryDetail}>
                          
                          <Text style={styles.categoryText}>{category}</Text>
                          <Text style={styles.categoryAmount}>
                            {categoryTotals[category].toLocaleString()}원
                          </Text>
                        </View>
                      </View>
                    );
                  })}
                </View>
                {/* 시간 순으로 정렬된 세부 내역 */}
                {selectedCategories
                  .sort(
                    (a, b) =>
                      new Date(a.time).getTime() - new Date(b.time).getTime(),
                  )
                  .map(item => (
                    <View style={styles.detailRow} key={item.id}>
                      <View style={styles.detailText}>
                      <View
                            style={[styles.dot, {backgroundColor: item.color}]}
                          />
                        <Text style={styles.iconText}>{item.name}</Text>
                        <TextInput
                          style={styles.amountText}
                          keyboardType="numeric"
                          value={editableAmounts[item.id]}
                          onChangeText={text => updateAmount(item.id, text)}
                        />
                      </View>
                      <TouchableOpacity
                        onPress={() => console.log('삭제 버튼 클릭')}>
                        <Ionicons name="trash-outline" size={20} />
                      </TouchableOpacity>
                    </View>
                  ))}
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
