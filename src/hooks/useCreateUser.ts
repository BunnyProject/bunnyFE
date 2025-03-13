import { useState } from 'react';
import { createUser } from '../api/userApi';

// userData 타입 정의
interface UserData {
  name: string;
  birth: string;
  gender: 'FEMALE' | 'MALE';
  job: '학생' | '직장인' | '프리랜서' | '주부' | '무직' | '기타';
  monthMoney: number;
  workDay: string[];
  workingTime: { hour: number; minute: number; second: number };
  quittingTime: { hour: number; minute: number; second: number };
}

// createNewUser 반환 타입
interface CreateUserResult {
  success: boolean;
  userId?: number; 
}

const useCreateUser = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createNewUser = async (userData: UserData): Promise<CreateUserResult> => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await createUser(userData);

      if (response.resultType === 'SUCCESS' && response.success) {
        return { success: true, userId: response.success.id };
      } else {
        setError(response.error?.message || '사용자 생성에 실패했습니다.');
        return { success: false };
      }
    } catch (err) {
      console.error('Error creating user:', err);
      setError('오류가 발생했습니다. 다시 시도해주세요.');
      return { success: false };
    } finally {
      setIsLoading(false);
    }
  };

  return { isLoading, error, createNewUser };
};

export default useCreateUser;
