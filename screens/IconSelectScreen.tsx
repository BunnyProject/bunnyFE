import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const IconSelectScreen = () => {
  const [selectedIcons, setSelectedIcons] = useState<{ name: string; source: any }[]>([]);
  const navigation = useNavigation();

  const icons = [
    { name: '커피', source: require('../assets/icons/coffee.png') },
    { name: '담배', source: require('../assets/icons/smoke.png') },
    { name: '간식', source: require('../assets/icons/snack.png') },
    { name: '술', source: require('../assets/icons/alcohol.png') },
    { name: '배달비', source: require('../assets/icons/delivery.png') },
    { name: '배달음식', source: require('../assets/icons/delivery-food.png') },
    { name: '교통비', source: require('../assets/icons/traffic.png') },
    { name: '쇼핑', source: require('../assets/icons/shopping.png') },
    { name: '미용', source: require('../assets/icons/hair.png') },
    { name: '취미', source: require('../assets/icons/hobby.png') },
    { name: '문화생활', source: require('../assets/icons/culture.png') },
    { name: '구독료', source: require('../assets/icons/subscribe.png') },
  ];

  const toggleIconSelection = (icon: { name: string; source: any }) => {
    if (selectedIcons.some((selected) => selected.name === icon.name)) {
      setSelectedIcons(selectedIcons.filter((item) => item.name !== icon.name)); // 선택 해제
    } else if (selectedIcons.length < 2) {
      setSelectedIcons([...selectedIcons, icon]); // 최대 2개까지 선택 가능
    }
  };

  const onConfirmSelection = () => {
    navigation.navigate('Akki', { selectedIcons }); // 선택된 아이콘을 아끼 화면에 전달
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>아끼고 싶은 항목을 2개 설정해주세요</Text>
      <View style={styles.iconGrid}>
        {icons.map((icon) => (
          <View key={icon.name} style={styles.iconWrapper}>
            <TouchableOpacity
              onPress={() => toggleIconSelection(icon)}
              style={[
                styles.iconContainer,
                selectedIcons.some((selected) => selected.name === icon.name) && styles.selectedIcon,
              ]}
            >
              <Image source={icon.source} style={styles.iconImage} resizeMode="contain" />
            </TouchableOpacity>
            <Text style={styles.iconText}>{icon.name}</Text>
          </View>
        ))}
      </View>
      <TouchableOpacity
        style={styles.confirmButton}
        onPress={onConfirmSelection}
        disabled={selectedIcons.length !== 2} // 아이콘 2개가 선택되지 않으면 버튼 비활성화
      >
        <Text style={styles.confirmButtonText}>다음</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
    backgroundColor: '#FFFFFF',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#000000',
  },
  iconGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  iconWrapper: {
    alignItems: 'center', // 텍스트와 원형 아이콘을 가운데 정렬
    marginHorizontal: 10,
    marginVertical: 20,
  },
  iconContainer: {
    width: 70,
    height: 70, // 원 모양을 위해 높이와 너비 동일하게 설정
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 50, // 원형 모양 설정
    backgroundColor: '#ffffff',
    borderWidth: 1, // 테두리 두께
    borderColor: '#f2f2f2', // 테두리 색상
  },
  selectedIcon: {
    borderColor: '#98A2FF',
    borderWidth: 2,
  },
  iconImage: {
    width: 40,
    height: 40,
    resizeMode: 'contain',
  },
  iconText: {
    marginTop: 5,
    fontSize: 12,
    textAlign: 'center',
    color: '#808080',
  },
  confirmButton: {
    backgroundColor: '#98A2FF',
    padding: 15,
    borderRadius: 30,
    marginTop: 60,
    width: '30%',
    alignItems: 'center',
  },
  confirmButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
  },
});

export default IconSelectScreen;
