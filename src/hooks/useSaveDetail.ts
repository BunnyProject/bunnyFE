import { useState, useEffect } from 'react';
import { SaveDetailResponse } from '../types/types';
import { getSavingDetails } from '../api/AkkiApi';

export const useSaveDetail = (memberNo: number, targetDay: string) => {
  const [data, setData] = useState<SaveDetailResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const result = await getSavingDetails(memberNo, targetDay);
        setData(result);
      } catch (err) {
        setError(err.message || '데이터를 불러오지 못했습니다.');
      } finally {
        setLoading(false);
      }
    };

    if (memberNo && targetDay) {
      fetchData();
    }
  }, [memberNo, targetDay]);

  return { data, loading, error };
};
