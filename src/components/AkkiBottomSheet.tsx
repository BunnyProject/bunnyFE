import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  Image,
  TextInput,
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {iconData} from '../screens/IconSelectScreen';
import {useHandleSaveMoney} from '../utils/saveMoneyUtil';

type AkkiBottomSheetProps = {
  isVisible: boolean;
  onClose: () => void;
  selectedDate: string;
  setTodaySavingState?: (state: any) => void;
  setMonthlySavingsState?: (state: any) => void;
  setSavingDetailsState?: (state: any) => void;
};

const DEFAULT_COLOR = '#DECDFF';
const CATEGORY1_COLOR = '#98A2FF';
const CATEGORY2_COLOR = '#ACD7FF';

const getMemberNo = async (): Promise<number | null> => {
  const userId = await AsyncStorage.getItem('userId');
  return userId ? Number(userId) : null;
};

const AkkiBottomSheet: React.FC<AkkiBottomSheetProps> = ({
  isVisible,
  onClose,
  selectedDate,
  setTodaySavingState = () => {},
  setMonthlySavingsState = () => {},
  setSavingDetailsState = () => {},
}) => {
  const [category1, setCategory1] = useState<any>(null);
  const [category2, setCategory2] = useState<any>(null);
  const [category3, setCategory3] = useState<any>(null);
  const [selectedCategory, setSelectedCategory] = useState<any>(null);
  const [amount, setAmount] = useState('');
  const [detail, setDetail] = useState('');
  const [memberNo, setMemberNo] = useState<number | null>(null);
  const {handleSaveMoney} = useHandleSaveMoney();

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

        setCategory1({
          ...category1Data,
          color: CATEGORY1_COLOR,
        });
        setCategory2({
          ...category2Data,
          color: CATEGORY2_COLOR,
        });
        setCategory3({
          ...category3Data,
          color: DEFAULT_COLOR,
        });
      }
    };

    fetchCategories();
  }, []);
  const handleSave = async () => {
    if (!selectedCategory || !amount) {
      Alert.alert('카테고리와 금액을 입력해주세요!');
      return;
    }

    const savingDay =
    typeof selectedDate === 'string'
      ? selectedDate // 문자열인 경우 그대로 사용
      : new Date().toISOString().split('T')[0]; // 문자열이 아니면 현재 날짜 사용

    try {
      await handleSaveMoney({
        memberNo: memberNo!,
        categoryName: selectedCategory.name,
        savingPrice: Number(amount),
        savingDay, // 여기에 설정된 날짜가 서버로 전달됨
        detail: selectedCategory.name === '기타' ? detail : '',
        currentYear: new Date().getFullYear(),
        currentMonth: new Date().getMonth() + 1,
        updateStates: refetchedData => {
          setTodaySavingState(refetchedData.todaySaving);
          setMonthlySavingsState(refetchedData.monthlySavings);
          setSavingDetailsState(refetchedData.savingDetails);
        },
      });

      Alert.alert('저장이 완료되었습니다!');
      onClose();
      setAmount('');
      setDetail('');
    } catch (error) {
      console.error('저장 중 오류 발생:', error);
      Alert.alert('저장에 실패했습니다. 다시 시도해주세요.');
    }
  };

  return (
    <Modal
      visible={isVisible}
      transparent={true}
      animationType="slide"
      onRequestClose={onClose}>
      <View style={styles.modalContainer}>
        <View style={styles.bottomSheet}>
          <View style={styles.categoryContainer}>
            {[category1, category2, category3]
              .filter(category => category)
              .map(category => (
                <TouchableOpacity
                  key={category.name}
                  style={[
                    styles.categoryButton,
                    selectedCategory?.name === category.name &&
                      styles.selectedButton,
                  ]}
                  onPress={() => setSelectedCategory(category)}>
                  <Image source={category.source} style={styles.icon} />
                  <Text style={styles.categoryText}>{category.name}</Text>
                </TouchableOpacity>
              ))}
          </View>

          <View style={styles.selectedCategoryContainer}>
            {selectedCategory && selectedCategory.name === '기타' ? (
              <TextInput
                style={styles.categoryInput}
                placeholder="기타"
                value={selectedCategory.detail || ''}
                onChangeText={text =>
                  setSelectedCategory((prev: {[key: string]: string}) => ({
                    ...prev,
                    detail: text,
                  }))
                }
              />
            ) : (
              <TextInput
                style={styles.categoryInput}
                value={selectedCategory ? selectedCategory.name : ''}
                editable={false}
              />
            )}
            <Text style={styles.categorySuffix}>을/를</Text>
          </View>

          <View style={styles.amountContainer}>
            <TextInput
              style={styles.amountInput}
              placeholder="금액을 입력해주세요"
              keyboardType="numeric"
              value={amount}
              onChangeText={setAmount}
            />
            <Text style={styles.amountSuffix}>원 아꼈어요</Text>
          </View>

          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
              <Text style={styles.buttonText}>취소</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.completeButton}
              onPress={handleSave}>
              <Text style={styles.buttonText}>완료</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  bottomSheet: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    paddingBottom: 40,
    paddingTop: 40,
  },
  categoryContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
  },
  categoryButton: {
    alignItems: 'center',
    padding: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E8E8E8',
  },
  selectedButton: {
    borderColor: '#98A2FF',
    backgroundColor: '#F3F6FF',
  },
  icon: {
    width: 50,
    height: 50,
    resizeMode: 'contain',
  },
  categoryText: {
    fontSize: 12,
    color: '#666666',
  },
  selectedCategoryContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    marginBottom: 10,
  },
  categoryInput: {
    width: 200,
    padding: 10,
    borderWidth: 1,
    borderColor: '#E8E8E8',
    borderRadius: 15,
    fontSize: 16,
    textAlign: 'right',
    color: '#FF7B7B',
  },
  categorySuffix: {
    fontSize: 16,
    marginLeft: 5,
    color: '#000000',
  },
  amountContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    marginBottom: 20,
  },
  amountInput: {
    width: 200,
    padding: 10,
    borderWidth: 1,
    borderColor: '#E8E8E8',
    borderRadius: 15,
    fontSize: 16,
    textAlign: 'right',
  },
  amountSuffix: {
    fontSize: 16,
    marginLeft: 5,
    color: '#000000',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  cancelButton: {
    flex: 1,
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#A9A9A9',
    borderRadius: 10,
    marginRight: 10,
  },
  completeButton: {
    flex: 1,
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#98A2FF',
    borderRadius: 10,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
  },
});

export default AkkiBottomSheet;
