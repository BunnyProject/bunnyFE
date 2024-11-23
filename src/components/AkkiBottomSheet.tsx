import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  Image,
  TextInput,
} from 'react-native';

const categories = [
  { name: '커피', icon: require('../assets/icons/coffee.png') },
  { name: '담배', icon: require('../assets/icons/smoke.png') },
  { name: '기타', icon: require('../assets/icons/plus.png') },
];

const AkkiBottomSheet = ({ isVisible, onClose }) => {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [amount, setAmount] = useState('');

  return (
    <Modal
      visible={isVisible}
      transparent={true}
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.modalContainer}>
        <View style={styles.bottomSheet}>
          <View style={styles.categoryContainer}>
            {categories.map((category) => (
              <TouchableOpacity
                key={category.name}
                style={[
                  styles.categoryButton,
                  selectedCategory?.name === category.name && styles.selectedButton,
                ]}
                onPress={() => setSelectedCategory(category)}
              >
                <Image source={category.icon} style={styles.icon} />
                <Text style={styles.categoryText}>{category.name}</Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* 선택된 카테고리 이름 표시 */}
          <View style={styles.selectedCategoryContainer}>
            <TextInput
              style={styles.categoryInput}
              value={selectedCategory ? selectedCategory.name : ''}
              editable={false}
            />
            <Text style={styles.categorySuffix}>을/를</Text>
          </View>

          {/* 금액 입력란 */}
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

          {/* 취소/완료 버튼 */}
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
              <Text style={styles.buttonText}>취소</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.completeButton}
              onPress={() => {
                console.log(`Category: ${selectedCategory?.name}, Amount: ${amount}`);
                onClose();
              }}
            >
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
