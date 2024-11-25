import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getHomeSalary, getTodayBunny } from '../api/bunnyApi'; // 기존 API 호출 함수 import
import { bunnyResponse, HomeMoneyResponse } from '../types/types';

export const useTodayBunny = () => {
  const [data, setData] = useState<bunnyResponse['success'] | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const userId = await AsyncStorage.getItem('userId');
        if (!userId) throw new Error('User ID not found in storage');
        const response: bunnyResponse = await getTodayBunny(Number(userId));
        if (response.resultType === 'SUCCESS' && response.success) {
          setData(response.success); // 성공 데이터 저장
        } else if (response.error) {
          setError(response.error.message); // 실패 메시지 저장
        }
      } catch (err: any) {
        setError(err.message || 'Failed to fetch data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return { data, loading, error };
};

export const useHomeMoney = () => {
  const [data, setData] = useState<HomeMoneyResponse['success'] | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const userId = await AsyncStorage.getItem('userId'); // AsyncStorage에서 userId 가져오기
        if (!userId) throw new Error('User ID not found in storage');

        const response = await getHomeSalary(Number(userId));
        if (response.resultType === 'SUCCESS' && response.success) {
          setData(response.success);
        } else if (response.error) {
          setError(response.error.message);
        }
      } catch (err: any) {
        setError(err.message || 'Failed to fetch home money');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return { data, loading, error };
};