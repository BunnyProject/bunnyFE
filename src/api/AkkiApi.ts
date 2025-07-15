import axiosInstance from './axiosInstance';
import apiEndpoints from './apiEndpoints';
import {
  SaveDetailResponse,
  SaveMoneyParams,
  TodaySavingResponse,
} from '../types/types';

const isMock = process.env.NODE_ENV !== 'production';

export const refetchAll = async (
  memberNo: number,
  startInclusive: string,
  endInclusive: string,
  targetDay: string,
) => {
  // 실제 함수는 내부에서 각 API를 호출하므로, mock 분기는 각 API 함수에서 처리됨
  const [todaySaving, monthlySavings, savingDetails] = await Promise.all([
    fetchTodaySaving(memberNo),
    getMonthlySavings(memberNo, startInclusive, endInclusive),
    getSavingDetails(memberNo, targetDay),
  ]);
  return { todaySaving, monthlySavings, savingDetails };
};

export const createSavingAmount = async (params: SaveMoneyParams) => {
  if (isMock) {
    return Promise.resolve({
      resultType: 'SUCCESS',
      success: { ...params, saved: true },
    });
  } else {
    const {memberNo, ...savingData} = params;
    const response = await axiosInstance.post(
      apiEndpoints.save.createSavingAmount,
      savingData,
      {
        headers: {'member-no': memberNo.toString()},
      },
    );
    return response.data;
  }
};

export const createSavingIcon = async (
  memberNo: number,
  iconData: {
    categoryName1: string;
    categoryName2: string;
  },
) => {
  if (isMock) {
    return Promise.resolve({
      resultType: 'SUCCESS',
      success: { ...iconData, created: true },
    });
  } else {
    const response = await axiosInstance.post(
      apiEndpoints.save.createSavingIcon,
      iconData,
      {
        headers: {'member-no': memberNo},
      },
    );
    return response.data;
  }
};

export const getMonthlySavings = async (
  memberNo: number,
  startInclusive: string,
  endInclusive: string,
): Promise<any> => {
  if (isMock) {
    return Promise.resolve([
      { savingId: 1, savingDay: startInclusive, savingPrice: 1000 },
      { savingId: 2, savingDay: endInclusive, savingPrice: 2000 },
    ]);
  } else {
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
  }
};

export const getSavingDetails = async (memberNo: number, targetDay: string) => {
  if (isMock) {
    return Promise.resolve({
      resultType: 'SUCCESS',
      success: { targetDay, details: 'mock details' },
    });
  } else {
    const response = await axiosInstance.get<SaveDetailResponse>(
      apiEndpoints.save.getSavingDetail,
      {
        headers: {'member-no': memberNo},
        params: {targetDay},
      },
    );
    return response.data;
  }
};

export const deleteSaving = async (
  memberNo: number,
  savingId: number,
  body: {categoryName: string; savingPrice: number},
) => {
  if (isMock) {
    return Promise.resolve({
      resultType: 'SUCCESS',
      success: { deletedSavingId: savingId, deleted: true },
    });
  } else {
    const response = await axiosInstance.delete(
      apiEndpoints.save.deleteSaving(savingId),
      {
        headers: {'member-no': memberNo},
        data: body,
      },
    );
    return response.data;
  }
};

export const fetchTodaySaving = async (
  memberNo: number,
): Promise<TodaySavingResponse> => {
  if (isMock) {
    return Promise.resolve({
      todayTotalMoney: 5000,
      todaySavingCategoryList: [
        {
          categoryId: 1,
          categoryName: '커피',
          totalSavingChance: 2,
          totalSavingCategoryMoney: 3000,
        },
        {
          categoryId: 2,
          categoryName: '담배',
          totalSavingChance: 1,
          totalSavingCategoryMoney: 4500,
        },
        {
          categoryId: 3,
          categoryName: '기타',
          totalSavingChance: 1,
          totalSavingCategoryMoney: 4500,
        },
      ],
    });
  } else {
    const response = await axiosInstance.get(apiEndpoints.save.getSavingToday, {
      headers: {'member-no': memberNo.toString()},
    });
    return response.data.success;
  }
};
