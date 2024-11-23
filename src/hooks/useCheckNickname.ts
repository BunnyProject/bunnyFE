import { useState } from 'react';
import { checkNicknameDuplicate } from '../api/userApi';

const useCheckNickname = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const checkNickname = async (nickname: string): Promise<boolean> => {
    setIsLoading(true);
    setError(null);

    try {
      // API 호출
      const response = await checkNicknameDuplicate(nickname);

      // 성공 여부 확인
      if (response.resultType === 'SUCCESS') {
        return true;
      } else {
        const errorMessage = response?.error?.message || '중복된 닉네임입니다.';
        setError(errorMessage);
        return false;
      }
    } catch (err) {
      // 네트워크 또는 기타 에러 처리
      setError('네트워크 오류가 발생했습니다. 다시 시도해주세요.');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return { isLoading, error, checkNickname };
};

export default useCheckNickname;
