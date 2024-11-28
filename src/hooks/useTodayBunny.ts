import { useState, useEffect, useMemo } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getHomeSalary, getTodayBunny } from '../api/bunnyApi'; // 기존 API 호출 함수 import
import { bunnyResponse, HomeMoneyResponse } from '../types/types';
import moment from 'moment-timezone';

// const response: bunnyResponse = await getTodayBunny(Number(userId));

export const useTodayBunny = () => {
  const [data, setData] = useState<bunnyResponse['success'] | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const start = useMemo(() => {
    if (!data || !data.workingTime) return null;

    // workingTime 문자열을 Date 객체로 변환
    const [hour, minute, second] = data.workingTime.split(':').map(Number);
    return moment.tz('Asia/Seoul').set({ hour, minute, second }).toDate();
  }, [data]);

  const end = useMemo(() => {
    if (!data || !data.quttingTime) return null;

    // quttingTime 문자열을 Date 객체로 변환
    const [hour, minute, second] = data.quttingTime.split(':').map(Number);
    return moment.tz('Asia/Seoul').set({ hour, minute, second }).toDate();
  }, [data]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const userId = await AsyncStorage.getItem('userId');
        if (!userId) throw new Error('User ID not found in storage');

        // const response: bunnyResponse = await getTodayBunny(Number(userId));
        const response: bunnyResponse = await getTodayBunny(1);
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

  return { data, start, end, loading, error };
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