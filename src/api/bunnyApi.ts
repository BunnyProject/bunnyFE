import axiosInstance from './axiosInstance';
import apiEndpoints from './apiEndpoints';
import { bunnyResponse, HomeMoneyResponse } from '../types/types';

// 타입 정의
interface MonthlyTargetData {
  totalTargetAmount: number;
  targetList?: { categoryId: number; categoryName: string; targetAmount: number; onePrice: number }[];
  updateTargetList?: { categoryId: number; targetAmount: number; onePrice: number }[];
}

// 공통 에러 처리 함수
const handleError = (error: any) => {
  console.error('API Error:', error);
  if (error.response) {
    return error.response.data?.error?.message || '서버 요청에 실패했습니다.';
  }
  return '네트워크 오류가 발생했습니다.';
};

// 오늘의 버니 조회
export const getTodayBunny = async (memberNo: number): Promise<bunnyResponse> => {
  try {
    const response = await axiosInstance.get(apiEndpoints.bunny.getTodayBunny, {
      headers: { 'member-no': memberNo },
    });
    return response.data;
  } catch (error) {
    throw new Error(handleError(error));
  }
};

// 한달 목표 수정
export const updateMonthlyTarget = async (
  memberNo: number,
  targetData: MonthlyTargetData & { targetId: number }
) => {
  try {
    const response = await axiosInstance.put(apiEndpoints.bunny.updateMonthlyTarget, targetData, {
      headers: { 'member-no': memberNo },
    });
    return response.data;
  } catch (error) {
    throw new Error(handleError(error));
  }
};

// 한달 목표 생성
export const createMonthlyTarget = async (memberNo: number, targetData: MonthlyTargetData) => {
  try {
    const response = await axiosInstance.post(apiEndpoints.bunny.createMonthlyTarget, targetData, {
      headers: { 'member-no': memberNo },
    });
    return response.data;
  } catch (error) {
    throw new Error(handleError(error));
  }
};

// 홈 화면 급여 조회
export const getHomeSalary = async (memberNo: number): Promise<HomeMoneyResponse> => {
  try {
    const response = await axiosInstance.get(apiEndpoints.bunny.getHomeSalary, {
      headers: { 'member-no': memberNo },
    });
    return response.data;
  } catch (error) {
    throw new Error(handleError(error));
  }
};

// 한달 목표 삭제
export const deleteMonthlyTarget = async (memberNo: number, targetId: number) => {
  try {
    const response = await axiosInstance.delete(apiEndpoints.bunny.deleteMonthlyTarget(targetId), {
      headers: { 'member-no': memberNo },
    });
    return response.data;
  } catch (error) {
    throw new Error(handleError(error));
  }
};
