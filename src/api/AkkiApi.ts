import axiosInstance from './axiosInstance';
import apiEndpoints from './apiEndpoints';
import {
  SaveDetailResponse,
  SaveMoneyParams,
  TodaySavingResponse,
} from '../types/types';

export const refetchAll = async (
  memberNo: number,
  startInclusive: string,
  endInclusive: string,
  targetDay: string,
) => {
  try {
    const [todaySaving, monthlySavings, savingDetails] = await Promise.all([
      fetchTodaySaving(memberNo), // 오늘의 아끼기
      getMonthlySavings(memberNo, startInclusive, endInclusive), // 월별 아끼기
      getSavingDetails(memberNo, targetDay), // 특정 날짜의 아끼기 상세
    ]);

    return {
      todaySaving,
      monthlySavings,
      savingDetails,
    };
  } catch (error) {
    console.error('Error refetching all savings:', error);
    throw error;
  }
};

// 아끼기 금액 설정
export const createSavingAmount = async (params: SaveMoneyParams) => {
  const {memberNo, ...savingData} = params; // memberNo를 헤더로, 나머지를 본문으로 전달

  try {
    const response = await axiosInstance.post(
      apiEndpoints.save.createSavingAmount,
      savingData,
      {
        headers: {'member-no': memberNo.toString()},
      },
    );
    return response.data;
  } catch (error: any) {
    console.error('Error creating saving amount:', error);
    throw new Error(error.response?.data?.error?.message || 'API 호출 실패');
  }
};

// 아끼기 항목 설정
export const createSavingIcon = async (
  memberNo: number,
  iconData: {
    categoryName1: string;
    categoryName2: string;
  },
) => {
  try {
    const response = await axiosInstance.post(
      apiEndpoints.save.createSavingIcon,
      iconData,
      {
        headers: {'member-no': memberNo},
      },
    );
    return response.data;
  } catch (error) {
    console.error('Error creating saving icon:', error);
    throw error;
  }
};

// 먼슬리 아끼기 조회
export const getMonthlySavings = async (
  memberNo: number,
  startInclusive: string,
  endInclusive: string,
): Promise<any> => {
  try {
    const response = await axiosInstance.get(
      apiEndpoints.save.getMonthlySavings,
      {
        headers: {'member-no': memberNo},
        params: {startInclusive, endInclusive},
      },
    );

    if (response.data && response.data.resultType === 'SUCCESS') {
      return response.data.success;
    } else {
      throw new Error(
        response.data?.error?.message || 'Unknown error occurred.',
      );
    }
  } catch (error: any) {
    console.error('Error fetching monthly savings:', error);
    throw error;
  }
};

// 아끼기 상세 스케줄 조회
export const getSavingDetails = async (memberNo: number, targetDay: string) => {
  try {
    const response = await axiosInstance.get<SaveDetailResponse>(
      apiEndpoints.save.getSavingDetail,
      {
        headers: {'member-no': memberNo},
        params: {targetDay},
      },
    );
    return response.data;
  } catch (error) {
    console.error('Error fetching saving details:', error);
    throw error;
  }
};

// 아낀 내역 삭제
export const deleteSaving = async (
  memberNo: number,
  savingId: number,
  body: {categoryName: string; savingPrice: number}, // Body 타입 지정
) => {
  try {
    const response = await axiosInstance.delete(
      apiEndpoints.save.deleteSaving(savingId),
      {
        headers: {'member-no': memberNo},
        data: body, // DELETE 요청에 Body 포함
      },
    );
    return response.data;
  } catch (error) {
    console.error('Error deleting saving:', error);
    throw error;
  }
};

export const fetchTodaySaving = async (
  memberNo: number,
): Promise<TodaySavingResponse> => {
  try {
    const response = await axiosInstance.get(apiEndpoints.save.getSavingToday, {
      headers: {'member-no': memberNo.toString()},
    });
    return response.data.success;
  } catch (error: any) {
    console.error("Error fetching today's savings:", error);
    throw new Error(error.response?.data?.error?.message || 'API 호출 실패');
  }
};
