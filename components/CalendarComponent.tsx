import React, { useState } from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';
import { Calendar } from 'react-native-calendars';
import Modal from 'react-native-modal';
import { format, isValid } from 'date-fns';

type CalendarComponentProps = {
  onSelectDate: (date: string) => void; // 부모에게 선택된 날짜를 전달하는 콜백
};

const CalendarComponent: React.FC<CalendarComponentProps> = ({ onSelectDate }) => {
  const [isModalVisible, setModalVisible] = useState(false);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<any[]>([]);

  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };

  const onDayPress = (day: any) => {
    setSelectedDate(day.dateString);
    setSelectedCategory([
      { name: '커피', amount: 4500 },
      { name: '담배', amount: 800 },
      { name: '쇼핑', amount: 25000 },
    ]);
    toggleModal();
    onSelectDate(day.dateString); // 선택된 날짜를 부모에게 전달
  };

  return (
    <View>
      <Calendar
        onDayPress={onDayPress}
        markedDates={{
          [selectedDate]: { selected: true, marked: true, selectedColor: '#98A2FF' },
        }}
        theme={{
          selectedDayBackgroundColor: '#98A2FF',
          todayTextColor: '#98A2FF',
          arrowColor: '#5F5F5F',
        }}
      />

      {/* 모달 팝업 */}
      <Modal isVisible={isModalVisible} onBackdropPress={toggleModal}>
        <View style={styles.modalContent}>
          {/* 날짜가 유효할 경우에만 포맷팅 */}
          {isValid(new Date(selectedDate)) ? (
            <Text style={styles.modalTitle}>
              {format(new Date(selectedDate), 'yyyy년 MM월 dd일')}
            </Text>
          ) : (
            <Text style={styles.modalTitle}>Invalid Date</Text>
          )}
          <Text style={styles.modalTotal}>
            총 {selectedCategory.reduce((sum, item) => sum + item.amount, 0)}원
          </Text>
          {selectedCategory.map((item, index) => (
            <View key={index} style={styles.categoryRow}>
              <Text>{item.name}</Text>
              <Text>{item.amount}원</Text>
            </View>
          ))}
          <Button title="닫기" onPress={toggleModal} />
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  modalContent: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderRadius: 10,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  modalTotal: {
    fontSize: 16,
    marginBottom: 10,
  },
  categoryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 5,
  },
});

export default CalendarComponent;
