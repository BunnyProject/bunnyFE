import { useState, useEffect } from 'react';
import moment from 'moment-timezone';
import axiosInstance from '../api/axiosInstance';

type TodayBunnyData = {
  endTime: moment.Moment | null;
  ratePerMinute: number;
};

const useTodayBunny = (memberNo: number): TodayBunnyData => {
  const [endTime, setEndTime] = useState<moment.Moment | null>(null);
  const [ratePerMinute, setRatePerMinute] = useState<number>(50); // 기본값

  useEffect(() => {
    const fetchTodayBunny = async () => {
      try {
        const response = await axiosInstance.get('/bunny', {
          headers: { 'member-no': memberNo },
        });

        if (response.data.resultType === 'SUCCESS') {
          const { quttingTime, minMoney } = response.data.success;

          // API 응답에서 퇴근 시간을 Moment 객체로 변환
          const endMoment = moment.tz('Asia/Seoul').set({
            hour: quttingTime.hour,
            minute: quttingTime.minute,
            second: quttingTime.second,
          });

          setEndTime(endMoment);
          setRatePerMinute(minMoney);
        } else {
          throw new Error(response.data.error?.message || 'API 호출 실패');
        }
      } catch (error) {
        console.error('Error fetching today bunny:', error);
        setEndTime(null);
        setRatePerMinute(50); // 기본값 유지
      }
    };

    fetchTodayBunny();
  }, [memberNo]);

  return { endTime, ratePerMinuate };
};

export default useTodayBunny;
