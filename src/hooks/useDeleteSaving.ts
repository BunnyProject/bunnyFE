import {useState} from 'react';
import {DeleteSavingResponse} from '../types/types';
import {deleteSaving} from '../api/AkkiApi';

export const useDeleteSaving = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDeleteSaving = async (
    memberNo: number,
    savingId: number,
    body: {categoryName: string; savingPrice: number}
  ): Promise<DeleteSavingResponse | null> => {
    setLoading(true);
    setError(null);
    try {
      const response = await deleteSaving(memberNo, savingId, body);
      setLoading(false);
      return response;
    } catch (err: any) {
      setLoading(false);
      setError(err?.response?.data?.error?.message || '삭제 중 오류 발생');
      return null;
    }
  };

  return {handleDeleteSaving, loading, error};
};
