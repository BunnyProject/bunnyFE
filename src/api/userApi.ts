import axiosInstance from './axiosInstance';
import apiEndpoints from './apiEndpoints';

// 사용자 닉네임으로 조회
export const findUserByNickname = async (nickname: string) => {
  try {
    const response = await axiosInstance.get(`${apiEndpoints.user.getUser}?nickname=${nickname}`);
    return response.data;
  } catch (error) {
    console.error('Error finding user:', error);
    throw error;
  }
};

// 사용자 생성
export const createUser = async (userData: {
  name: string;
  birth: string;
  gender: 'FEMALE' | 'MALE';
  job: '학생' | '직장인' | '프리랜서' | '주부' | '무직' | '기타';
  monthMoney: number;
  workDay: string[];
  workingTime: { hour: number; minute: number; second: number };
  quittingTime: { hour: number; minute: number; second: number };
}) => {
  try {
    const response = await axiosInstance.post(apiEndpoints.user.createUser, userData);
    return response.data;
  } catch (error) {
    console.error('Error creating user:', error);
    throw error;
  }
};

// 사용자 닉네임 중복 체크
export const checkNicknameDuplicate = async (nickname: string): Promise<{ resultType: string; success?: any; error?: any }> => {
    try {
      const response = await axiosInstance.post(apiEndpoints.user.checkNickname, { name: nickname });
      return response.data;
    } catch (error: any) {
      console.error('Error checking nickname duplicate:', error);
  
      // Axios 에러인지 확인
      if (error.response) {
        // 서버에서 반환한 에러 처리
        return error.response.data;
      }
  
      // 네트워크 에러 또는 기타 오류 처리
      throw new Error('네트워크 오류가 발생했습니다. 다시 시도해주세요.');
    }
  };
  

// 사용자 삭제
export const deleteUserById = async (userId: number) => {
  try {
    const response = await axiosInstance.delete(`${apiEndpoints.user.deleteUser}/${userId}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting user:', error);
    throw error;
  }
};

// 사용자 급여 조회
export const getUserSalary = async (memberNo: number) => {
  try {
    const response = await axiosInstance.get(apiEndpoints.user.getSalary, {
      headers: { 'member-no': memberNo },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching user salary:', error);
    throw error;
  }
};
