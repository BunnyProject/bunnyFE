import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import Slider from '@react-native-community/slider';
import LinearGradient from 'react-native-linear-gradient';

// Props 타입 정의
interface CustomSliderProps {
  totalGoal: number;
  unit: string;
  startLabel: string;
  endLabel: string;
  step: number;  // 단계 수 (예: 주간은 4단계, 월간은 일수에 따라 설정)
  defaultValue: number; // 초기 슬라이더 값
}

export default function CustomSlider({
  totalGoal,
  unit,
  startLabel,
  endLabel,
  step,
  defaultValue,
}: CustomSliderProps) {
  // 슬라이더의 최대값을 단계 수에 맞게 설정하고, 초기값을 defaultValue로 설정
  const [sliderValue, setSliderValue] = useState(defaultValue);

  return (
    <View style={styles.container}>
      <View style={styles.textContainer}>
        <Text style={styles.dateText}>{startLabel}</Text>
        <Text style={styles.dateText}>{endLabel}</Text>
      </View>
      <View style={styles.sliderWrapper}>
        <View style={styles.sliderTrackContainer}>
          <LinearGradient
            colors={['#BCECFF', '#DECDFF']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={[styles.sliderTrack, { width: `${(sliderValue / step) * 100}%` }]}
          />
          <View
            style={[
              styles.sliderTrackInactive,
              { width: `${100 - (sliderValue / step) * 100}%` },
            ]}
          />
        </View>
        <Slider
          style={styles.slider}
          minimumValue={0}
          maximumValue={step}  // 단계 수에 맞는 최대값 설정
          step={1}  // 단계별로 슬라이더가 움직이도록 설정
          value={sliderValue}
          onValueChange={value => setSliderValue(value)}
          thumbTintColor="#ffffff"
          minimumTrackTintColor="transparent"
          maximumTrackTintColor="transparent"
        />
      </View>
      <View style={styles.earningText}>
        <Text style={styles.currentEarnings}>
          {Math.floor((sliderValue / step) * totalGoal).toLocaleString()}원
        </Text>
        <Text style={styles.totalEarnings}>
          /{totalGoal.toLocaleString()}원
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff',
  },
  sliderWrapper: {
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: 40,
  },
  sliderTrackContainer: {
    position: 'absolute',
    top: 14,
    flexDirection: 'row',
    height: 12,
    width: '100%',
    borderRadius: 3,
    overflow: 'hidden',
  },
  sliderTrack: {
    height: '100%',
    borderRadius: 3,
  },
  sliderTrackInactive: {
    height: '100%',
    backgroundColor: '#E0E0E0',
    borderRadius: 3,
  },
  slider: {
    width: '100%',
    height: 40,
  },
  dateText: {
    fontSize: 12,
    color: '#aaa',
    marginBottom: 10,
  },
  currentEarnings: {
    fontSize: 10,
    color: '#8c9eff',
    fontWeight: 'bold',
    marginLeft: 200,
  },
  totalEarnings: {
    fontSize: 10,
    color: '#000000',
    fontWeight: 'bold',
  },
  textContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  earningText: {
    flexDirection: 'row',
    width: '100%',
    textAlign: 'right',
    justifyContent: 'flex-end',
  },
});
