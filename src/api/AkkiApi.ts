import axiosInstance from './axiosInstance';
import apiEndpoints from './apiEndpoints';

// 아끼기 금액 설정
export const createSavingAmount = async (memberNo: number, savingData: {
    categoryId: number;
    categoryName: string;
    detail: string;
    savingDay: string; // ISO Date format (e.g., '2024-11-23')
    savingPrice: number;
  }) => {
    try {
      const response = await axiosInstance.post(apiEndpoints.save.createSavingAmount, savingData, {
        headers: { 'member-no': memberNo },
      });
      return response.data;
    } catch (error) {
      console.error('Error creating saving amount:', error);
      throw error;
    }
  };
  
  // 아끼기 항목 설정
  export const createSavingIcon = async (memberNo: number, iconData: {
    categoryName1: string;
    categoryName2: string;
  }) => {
    try {
      const response = await axiosInstance.post(apiEndpoints.save.createSavingIcon, iconData, {
        headers: { 'member-no': memberNo },
      });
      return response.data;
    } catch (error) {
      console.error('Error creating saving icon:', error);
      throw error;
    }
  };
  
  // 먼슬리 아끼기 조회
  export const getMonthlySavings = async (memberNo: number, startInclusive: string, endInclusive: string) => {
    try {
      const response = await axiosInstance.get(apiEndpoints.save.getMonthlySavings, {
        headers: { 'member-no': memberNo },
        params: { startInclusive, endInclusive },
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching monthly savings:', error);
      throw error;
    }
  };
  
  // 아끼기 상세 스케줄 조회
  export const getSavingDetails = async (memberNo: number, targetDay: string) => {
    try {
      const response = await axiosInstance.get(apiEndpoints.save.getSavingDetail, {
        headers: { 'member-no': memberNo },
        params: { targetDay },
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching saving details:', error);
      throw error;
    }
  };
  
  // 아낀 내역 삭제
  export const deleteSaving = async (memberNo: number, savingId: number) => {
    try {
      const response = await axiosInstance.delete(apiEndpoints.save.deleteSaving(savingId), {
        headers: { 'member-no': memberNo },
      });
      return response.data;
    } catch (error) {
      console.error('Error deleting saving:', error);
      throw error;
    }
  };
  