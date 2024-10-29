import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const IconSelectScreen = () => {
  const navigation = useNavigation();
  const FIRST_COLOR = '#98A2FF'; // First selected category color
  const SECOND_COLOR = '#ACD7FF'; // Second selected category color

  // Icons data with default colors for unselected icons
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

  const [selectedIcons, setSelectedIcons] = useState<{ name: string; source: any; color: string }[]>([]);

  const toggleIconSelection = (icon: { name: string; source: any }) => {
    if (selectedIcons.some((selected) => selected.name === icon.name)) {
      // Deselect the icon
      setSelectedIcons(selectedIcons.filter((item) => item.name !== icon.name));
    } else if (selectedIcons.length < 2) {
      // Add the icon with color based on selection order
      const color = selectedIcons.length === 0 ? FIRST_COLOR : SECOND_COLOR;
      setSelectedIcons([...selectedIcons, { ...icon, color }]);
    }
  };

  const onConfirmSelection = () => {
    navigation.navigate('Akki', { selectedIcons });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>아끼고 싶은 항목을 2개 설정해주세요</Text>
      <View style={styles.iconGrid}>
        {icons.map((icon) => {
          const isSelected = selectedIcons.some((selected) => selected.name === icon.name);
          const selectedIcon = selectedIcons.find((selected) => selected.name === icon.name);
          const borderColor = selectedIcon ? selectedIcon.color : '#f2f2f2'; // Use color if selected, default otherwise

          return (
            <View key={icon.name} style={styles.iconWrapper}>
              <TouchableOpacity
                onPress={() => toggleIconSelection(icon)}
                style={[
                  styles.iconContainer,
                  isSelected && { borderColor, borderWidth: 2 }, // Set border color dynamically
                ]}
              >
                <Image source={icon.source} style={styles.iconImage} resizeMode="contain" />
              </TouchableOpacity>
              <Text style={styles.iconText}>{icon.name}</Text>
            </View>
          );
        })}
      </View>
      <TouchableOpacity
        style={styles.confirmButton}
        onPress={onConfirmSelection}
        disabled={selectedIcons.length !== 2} // Disable if not exactly 2 icons are selected
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
    alignItems: 'center',
    marginHorizontal: 10,
    marginVertical: 20,
  },
  iconContainer: {
    width: 70,
    height: 70,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 50,
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#f2f2f2',
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
