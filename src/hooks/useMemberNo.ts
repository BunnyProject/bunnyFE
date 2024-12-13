import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const useMemberNo = () => {
  const [memberNo, setMemberNo] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true); // 로딩 상태

  useEffect(() => {
    const fetchMemberNo = async () => {
      try {
        const storedMemberNo = await AsyncStorage.getItem('userId');
        if (storedMemberNo) {
          setMemberNo(Number(storedMemberNo));
        } else {
          console.warn('No memberNo found in AsyncStorage');
        }
      } catch (error) {
        console.error('Error fetching memberNo from AsyncStorage:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMemberNo();
  }, []);

  return { memberNo, isLoading };
};

export default useMemberNo;
