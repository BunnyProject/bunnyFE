import { useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createMonthlyTarget, updateMonthlyTarget } from '../api/bunnyApi';
import { PostTargetRequest } from '../types/types';

export const useMonthlyTarget = (memberNo: number) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submitMonthlyTarget = async (data: PostTargetRequest) => {
    setLoading(true);
    try {
      const existingTarget = await AsyncStorage.getItem('existingTarget');
      if (existingTarget) {
        const parsedData = JSON.parse(existingTarget);
        const targetId = parsedData.targetId;

        if (targetId) {
          // PUT 요청 (수정)
          const updatePayload = {
            targetId,
            totalTargetAmount: data.totalTargetAmount,
            updateTargetList: data.targetList, // `updateTargetList`로 이름 변경
          };

          console.log('Updating target with payload:', updatePayload);

          const response = await updateMonthlyTarget(memberNo, updatePayload);
          console.log('Update response:', response);

          setLoading(false);
          return response;
        }
      }

      // POST 요청 (생성)
      console.log('Creating new target with payload:', data);

      const response = await createMonthlyTarget(memberNo, data);
      console.log('Create response:', response);

      if (response?.success?.targetId) {
        await AsyncStorage.setItem(
          'existingTarget',
          JSON.stringify({ targetId: response.success.targetId })
        );
      }

      setLoading(false);
      return response;
    } catch (err: any) {
      console.error('API Error:', err.message || 'Unknown error');
      setError(err.message || 'Failed to submit monthly target');
      setLoading(false);
      return null;
    }
  };

  return {
    loading,
    error,
    submitMonthlyTarget,
  };
};
