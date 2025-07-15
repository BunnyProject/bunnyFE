import axiosInstance from './axiosInstance';
import apiEndpoints from './apiEndpoints';
import {
  bunnyResponse,
  HomeMoneyResponse,
  PostTargetRequest,
  PostTargetResponse,
} from '../types/types';

const isMock = process.env.NODE_ENV !== 'production';

// 오늘의 버니 조회
export const getTodayBunny = async (
  memberNo: number,
): Promise<bunnyResponse> => {
  if (isMock) {
    return Promise.resolve({
      resultType: 'SUCCESS',
      success: {
        minMoney: 123,
        workingTime: '09:00:00',
        quttingTime: '20:00:00',
      },
    });
  } else {
    const response = await axiosInstance.get(apiEndpoints.bunny.getTodayBunny, {
      headers: {'member-no': memberNo},
    });
    return response.data;
  }
};

// 한달 목표 수정
export const updateMonthlyTarget = async (
  memberNo: number,
  targetData: PostTargetRequest & {targetId: number},
) => {
  if (isMock) {
    return Promise.resolve({
      resultType: 'SUCCESS',
      success: {
        ...targetData,
        updated: true,
      },
    });
  } else {
    const response = await axiosInstance.put(
      apiEndpoints.bunny.updateMonthlyTarget,
      targetData,
      {
        headers: {'member-no': memberNo},
      },
    );
    return response.data;
  }
};

// 한달 목표 생성
export const createMonthlyTarget = async (
  memberNo: number,
  targetData: PostTargetRequest,
): Promise<PostTargetResponse> => {
  if (isMock) {
    return Promise.resolve({
      resultType: 'SUCCESS',
      success: {
        targetId: 999,
        ...targetData,
        created: true,
      },
    });
  } else {
    const response = await axiosInstance.post<PostTargetResponse>(
      apiEndpoints.bunny.createMonthlyTarget,
      targetData,
      {
        headers: {'member-no': memberNo},
      },
    );
    return response.data;
  }
};

// 홈 화면 급여 조회
export const getHomeSalary = async (
  memberNo: number,
): Promise<HomeMoneyResponse> => {
  if (isMock) {
    return Promise.resolve({
      resultType: 'SUCCESS',
      success: {
        minMoney: 199,
        hourMoney: 11961,
        secondMoney: 3,
      },
    });
  } else {
    const response = await axiosInstance.get(apiEndpoints.bunny.getHomeSalary, {
      headers: {'member-no': memberNo},
    });
    return response.data;
  }
};

// 한달 목표 삭제
export const deleteMonthlyTarget = async (
  memberNo: number,
  targetId: number,
) => {
  if (isMock) {
    return Promise.resolve({
      resultType: 'SUCCESS',
      success: {
        deletedTargetId: targetId,
        deleted: true,
      },
    });
  } else {
    const response = await axiosInstance.delete(
      apiEndpoints.bunny.deleteMonthlyTarget(targetId),
      {
        headers: {'member-no': memberNo},
      },
    );
    return response.data;
  }
};
