import axiosInstance from './axiosInstance';
import apiEndpoints from './apiEndpoints';
import { CreateUserResponse } from '../types/types';

const isMock = process.env.NODE_ENV !== 'production';

// 사용자 닉네임으로 조회
export const findUserByNickname = async (nickname: string) => {
  if (isMock) {
    return Promise.resolve({
      resultType: 'SUCCESS',
      success: { id: 1, name: nickname, found: true },
    });
  } else {
    try {
      const response = await axiosInstance.get(`${apiEndpoints.user.findUser}?nickname=${nickname}`);
      return response.data;
    } catch (error) {
      console.error('Error finding user:', error);
      throw error;
    }
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
}): Promise<CreateUserResponse> => {
  if (isMock) {
    return Promise.resolve({
      resultType: 'SUCCESS',
      success: { id: 123, message: 'Mock user created' },
    });
  } else {
    try {
      const response = await axiosInstance.post(apiEndpoints.user.createUser, userData);
      return response.data as CreateUserResponse;
    } catch (error) {
      console.error('Error creating user:', error);
      throw error;
    }
  }
};

// 사용자 닉네임 중복 체크
export const checkNicknameDuplicate = async (nickname: string): Promise<{ resultType: string; success?: any; error?: any }> => {
  if (isMock) {
    return Promise.resolve({
      resultType: 'SUCCESS',
      success: { isDuplicate: false },
    });
  } else {
    try {
      const response = await axiosInstance.post(apiEndpoints.user.checkNickname, { name: nickname });
      return response.data;
    } catch (error: any) {
      console.error('Error checking nickname duplicate:', error);
      if (error.response) {
        return error.response.data;
      }
      throw new Error('네트워크 오류가 발생했습니다. 다시 시도해주세요.');
    }
  }
};

// 사용자 삭제
export const deleteUserById = async (userId: number) => {
  if (isMock) {
    return Promise.resolve({
      resultType: 'SUCCESS',
      success: { id: userId, deleted: true },
    });
  } else {
    try {
      const response = await axiosInstance.delete(`${apiEndpoints.user.deleteUser}/${userId}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting user:', error);
      throw error;
    }
  }
};

// 사용자 급여 조회
export const getUserSalary = async (memberNo: number) => {
  if (isMock) {
    return Promise.resolve({
      resultType: 'SUCCESS',
      success: { minMoney: 199, hourMoney: 11961, secondMoney: 3 },
    });
  } else {
    try {
      const response = await axiosInstance.get(apiEndpoints.user.getSalary, {
        headers: { 'member-no': memberNo },
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching user salary:', error);
      throw error;
    }
  }
};
