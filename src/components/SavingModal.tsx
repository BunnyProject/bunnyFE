import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  TextInput,
  Image,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import CustomSlider from './Slider';

const categories = [
  {
    id: 1,
    name: '커피',
    icon: require('../assets/icons/coffee.png'),
    unitPrice: 4000,
    defaultFrequency: 17,
  },
  {
    id: 2,
    name: '담배',
    icon: require('../assets/icons/smoke.png'),
    unitPrice: 700,
    defaultFrequency: 30,
  },
];

export default function SavingsModal({isVisible, onClose}) {
  const [goalInput, setGoalInput] = useState('250000');
  const [sliderValues, setSliderValues] = useState({
    1: categories[0].defaultFrequency,
    2: categories[1].defaultFrequency,
  });

  const handleSliderChange = (value, categoryId) => {
    setSliderValues(prevValues => ({
      ...prevValues,
      [categoryId]: value,
    }));
  };

  return (
    <Modal
      visible={isVisible}
      transparent={true}
      animationType="slide"
      onRequestClose={onClose}>
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>이번 달엔 얼마나 아낄까요?</Text>
          <Text style={styles.modalSubtitle}>
            아끼고 싶은 목표 금액을 입력해주세요.
          </Text>
          <TextInput
            style={styles.goalInput}
            keyboardType="numeric"
            value={goalInput}
            onChangeText={setGoalInput}
          />

          {categories.map(category => (
            <View key={category.id} style={styles.categoryContainer}>
              <View style={styles.categoryHeader}>
                <Image source={category.icon} style={styles.categoryIcon} />
                <View style={styles.categoryColumn}>
                <Text style={styles.categoryName}>{`${(
                  sliderValues[category.id] * category.unitPrice
                ).toLocaleString()}원`}</Text>
              <Text style={styles.estimatedAmount}>
                {category.name}
                {sliderValues[category.id]}회 (개당{' '}
                {category.unitPrice.toLocaleString()}원)
              </Text>
              </View>
              </View>
              <CustomSlider
                totalGoal={category.unitPrice * 100} // 100회를 최대 목표로 가정
                startLabel="0회"
                endLabel="100회"
                step={100}
                defaultValue={sliderValues[category.id]}
                unit="회"
              />
            </View>
          ))}

          <TouchableOpacity style={styles.saveButton} onPress={onClose}>
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
    alignItems: 'flex-start', // 추가하여 버튼을 가운데로
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
  categoryColumn:{
    flexDirection: 'column',
  },
  categoryIcon: {
    width: 30,
    height: 30,
    marginRight: 20,
    resizeMode: 'contain',
  },
  categoryName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  estimatedAmount: {
    fontSize: 14,
    color: '#555',
    marginTop: 10,
    textAlign: 'center',
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
});
