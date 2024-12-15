import { useState, useEffect } from 'react';
import { TodaySavingResponse } from '../types/types';
import { fetchTodaySaving } from '../api/AkkiApi';

export const useTodaySaving = (memberNo: number) => {
  const [todaySaving, setTodaySaving] = useState<TodaySavingResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadTodaySaving = async () => {
      try {
        setLoading(true);
        const data = await fetchTodaySaving(memberNo);
        setTodaySaving(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (memberNo) {
      loadTodaySaving();
    }
  }, [memberNo]);

  return { todaySaving, loading, error, refetch: fetchTodaySaving };
};
