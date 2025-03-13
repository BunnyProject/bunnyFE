import {useState, useEffect, useMemo} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {getHomeSalary, getTodayBunny} from '../api/bunnyApi';
import {bunnyResponse, HomeMoneyResponse} from '../types/types';
import moment from 'moment-timezone';

export const useTodayBunny = () => {
  const [data, setData] = useState<bunnyResponse['success'] | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const start = useMemo(() => {
    const workingTime = data?.workingTime || '09:00:00';
    const [hour, minute, second] = workingTime.split(':').map(Number);
    return moment.tz('Asia/Seoul').set({ hour, minute, second }).toDate();
  }, [data]);
  
  const end = useMemo(() => {
    const quittingTime = data?.quttingTime || '18:00:00';
    const [hour, minute, second] = quittingTime.split(':').map(Number);
    return moment.tz('Asia/Seoul').set({ hour, minute, second }).toDate();
  }, [data]);  

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const userId = await AsyncStorage.getItem('userId');
        if (!userId) throw new Error('User ID not found in storage');

        const response: bunnyResponse = await getTodayBunny(Number(userId));
        if (response.resultType === 'SUCCESS' && response.success) {
          setData(response.success);
        } else if (response.error) {
          setError(response.error.message);
        }
      } catch (err: any) {
        setError(err.message || 'Failed to fetch data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const defaultData = {
    minMoney: 100,
    workingTime: '09:00:00',
    quttingTime: '18:00:00',
  };

  return {
    data: data || defaultData,
    start,
    end,
    loading,
    error: error || null,
  };
};

export const useHomeMoney = () => {
  const [data, setData] = useState<HomeMoneyResponse['success'] | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const userId = await AsyncStorage.getItem('userId');
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

  const defaultData = {
    minMoney: 164,
    hourMoney: 9860,
    secondMoney: 3,
  };

  return {
    data: data || defaultData,
    loading,
    error: error || null,
  };
};
