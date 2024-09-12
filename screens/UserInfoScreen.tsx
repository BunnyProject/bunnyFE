import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import {StackNavigationProp} from '@react-navigation/stack';
import {RootStackParamList} from '../navigation/MainNavigation';

// RootStackParamList에서 'UserInfo'와 'NextScreen'이 존재하는 것을 가정
// type RootStackParamList = {
//   UserInfo: undefined;
//   UserInfo2: undefined;
// };

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
  const [job, setJob] = useState<string>('');
  const [focusedInput, setFocusedInput] = useState<string | null>(null);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>사용자 정보를 입력해주세요</Text>

      <Text style={styles.label}>이름 *</Text>
      <TextInput
        style={[styles.input, focusedInput === 'name' && styles.selectedInput]}
        placeholder="이름"
        value={name}
        onChangeText={setName}
        onFocus={() => setFocusedInput('name')}
        onBlur={() => setFocusedInput(null)}
      />

      <Text style={styles.label}>생년월일 *</Text>
      <TextInput
        style={[
          styles.input,
          focusedInput === 'birthDate' && styles.selectedInput,
        ]}
        placeholder="생년월일 (YYYY/MM/DD)"
        value={birthDate}
        onChangeText={setBirthDate}
        onFocus={() => setFocusedInput('birthDate')}
        onBlur={() => setFocusedInput(null)}
      />

      <Text style={styles.label}>성별 *</Text>
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

      <Text style={styles.label}>직업 *</Text>
      <TextInput
        style={styles.input}
        placeholder="직업"
        value={job}
        onChangeText={setJob}
        onFocus={() => setFocusedInput('job')}
        onBlur={() => setFocusedInput(null)}
      />

      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('UserInfo2')}>
        <Text style={styles.buttonText}>다음</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
    padding: 40,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: '#E7E7E7',
    borderRadius: 8,
    padding: 10,
    marginBottom: 20,
  },
  selectedInput: {
    borderColor: '#98A2FF',
    backgroundColor: '#F0F8FF',
  },
  genderContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
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
  button: {
    backgroundColor: '#98A2FF',
    paddingVertical: 15,
    borderRadius: 24,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default UserInfoScreen;
