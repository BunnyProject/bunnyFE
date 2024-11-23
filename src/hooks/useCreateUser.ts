import { useState } from 'react';
import { createUser } from '../api/userApi';

const useCreateUser = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createNewUser = async (userData: any): Promise<boolean> => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await createUser(userData);
      if (response.resultType === 'SUCCESS') {
        return true;
      } else {
        setError(response.error.message || '사용자 생성에 실패했습니다.');
        return false;
      }
    } catch (err) {
      setError('오류가 발생했습니다. 다시 시도해주세요.');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return { isLoading, error, createNewUser };
};

export default useCreateUser;
