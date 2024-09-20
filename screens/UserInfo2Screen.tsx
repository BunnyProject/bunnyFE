import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native';
import {Dropdown} from 'react-native-element-dropdown';
import {StackNavigationProp} from '@react-navigation/stack';
import {RootStackParamList} from '../navigation/MainNavigation';

type Info2ScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  'UserInfo2'
>;

type Props = {
  navigation: Info2ScreenNavigationProp;
};

// 10분 단위로 시간을 선택할 수 있는 데이터 생성
const timeData = Array.from({length: 24 * 6}, (_, i) => {
  const hours = Math.floor(i / 6).toString().padStart(2, '0');
  const minutes = (i % 6) * 10;
  return {
    label: `${hours}:${minutes.toString().padStart(2, '0')}`,
    value: `${hours}:${minutes.toString().padStart(2, '0')}`,
  };
});

const salaryTypeData = [
  {label: '월급', value: '월급'},
  {label: '주급', value: '주급'},
  {label: '일급', value: '일급'},
  {label: '시급', value: '시급'},
];

export default function Info2Screen({navigation}: Props) {
  const [salaryType, setSalaryType] = useState('월급');
  const [salary, setSalary] = useState('');
  const [workDays, setWorkDays] = useState<string[]>([]);
  const [startTime, setStartTime] = useState('09:00');
  const [endTime, setEndTime] = useState('18:00');

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

        <Text style={styles.label}>기준</Text>
        <View
          style={[
            styles.salaryDropdownContainer,
            salaryType && styles.completedInput,
          ]}>
          <Dropdown
            style={styles.dropdown}
            data={salaryTypeData}
            labelField="label"
            valueField="value"
            placeholder="급여 기준을 선택하세요"
            value={salaryType}
            onChange={item => setSalaryType(item.value)}
            maxHeight={200}
            flatListProps={{
              initialNumToRender: 3,
              maxToRenderPerBatch: 3,
            }}
            containerStyle={{
              marginTop: -50, // 드롭다운과 필드 사이의 간격을 줄임
            }}
          />
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
          {/* 출근 시간 Dropdown */}
          <View
            style={[
              styles.dropdownContainer,
              startTime && styles.completedInput,
            ]}>
            <Dropdown
              style={styles.dropdown}
              data={timeData}
              labelField="label"
              valueField="value"
              placeholder="출근 시간을 선택하세요"
              value={startTime}
              onChange={item => setStartTime(item.value)}
              maxHeight={100}
              flatListProps={{
                initialNumToRender: 2,
                maxToRenderPerBatch: 2,
                initialScrollIndex: timeData.findIndex(item => item.value === startTime), // 현재 선택된 값으로 스크롤
                // getItemLayout: (_, index) => ({ length: 50, offset: 50 * index, index }), 
              }}
              // containerStyle={{
              //   marginTop: 1, // 드롭다운과 필드 사이의 간격을 줄임
              // }}
            />
          </View>

          {/* 퇴근 시간 Dropdown */}
          <View
            style={[
              styles.dropdownContainer,
              endTime && styles.completedInput,
            ]}>
            <Dropdown
              style={styles.dropdown}
              data={timeData}
              labelField="label"
              valueField="value"
              placeholder="퇴근 시간을 선택하세요"
              value={endTime}
              onChange={item => setEndTime(item.value)}
              maxHeight={100}
              flatListProps={{
                initialNumToRender: 2,
                maxToRenderPerBatch: 2,
                initialScrollIndex: timeData.findIndex(item => item.value === endTime), // 현재 선택된 값으로 스크롤
                // getItemLayout: (_, index) => ({ length: 50, offset: 50 * index, index }), 
              }}
            />
          </View>
        </View>
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
            navigation.navigate('Loading')
          }
        >
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
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E7E7E7',
    borderRadius: 8,
    paddingHorizontal: 10,
    height: 50,
    marginBottom: 30,
    backgroundColor: '#fff',
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
    borderColor: '#98A2FF',
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
  dropdownContainer: {
    borderWidth: 1,
    borderColor: '#E7E7E7',
    borderRadius: 8,
    paddingHorizontal: 10,
    height: 50,
    marginBottom: 30,
    flex: 1,
    marginHorizontal: 5,
    backgroundColor: '#fff',
  },
  salaryDropdownContainer: {
    borderWidth: 1,
    borderColor: '#E7E7E7',
    borderRadius: 8,
    marginBottom: 30,
    paddingHorizontal: 10,
    height: 50,
  },
  dropdown: {
    flex: 1,
    paddingVertical: 0,
    fontSize: 16,
  },
  buttonContainer: {
    position: 'absolute',
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
    borderRadius: 24,
    alignItems: 'center',
    marginRight: 10,
  },
  nextButton: {
    flex: 1,
    backgroundColor: '#98A2FF',
    paddingVertical: 15,
    borderRadius: 24,
    alignItems: 'center',
    marginLeft: 10,
  },
  buttonText: {
    color: '#FFF',
    fontSize: 16,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
  },
});

