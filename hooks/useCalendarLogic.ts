import { STATUS_NO, STATUS_NONE, STATUS_YES } from '@/constants/Status';
import { calendarAtom } from '@/store/atoms';
import { getAllData, setStatusForDate } from '@/store/storage';
import { CalendarDto } from '@/types/api';
import { useAtom } from 'jotai';
import { useEffect, useMemo, useState } from 'react';

const getToday = (): string => {
  const date = new Date();
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const color = (value?: string): string | undefined => {
  switch (value) {
    case STATUS_YES:
      return '#FFC78A';
    case STATUS_NO:
      return '#5EDC74';
    default:
      return undefined;
  }
};

export const useCalendarLogic = () => {
  const [calendarValues, setClendarValues] = useAtom(calendarAtom);

  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [status, setStatus] = useState<string>(STATUS_NONE);
  const [weight, setWeight] = useState<string>();
  const [memo, setMemo] = useState<string>();

  const [maxNoStreak, setMaxNoStreak] = useState<number>(0);
  const [currentNoStreak, setCurrentNoStreak] = useState<number>(0);

  const today = useMemo(getToday, []);

  const loadData = async () => {
    try {
      const fetchedData = await getAllData();
      setClendarValues(fetchedData);
    } catch (error) {
      console.error(error);
    }
  };

  const calculateStreak = () => {
    const todayYYYYMMDD = today.replace(/-/g, '');

    const sortedData = [...calendarValues].sort((a, b) => a.date.localeCompare(b.date));

    let maxStreakCount = 0;
    let currentStreakCount = 0;
    let todayStreakCount = 0;
    let lastDate: Date | null = null;

    for (const item of sortedData) {
      if (item.date > todayYYYYMMDD) {
        break;
      }

      const y = Number(item.date.slice(0, 4));
      const m = Number(item.date.slice(4, 6)) - 1;
      const d = Number(item.date.slice(6, 8));
      const currentDate = new Date(y, m, d);

      if (lastDate && (currentDate.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24) > 1) {
        currentStreakCount = 0;
      }

      if (item.status === STATUS_NO) {
        currentStreakCount++;
      } else {
        currentStreakCount = 0;
      }

      maxStreakCount = Math.max(maxStreakCount, currentStreakCount);

      if (item.date === todayYYYYMMDD) {
        todayStreakCount = currentStreakCount;
      }

      lastDate = currentDate;
    }

    // If today has no record, carry yesterday's streak forward
    if (todayStreakCount === 0) {
      const [y, m, d] = today.split('-').map(Number);
      const yesterdayDate = new Date(y, m - 1, d - 1);
      const yesterdayYYYYMMDD = `${yesterdayDate.getFullYear()}${(yesterdayDate.getMonth() + 1).toString().padStart(2, '0')}${yesterdayDate.getDate().toString().padStart(2, '0')}`;

      const yesterdayData = sortedData.find(item => item.date === yesterdayYYYYMMDD);
      if (yesterdayData && yesterdayData.status === STATUS_NO) {
        let streakCount = 0;
        let checkDate = new Date(yesterdayDate);
        while (true) {
          const dateStr = `${checkDate.getFullYear()}${(checkDate.getMonth() + 1).toString().padStart(2, '0')}${checkDate.getDate().toString().padStart(2, '0')}`;
          const data = sortedData.find(item => item.date === dateStr);
          if (data && data.status === STATUS_NO) {
            streakCount++;
            checkDate.setDate(checkDate.getDate() - 1);
          } else {
            break;
          }
        }
        todayStreakCount = streakCount;
      }
    }

    setMaxNoStreak(maxStreakCount);
    setCurrentNoStreak(todayStreakCount);
  };

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    if (calendarValues.length > 0) {
      calculateStreak();
    }
  }, [calendarValues]);

  const handleSetStatus = async (status?: string, weight?: string, memo?: string) => {
    if (!selectedDate) return;
    const yyyymmdd = selectedDate.replace(/-/g, '');
    await setStatusForDate({ date: yyyymmdd, status: status, weight: weight, memo: memo });
    await loadData();
  };

  const handleDayPress = (date: { dateString: string }) => {
    setSelectedDate(date.dateString);
    const selectedData = calendarValues.find((item: CalendarDto) => item.date === date.dateString.replace(/-/g, ''));
    setStatus(selectedData?.status || STATUS_NONE);
    setWeight(selectedData?.weight);
    setMemo(selectedData?.memo);
  };

  const markedDates = useMemo(() => {
    const allMarkedDates = calendarValues.reduce((acc: any, current: CalendarDto) => {
      const formattedDate = `${current.date.substring(0, 4)}-${current.date.substring(4, 6)}-${current.date.substring(6, 8)}`;
      return {
        ...acc,
        [formattedDate]: { selected: current.status !== STATUS_NONE, selectedColor: color(current.status) },
      };
    }, {});
    if (selectedDate) {
      allMarkedDates[selectedDate] = {
        ...allMarkedDates[selectedDate],
        selected: true,
        selectedColor: 'rgba(0, 122, 255, 0.2)',
        selectedTextColor: '#000000',
        marked: true,
        dotColor: '#007AFF',
      };
    }
    return allMarkedDates;
  }, [calendarValues, selectedDate]);

  return {
    today,
    calendarValues,
    selectedDate,
    status,
    setStatus,
    weight,
    setWeight,
    memo,
    setMemo,
    maxNoStreak,
    currentNoStreak,
    markedDates,
    handleDayPress,
    handleSetStatus,
  };
};
