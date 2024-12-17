import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  TextInput,
  Image,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {iconData} from '../contants/icons';
import AkkiSlider from './AkkiSlider';
import {useMonthlyTarget} from '../hooks/useMonthlyTarget';
import {Category} from '../types/types';
import Icon from 'react-native-vector-icons/FontAwesome';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

type SavingsModalProps = {
  isVisible: boolean;
  onClose: () => void;
};

const getMemberNo = async (): Promise<number | null> => {
  const userId = await AsyncStorage.getItem('userId');
  return userId ? Number(userId) : null;
};

export default function SavingsModal({isVisible, onClose}: SavingsModalProps) {
  const [categories, setCategories] = useState<
    Array<{
      id: number;
      name: string;
      source: any;
      unitPrice: number;
      defaultFrequency?: number;
    }>
  >([]);
  const [goalInput, setGoalInput] = useState('0');
  const [editMode, setEditMode] = useState<Record<number, boolean>>({});
  const [sliderValues, setSliderValues] = useState<Record<string, number>>({});
  const [memberNo, setMemberNo] = useState<number | null>(null);
  const {loading, error, submitMonthlyTarget} = useMonthlyTarget(memberNo ?? 0);

  const toggleEditMode = (categoryId: number) => {
    setEditMode(prev => ({...prev, [categoryId]: !prev[categoryId]}));
  };

  const handleUnitPriceChange = (newPrice: number, categoryId: number) => {
    const safePrice = isNaN(newPrice) || newPrice <= 0 ? 0 : newPrice;

    setCategories(prev =>
      prev.map(cat =>
        cat.id === categoryId ? {...cat, unitPrice: safePrice} : cat,
      ),
    );
    updateTotalTargetAmount(sliderValues);
    toggleEditMode(categoryId); // 수정 모드 종료
  };

  const updateTotalTargetAmount = (
    updatedSliderValues: Record<string, number>,
  ) => {
    const total = categories.reduce((sum, category) => {
      const sliderValue = updatedSliderValues[category.name] || 0;
      return sum + sliderValue * category.unitPrice;
    }, 0);
    setGoalInput(total.toString());
  };

  const calculateMaxTotalAmount = () =>
    categories.reduce((sum, category) => sum + category.unitPrice * 100, 0);

  const handleSliderChange = (value: number, categoryName: string) => {
    setSliderValues(prevValues => {
      const updatedValues = {...prevValues};
      updatedValues[categoryName] = value;

      // 모든 슬라이더 변경 시 총 금액 반영
      updateTotalTargetAmount(updatedValues);

      return updatedValues;
    });
  };

  const calculateInitialSliderValues = (totalAmount: number) => {
    if (categories.length === 0) return;

    const nonMiscCategories = categories.filter(cat => cat.name !== '기타');
    const halfAmount = Math.floor(totalAmount / nonMiscCategories.length);

    setSliderValues(prev => {
      const updatedValues = {...prev};
      nonMiscCategories.forEach(cat => {
        updatedValues[cat.name] = Math.floor(halfAmount / (cat.unitPrice || 1));
      });
      return updatedValues;
    });
  };

  const handleGoalInputChange = (value: string) => {
    const numericValue = Number(value) || 0;
    const maxTotalAmount = calculateMaxTotalAmount();

    const adjustedValue = Math.min(numericValue, maxTotalAmount);
    setGoalInput(adjustedValue.toString());
    calculateInitialSliderValues(adjustedValue);
  };

  useEffect(() => {
    const fetchMemberNo = async () => {
      const fetchedMemberNo = await getMemberNo();
      if (fetchedMemberNo) {
        setMemberNo(fetchedMemberNo);
      }
    };
    fetchMemberNo();

    const loadInitialData = async () => {
      try {
        const savedTotalAmount = await AsyncStorage.getItem(
          'totalTargetAmount',
        );
        if (savedTotalAmount) {
          setGoalInput(savedTotalAmount);
        }

        const savedIcons = await AsyncStorage.getItem('selectedIcons');
        if (savedIcons) {
          const {
            firstCategory,
            secondCategory,
            firstCategoryId,
            secondCategoryId,
            otherCategoryName,
            otherCategoryId,
          } = JSON.parse(savedIcons);

          const selectedCategories: Category[] = [
            {
              id: firstCategoryId,
              name: firstCategory,
              source: iconData.find(icon => icon.name === firstCategory)
                ?.source,
              unitPrice: getUnitPrice(firstCategory),
              defaultFrequency: 0,
            },
            {
              id: secondCategoryId,
              name: secondCategory,
              source: iconData.find(icon => icon.name === secondCategory)
                ?.source,
              unitPrice: getUnitPrice(secondCategory),
              defaultFrequency: 0,
            },
            {
              id: otherCategoryId,
              name: otherCategoryName,
              source: iconData.find(icon => icon.name === otherCategoryName)
                ?.source,
              unitPrice: getUnitPrice(otherCategoryName),
              defaultFrequency: 0,
            },
          ];

          setCategories(selectedCategories);

          const totalAmount = parseInt(savedTotalAmount || '0', 10);
          calculateInitialSliderValues(totalAmount, selectedCategories);
        }
      } catch (error) {
        console.error('Failed to load data:', error);
      }
    };

    fetchMemberNo();
    loadInitialData();
  }, []);

  const getUnitPrice = (name: string): number => {
    switch (name) {
      case '교통비':
        return 2000;
      case '구독료':
        return 10000;
      case '술':
        return 4000;
      default:
        return 0;
    }
  };

  const handleSubmit = async () => {
    try {
      const filteredCategories = categories.filter(
        category => category.name !== '기타',
      );
      const targetList = filteredCategories.map(category => ({
        categoryId: category.id,
        targetAmount: sliderValues[category.name] || 0,
        onePrice: category.unitPrice,
      }));

      const payload = {
        totalTargetAmount: parseInt(goalInput, 10) || 0,
        targetList,
      };

      console.log('Submitting payload:', payload);

      const response = await submitMonthlyTarget(payload);
      if (response?.resultType === 'SUCCESS') {
        console.log('Target successfully submitted:', response);
        await AsyncStorage.setItem('totalTargetAmount', goalInput);
        onClose();
      } else {
        console.error(
          'API response error:',
          response?.error?.message || 'Unknown error',
        );
      }
    } catch (error) {
      console.error('Submission failed:', error);
    }
  };

  return (
    <Modal
      visible={isVisible}
      transparent={true}
      animationType="slide"
      onRequestClose={onClose}>
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <MaterialIcons name="close" size={20} color="#FF0000" />
          </TouchableOpacity>
          <Text style={styles.modalTitle}>이번 달엔 얼마나 아낄까요?</Text>
          <Text style={styles.modalSubtitle}>
            아끼고 싶은 목표 금액을 입력해주세요.
          </Text>
          <TextInput
            style={styles.goalInput}
            keyboardType="numeric"
            value={goalInput}
            onChangeText={handleGoalInputChange}
          />
          <Text style={styles.categoryHeader}>금액 예측기</Text>
          {categories.map(category => (
            <View key={category.name} style={styles.categoryContainer}>
              <View style={styles.categoryHeader}>
                <Image source={category.source} style={styles.categoryIcon} />
                <View style={styles.categoryColumn}>
                  <Text style={styles.categoryTotal}>
                    {sliderValues[category.name] * category.unitPrice || 0}원
                  </Text>
                  <Text style={styles.estimatedAmount}>
                    {category.name} {sliderValues[category.name] || 0}회 (
                    {editMode[category.id] ? (
                      <TextInput
                        style={styles.unitPriceInput}
                        keyboardType="numeric"
                        defaultValue={
                          category.unitPrice > 0
                            ? category.unitPrice.toString()
                            : '0'
                        }
                        onEndEditing={e =>
                          handleUnitPriceChange(
                            Number(e.nativeEvent.text),
                            category.id,
                          )
                        }
                        autoFocus
                      />
                    ) : (
                      <Text style={styles.unitPriceText}>
                        {category.unitPrice > 0
                          ? category.unitPrice.toLocaleString()
                          : '???'}
                      </Text>
                    )}
                    <Text style={styles.estimatedAmount}>
                      원
                      <TouchableOpacity
                        onPress={() => toggleEditMode(category.id)}>
                        <Icon
                          name="pencil"
                          size={14}
                          color="#7d7d7d"
                          style={styles.pencilIcon}
                        />
                      </TouchableOpacity>
                      )
                    </Text>
                  </Text>
                </View>
              </View>
              <AkkiSlider
                key={sliderValues[category.name]}
                totalGoal={category.unitPrice * 100}
                startLabel="0회"
                endLabel="100회"
                step={100}
                defaultValue={sliderValues[category.name] || 0}
                unit="회"
                onValueChange={value =>
                  handleSliderChange(value, category.name)
                }
              />
              <View style={styles.sliderLabels}>
                <Text style={styles.sliderLabelText}>0회</Text>
                <Text style={styles.sliderLabelText}>100회</Text>
              </View>
            </View>
          ))}
          <TouchableOpacity
            style={styles.saveButton}
            onPress={handleSubmit}
            disabled={loading}>
            <Text style={styles.saveButtonText}>완료</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}
const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    margin: 20,
    padding: 30,
    backgroundColor: 'white',
    borderRadius: 10,
    alignItems: 'flex-start',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#000000',
  },
  modalSubtitle: {
    fontSize: 14,
    color: '#888',
    marginBottom: 20,
  },
  goalInput: {
    fontSize: 24,
    color: '#333',
    fontWeight: 'bold',
    textAlign: 'left',
    marginBottom: 20,
    borderColor: '#ddd',
    width: '80%',
  },
  categoryContainer: {
    width: '100%',
    padding: 10,
    backgroundColor: '#f9f9f9',
    borderRadius: 10,
    marginBottom: 15,
  },
  categoryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  categoryDetails: {
    flexDirection: 'column',
    marginLeft: 10,
  },
  categoryTotal: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  categoryInfo: {
    fontSize: 14,
    color: '#555',
  },

  categoryColumn: {
    flexDirection: 'column',
    marginBottom: -12,
  },
  categoryIcon: {
    width: 35,
    height: 35,
    marginRight: 10,
    marginTop: 10,
    // paddingHorizontal: 10,
    resizeMode: 'contain',
  },
  categoryName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  estimatedAmount: {
    fontSize: 14,
    color: '#555',
  },
  saveButton: {
    alignSelf: 'center',
    backgroundColor: '#98A2FF',
    paddingVertical: 10,
    paddingHorizontal: 30,
    borderRadius: 20,
    marginTop: 20,
  },
  saveButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  unitPriceInput: {
    borderBottomWidth: 1,
    marginLeft: 5,
    width: 60,
    textAlign: 'center',
    fontSize: 14,
    color: '#555',
  },
  estimatedAmountContainer: {
    flexDirection: 'column',
    justifyContent: 'center',
    marginLeft: 10,
  },
  unitPriceText: {
    fontSize: 14,
    color: '#555',
    marginLeft: 5,
  },
  pencilIcon: {
    marginLeft: 5,
    marginRight: 5,
    paddingTop: 5,
  },
  closeButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    zIndex: 1,
  },
  sliderLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: -10,
    paddingHorizontal: 40,
  },
  sliderLabelText: {
    fontSize: 12,
    color: '#9a9a9a',
  },
});
