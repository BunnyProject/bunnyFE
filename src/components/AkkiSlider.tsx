import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Slider from '@react-native-community/slider';
import LinearGradient from 'react-native-linear-gradient';

type CustomSliderProps = {
  totalGoal: number;
  startLabel: string;
  endLabel: string;
  step: number;
  defaultValue: number;
  unit: string;
  onValueChange: (value: number) => void;
};

export default function AkkiSlider({
  totalGoal,
  startLabel,
  endLabel,
  step,
  defaultValue,
  onValueChange,
}: CustomSliderProps) {
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
          maximumValue={step}
          step={1}
          value={sliderValue}
          onValueChange={(value) => {
            setSliderValue(value); // 로컬 상태 업데이트
            onValueChange(value); // 부모 컴포넌트로 값 전달
          }}
          thumbImage={require('../assets/thumb.png')}
          minimumTrackTintColor="transparent"
          maximumTrackTintColor="transparent"
        />
      </View>
      <View style={styles.earningText}>
        <Text style={styles.currentEarnings}>
          {Math.floor((sliderValue / step) * totalGoal).toLocaleString()}원
        </Text>
        <Text style={styles.totalEarnings}>/{totalGoal.toLocaleString()}원</Text>
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
    // backgroundColor: '#fff',
  },
  sliderWrapper: {
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: 40,
    paddingHorizontal: 10, 
  },
  sliderTrackContainer: {
    position: 'absolute',
    top: 14,
    flexDirection: 'row',
    height: 12,
    width: '90%',
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
    marginHorizontal: -10,
  },
  dateText: {
    fontSize: 12,
    color: '#aaa',
    marginBottom: 10,
  },
  currentEarnings: {
    fontSize: 14,
    color: '#8c9eff',
    fontWeight: 'bold',
  },
  totalEarnings: {
    fontSize: 14,
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
    justifyContent: 'flex-end',
  },
});
