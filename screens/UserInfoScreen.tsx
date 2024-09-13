import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from 'react-native';
import {Dropdown} from 'react-native-element-dropdown';
import {StackNavigationProp} from '@react-navigation/stack';
import {RootStackParamList} from '../navigation/MainNavigation';

// 네비게이션 타입 설정
type UserInfoScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  'UserInfo'
>;

type Props = {
  navigation: UserInfoScreenNavigationProp;
};

const UserInfoScreen: React.FC<Props> = ({navigation}) => {
  const [name, setName] = useState<string>('');
  const [birthDate, setBirthDate] = useState<string>('');
  const [gender, setGender] = useState<string>(''); 
  const [job, setJob] = useState<string>('학생');  // 기본값은 '학생'
  const [isFormValid, setIsFormValid] = useState<boolean>(false);

  // 직업 리스트
  const jobData = [
    {label: '학생', value: '학생'},
    {label: '직장인', value: '직장인'},
    {label: '무직', value: '무직'},
    {label: '프리랜서', value: '프리랜서'},
    {label: '주부', value: '주부'},
    {label: '기타', value: '기타'},
  ];

  // 생년월일 validation (YYYY/MM/DD 형식 검사)
  const isBirthDateValid = (date: string) => {
    const regex = /^\d{4}\/\d{2}\/\d{2}$/;
    return regex.test(date);
  };

  // 입력 유효성 검사
  const validateForm = () => {
    if (name.length > 0 && isBirthDateValid(birthDate) && gender && job) {
      setIsFormValid(true);
    } else {
      setIsFormValid(false);
    }
  };

  // 입력값 변화에 따라 유효성 검사 수행
  useEffect(() => {
    validateForm();
  }, [name, birthDate, gender, job]);

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>사용자 정보를 입력해주세요</Text>

        <View style={styles.labelContainer}>
          <Text style={styles.label}>이름</Text>
          <Text style={styles.star}>*</Text>
        </View>
        <TextInput
          style={[
            styles.input,
            name.length > 0 ? styles.validInput : styles.invalidInput, // 유효성에 따른 border color
          ]}
          placeholder="이름"
          value={name}
          onChangeText={setName}
        />

        <View style={styles.labelContainer}>
          <Text style={styles.label}>생년월일</Text>
          <Text style={styles.star}>*</Text>
        </View>
        <TextInput
          style={[
            styles.input,
            isBirthDateValid(birthDate) ? styles.validInput : styles.invalidInput, // 유효성에 따른 border color
          ]}
          placeholder="생년월일 (YYYY/MM/DD)"
          value={birthDate}
          onChangeText={setBirthDate}
        />

        <View style={styles.labelContainer}>
          <Text style={styles.label}>성별</Text>
          <Text style={styles.star}>*</Text>
        </View>
        <View style={styles.genderContainer}>
          <TouchableOpacity
            style={[
              styles.genderButton,
              gender === '여성' && styles.selectedGenderButton,
            ]}
            onPress={() => setGender('여성')}>
            <Text
              style={
                gender === '여성' ? styles.selectedText : styles.unselectedText
              }>
              여성
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.genderButton,
              gender === '남성' && styles.selectedGenderButton,
            ]}
            onPress={() => setGender('남성')}>
            <Text
              style={
                gender === '남성' ? styles.selectedText : styles.unselectedText
              }>
              남성
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.labelContainer}>
          <Text style={styles.label}>직업</Text>
          <Text style={styles.star}>*</Text>
        </View>

        {/* Dropdown 사용 */}
        <Dropdown
          style={[
            styles.dropdown,
            job ? styles.validInput : styles.invalidInput, // 직업이 선택되었을 때 border 색 변경
          ]}
          data={jobData}
          labelField="label"
          valueField="value"
          placeholder="직업을 선택 해 주세요"
          value={job}
          onChange={item => setJob(item.value)}
          maxHeight={200}
          flatListProps={{
            initialNumToRender: 3,
            maxToRenderPerBatch: 3,
          }}
          selectedTextStyle={{
            color: job ? '#98A2FF' : '#000', // 직업이 선택되었을 때 텍스트 색상 변경
          }}
        />
      </ScrollView>

      {/* 버튼을 하단에 고정, 입력 완료 여부에 따른 색상 변경 */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[
            styles.button,
            isFormValid ? styles.activeButton : styles.inactiveButton, // 유효성에 따른 버튼 색상
          ]}
          onPress={() => {
            if (isFormValid) navigation.navigate('UserInfo2');
          }}
          disabled={!isFormValid} // 유효하지 않으면 버튼 비활성화
        >
          <Text style={styles.buttonText}>다음</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    padding: 20,
    paddingBottom: 100, // 버튼이 스크롤 콘텐츠와 겹치지 않도록 여유 공간 추가
  },
  title: {
    color: '#000',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 40,
  },
  labelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  label: {
    color: '#000',
    fontSize: 16,
  },
  star: {
    color: '#98A2FF',
    marginLeft: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: '#E7E7E7',
    borderRadius: 8,
    padding: 10,
    marginBottom: 30,
  },
  validInput: {
    borderColor: '#98A2FF',
    color: '#98A2FF',
  },
  invalidInput: {
    borderColor: '#E7E7E7',
  },
  genderContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 30,
  },
  genderButton: {
    flex: 1,
    padding: 15,
    borderWidth: 1,
    borderColor: '#E7E7E7',
    borderRadius: 8,
    alignItems: 'center',
    marginHorizontal: 5,
  },
  selectedGenderButton: {
    borderColor: '#98A2FF',
  },
  selectedText: {
    color: '#98A2FF',
  },
  unselectedText: {
    color: '#000',
  },
  dropdown: {
    borderWidth: 1,
    borderColor: '#E7E7E7',
    borderRadius: 8,
    padding: 15,
    marginBottom: 30,
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 10,
    left: 0,
    right: 0,
    paddingHorizontal: 130,
    paddingVertical: 15,
    backgroundColor: '#fff',
  },
  button: {
    paddingVertical: 15,
    borderRadius: 24,
    alignItems: 'center',
  },
  activeButton: {
    backgroundColor: '#98A2FF',
  },
  inactiveButton: {
    backgroundColor: '#E0E0E0',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default UserInfoScreen;
