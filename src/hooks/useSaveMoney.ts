import {useState} from 'react';
import { createSavingAmount } from '../api/AkkiApi';
import { SaveMoneyParams } from '../types/types';

export const useSaveMoney = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const saveMoney = async(params: SaveMoneyParams) => {
    setLoading(true);
    setError(null);

    try {
      const result = await createSavingAmount(params);
      setLoading(false);
      return result;
    } catch (err: any) {
      setError(err.message);
      setLoading(false);
      throw err;
    }
  };

  return {saveMoney, loading, error};
};
