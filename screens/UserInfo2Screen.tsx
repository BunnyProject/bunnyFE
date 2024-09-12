import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Modal,
  StyleSheet,
  ScrollView,
} from 'react-native';
import {Picker} from '@react-native-picker/picker';
import {WheelPicker} from 'react-native-wheel-picker-android';
import {StackNavigationProp} from '@react-navigation/stack';
import {RootStackParamList} from '../navigation/MainNavigation';

type Info2ScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  'UserInfo2'
>;

type Props = {
  navigation: Info2ScreenNavigationProp;
};

export default function Info2Screen({navigation}: Props) {
  const [salaryType, setSalaryType] = useState('월급');
  const [salary, setSalary] = useState('');
  const [workDays, setWorkDays] = useState<string[]>([]);
  const [startTime, setStartTime] = useState('09:00');
  const [endTime, setEndTime] = useState('18:30');

  const [isStartTimePickerVisible, setStartTimePickerVisible] = useState(false);
  const [isEndTimePickerVisible, setEndTimePickerVisible] = useState(false);

  const toggleWorkDay = (day: string) => {
    if (day === '매일') {
      if (workDays.length === 7) {
        setWorkDays([]); // 매일을 해제하면 모든 요일이 해제됨
      } else {
        setWorkDays(['월', '화', '수', '목', '금', '토', '일']); // 매일을 클릭하면 모든 요일이 선택됨
      }
    } else {
      setWorkDays(
        prevDays =>
          prevDays.includes(day)
            ? prevDays.filter(d => d !== day) // 이미 선택된 요일은 해제
            : [...prevDays, day], // 새로 선택된 요일은 추가
      );
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>반갑습니다. 홍길동 님.</Text>
        <Text style={styles.subtitle}>
          수령하시는 급여와 근무시간을 알려주세요.
        </Text>

        {/* 급여 기준 Picker */}
        <Text style={styles.label}>기준</Text>
        <View
          style={[
            styles.pickerContainer,
            salaryType && styles.completedInput, // 선택된 경우 보라색 테두리
          ]}>
          <Picker
            selectedValue={salaryType}
            onValueChange={itemValue => setSalaryType(itemValue)}
            style={styles.picker}>
            <Picker.Item label="월급" value="월급" />
            <Picker.Item label="주급" value="주급" />
            <Picker.Item label="일급" value="일급" />
            <Picker.Item label="시급" value="시급" />
          </Picker>
        </View>

        {/* 금액 입력 */}
        <Text style={styles.label}>금액</Text>
        <View
          style={[
            styles.inputContainer,
            salary && styles.completedInput, // 금액이 입력되면 보라색 테두리
          ]}>
          <TextInput
            style={styles.input}
            placeholder="금액을 입력하세요"
            keyboardType="numeric"
            value={salary}
            onChangeText={setSalary}
          />
          <Text style={styles.inputUnit}>만원</Text>
        </View>

        {/* 출근일 선택 */}
        <Text style={styles.label}>출근일</Text>
        <View style={styles.daysContainer}>
          {['월', '화', '수', '목', '금', '토', '일', '매일'].map(day => (
            <TouchableOpacity
              key={day}
              style={[
                styles.dayButton,
                workDays.includes(day) && styles.selectedDayButton, // 선택된 요일에 스타일 적용
              ]}
              onPress={() => toggleWorkDay(day)}>
              <Text
                style={
                  workDays.includes(day)
                    ? styles.selectedDayText
                    : styles.unselectedDayText
                }>
                {day}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* 출퇴근 시간 선택 */}
        <Text style={styles.label}>출퇴근 시간</Text>
        <View style={styles.timeContainer}>
          {/* 출근 시간 */}
          <TouchableOpacity
            style={[
              styles.timeButton,
              startTime && styles.completedInput, // 출근 시간이 선택된 경우 보라색 테두리
            ]}
            onPress={() => setStartTimePickerVisible(true)}>
            <Text style={styles.timeText}>{startTime}</Text>
          </TouchableOpacity>

          {/* 퇴근 시간 */}
          <TouchableOpacity
            style={[
              styles.timeButton,
              endTime && styles.completedInput, // 퇴근 시간이 선택된 경우 보라색 테두리
            ]}
            onPress={() => setEndTimePickerVisible(true)}>
            <Text style={styles.timeText}>{endTime}</Text>
          </TouchableOpacity>
        </View>

        {/* 출근 시간 Picker 모달 */}
        <Modal
          visible={isStartTimePickerVisible}
          transparent={true}
          animationType="slide"
          onRequestClose={() => setStartTimePickerVisible(false)}>
          <View style={styles.modalContainer}>
            <View style={styles.pickerWrapper}>
              <WheelPicker
                selectedItem={parseInt(startTime.split(':')[0], 10)}
                data={Array.from(
                  {length: 24},
                  (_, i) => `${i.toString().padStart(2, '0')}:00`,
                )}
                onItemSelected={index =>
                  setStartTime(`${index.toString().padStart(2, '0')}:00`)
                }
                itemTextFontFamily="Arial"
                selectedItemTextFontFamily="Arial-BoldMT"
                itemTextSize={20}
                selectedItemTextSize={24}
                selectedItemTextColor="#98A2FF" // 올바른 색상 형식 사용
                itemTextColor="#999999" // 선택된 아이템 텍스트 색상
              />
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => setStartTimePickerVisible(false)}>
                <Text style={styles.closeButtonText}>완료</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        {/* 퇴근 시간 Picker 모달 */}
        <Modal
          visible={isEndTimePickerVisible}
          transparent={true}
          animationType="slide"
          onRequestClose={() => setEndTimePickerVisible(false)}>
          <View style={styles.modalContainer}>
            <View style={styles.pickerWrapper}>
              <WheelPicker
                selectedItem={parseInt(endTime.split(':')[0], 10)}
                data={Array.from(
                  {length: 24},
                  (_, i) => `${i.toString().padStart(2, '0')}:30`,
                )}
                onItemSelected={index =>
                  setEndTime(`${index.toString().padStart(2, '0')}:30`)
                }
                itemTextFontFamily="Arial" // 기본 아이템 폰트 패밀리
                selectedItemTextFontFamily="Arial-BoldMT" // 선택된 아이템 폰트 패밀리
                itemTextSize={20} // 아이템 텍스트 크기
                selectedItemTextSize={24}
                selectedItemTextColor="#98A2FF" // 올바른 색상 형식 사용
                itemTextColor="#999999"
              />
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => setEndTimePickerVisible(false)}>
                <Text style={styles.closeButtonText}>완료</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </ScrollView>

      {/* 버튼을 하단에 고정 */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.prevButton}
          onPress={() => navigation.navigate('UserInfo')}>
          <Text style={styles.buttonText}>이전</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.nextButton}
          onPress={() =>
            navigation.navigate('UserInfo3', {
              salaryType,
              salary,
              workDays,
              startTime,
              endTime,
            })
          }>
          <Text style={styles.buttonText}>다음</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    padding: 20,
    paddingBottom: 100, 
    flexGrow: 1,
    justifyContent: 'space-between',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'left',
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 30,
    textAlign: 'left',
    color: '#666',
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#E7E7E7',
    borderRadius: 8,
    marginBottom: 30,
  },
  picker: {
    padding: 10,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E7E7E7',
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 30,
  },
  input: {
    flex: 1,
    fontSize: 16,
  },
  inputUnit: {
    fontSize: 16,
    color: '#666',
    marginLeft: 5,
  },
  completedInput: {
    borderColor: '#98A2FF', // 입력 완료된 항목에 보라색 테두리
  },
  daysContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 30,
  },
  dayButton: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderWidth: 1,
    borderColor: '#E7E7E7',
    borderRadius: 8,
  },
  selectedDayButton: {
    backgroundColor: '#ffffff',
    borderColor: '#98A2FF',
  },
  unselectedDayText: {
    color: '#000',
  },
  selectedDayText: {
    color: '#98A2FF',
  },
  timeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  buttonContainer: {
    position: 'absolute', // 버튼을 하단에 고정
    bottom: 10,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: '#fff',
  },
  prevButton: {
    flex: 1,
    backgroundColor: '#E0E0E0',
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginRight: 10,
  },
  nextButton: {
    flex: 1,
    backgroundColor: '#98A2FF',
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginLeft: 10,
  },
  buttonText: {
    color: '#FFF',
    fontSize: 16,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  pickerWrapper: {
    width: '80%',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
  },
  closeButton: {
    backgroundColor: '#98A2FF',
    paddingVertical: 8,
    paddingHorizontal: 25,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  closeButtonText: {
    color: '#FFF',
    fontSize: 16,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
  },
  timeButton: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#98A2FF',
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 5,
  },
  timeText: {
    fontSize: 16,
    color: '#98A2FF',
  },
});
