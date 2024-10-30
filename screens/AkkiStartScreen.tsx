import {useNavigation} from '@react-navigation/native';
import React from 'react';
import {View, Text, StyleSheet, Image, TouchableOpacity} from 'react-native';

const AkkiStartScreen = () => {
  const navigation = useNavigation();

  const handleStart = () => {
    navigation.navigate('IconSelectScreen'); // Akki 페이지로 이동
  };

  return (
    <View style={styles.container}>
      <Text style={styles.mainText}>
        '아끼'를 통해{'\n'}습관적인 지출을 줄여보세요.
      </Text>
      <Text style={styles.subText}>아낀 만큼 버니에게{'\n'}당근을 줄 수 있어요</Text>

      <View style={styles.bunnyContainer}>
        <Image
          source={require('../assets/AkkiBunny.png')}
          style={styles.bunny}
        />
        <Image source={require('../assets/Carrot.png')} style={styles.carrot} />
      </View>

      <TouchableOpacity style={styles.startButton} onPress={handleStart}>
        <Text style={styles.startButtonText}>시작하기</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
  },
  mainText: {
    fontSize: 16,
    color: '#98A2FF',
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 15,
  },
  subText: {
    fontSize: 14,
    color: '#8A8A8E',
    textAlign: 'center',
    marginBottom: 40,
  },
  bunnyContainer: {
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: '#E7E7E7',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 40,
  },
  bunny: {
    width: 100,
    height: 100,
    resizeMode: 'contain',
  },
  carrot: {
    position: 'absolute',
    width: 60,
    height: 60,
    bottom: 36,
    right: 26,
    resizeMode: 'contain',
  },
  startButton: {
    backgroundColor: '#98A2FF',
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 24,
    marginTop: 20,
  },
  startButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default AkkiStartScreen;
