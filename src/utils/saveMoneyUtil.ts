import {useSaveMoney} from '../hooks/useSaveMoney';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {refetchAll} from '../api/AkkiApi';

export const useHandleSaveMoney = () => {
  const {saveMoney, loading, error} = useSaveMoney();

  const handleSaveMoney = async ({
    memberNo,
    categoryName,
    savingPrice,
    savingDay,
    detail,
    currentYear,
    currentMonth,
    updateStates,
  }: {
    memberNo: number;
    categoryName: string;
    savingPrice: number;
    savingDay: string;
    detail: string;
    currentYear: number;
    currentMonth: number;
    updateStates: (data: any) => void;
  }) => {
    try {
      const savedIcons = await AsyncStorage.getItem('selectedIcons');
      const parsedIcons = savedIcons ? JSON.parse(savedIcons) : {};

      const categoryId =
        categoryName === parsedIcons.firstCategory
          ? parsedIcons.firstCategoryId
          : categoryName === parsedIcons.secondCategory
          ? parsedIcons.secondCategoryId
          : parsedIcons.otherCategoryId;

      await saveMoney({
        memberNo,
        categoryId,
        categoryName,
        detail,
        savingDay,
        savingPrice,
      });

      const {start, end} = getMonthStartAndEndDates(currentYear, currentMonth);
      const refetchedData = await refetchAll(memberNo, start, end, savingDay);

      updateStates(refetchedData);
    } catch (err) {
      console.error('Error saving money:', err);
      throw err;
    }
  };

  return {handleSaveMoney, loading, error};
};

const getMonthStartAndEndDates = (year: number, month: number) => {
  const start = new Date(year, month - 1, 1);
  const end = new Date(year, month, 0);

  return {
    start: start.toISOString().split('T')[0],
    end: end.toISOString().split('T')[0],
  };
};
