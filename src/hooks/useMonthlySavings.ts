import { useState, useEffect, useCallback } from 'react';
import { getMonthlySavings } from '../api/AkkiApi';
import { MarkedDates, MonthlySaving } from '../types/types';

export const useMonthlySavings = (
  memberNo: number,
  startInclusive: string,
  endInclusive: string,
  category1Name: string,
  category2Name: string,
  category3Name: string
) => {
  const [savings, setSavings] = useState<MonthlySaving[]>([]); // 수정: MonthlySaving[]로 타입 변경
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [markedDates, setMarkedDates] = useState<MarkedDates>({});

  const CATEGORY1_COLOR = '#98A2FF';
  const CATEGORY2_COLOR = '#ACD7FF';
  const DEFAULT_COLOR = '#DECDFF';

  // 카테고리 색상 계산 함수
  const getCategoryColor = useCallback(
    (categoryName: string): string => {
      if (categoryName === category1Name) {
        return CATEGORY1_COLOR;
      } else if (categoryName === category2Name) {
        return CATEGORY2_COLOR;
      } else if (categoryName === category3Name) {
        return DEFAULT_COLOR;
      }
      return '#D3D3D3'; // 기타 기본 색상
    },
    [category1Name, category2Name, category3Name]
  );

  useEffect(() => {
    const loadSavings = async () => {
      try {
        setLoading(true);
        const data: MonthlySaving[] = await getMonthlySavings(
          memberNo,
          startInclusive,
          endInclusive
        );

        // 날짜별 mark 생성
        const newMarkedDates: MarkedDates = {};
        data.forEach((saving) => {
          if (!newMarkedDates[saving.savingDay]) {
            newMarkedDates[saving.savingDay] = {
              marked: true,
              dots: [],
            };
          }
          if (!newMarkedDates[saving.savingDay]?.dots) {
            newMarkedDates[saving.savingDay].dots = [];
          }
          newMarkedDates[saving.savingDay].dots.push({
            key: saving.savingId.toString(),
            color: getCategoryColor(saving.categoryName),
          });
        });

        setSavings(data); // 저장된 데이터 설정
        setMarkedDates(newMarkedDates); // 마크된 날짜 설정
      } catch (err: unknown) {
        if (err instanceof Error) {
          setError(err.message || 'Failed to fetch savings.');
        } else {
          setError('An unexpected error occurred.');
        }
      } finally {
        setLoading(false);
      }
    };

    loadSavings();
  }, [memberNo, startInclusive, endInclusive, getCategoryColor]);

  return { savings, markedDates, loading, error };
};
