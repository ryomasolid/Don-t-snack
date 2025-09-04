import { STATUS_NO, STATUS_NONE, STATUS_YES } from '@/constants/Status';
import { calendarAtom } from '@/store/atoms';
import { getAllData, setStatusForDate } from '@/store/firestore';
import { CalendarDto } from '@/types/api';
import { useEffect, useMemo, useState } from 'react';

/** 
 * 現在の日付を日本標準時（JST）で取得し、「YYYY-MM-DD」形式の文字列として返す
 */
const getTodayJST = (): string => {
  const date = new Date();
  const formatter = new Intl.DateTimeFormat('ja-JP', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    timeZone: 'Asia/Tokyo',
  });
  const parts = formatter.formatToParts(date);
  const year = parts.find(p => p.type === 'year')?.value;
  const month = parts.find(p => p.type === 'month')?.value;
  const day = parts.find(p => p.type === 'day')?.value;
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
  const { useAtom } = require("jotai");
  const [calendarValues, setClendarValues] = useAtom(calendarAtom);

  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [status, setStatus] = useState<string>(STATUS_NONE);
  const [weight, setWeight] = useState<string>();
  const [memo, setMemo] = useState<string>();

  const [maxNoStreak, setMaxNoStreak] = useState<number>(0);
  const [currentNoStreak, setCurrentNoStreak] = useState<number>(0);

  const today = useMemo(getTodayJST, []);

  /** 
   * Firestoreから全てのカレンダーデータを非同期で取得し、
   * jotaiのグローバルな状態（calendarValues）を更新する関数
   */
  const loadData = async () => {
    try {
      const fetchedData = await getAllData();
      setClendarValues(fetchedData);
    } catch (error) {
      console.error(error);
    }
  };

  /** 
   * 最大連続日数と現在の連続日数を計算する関数
   */
  const calculateStreak = () => {
    // ISO 形式 'YYYY-MM-DD' を 'YYYYMMDD' に変換
    const todayYYYYMMDD = today.replace(/-/g, '');

    // 日付でソートされたデータ
    const sortedData = [...calendarValues].sort((a, b) => a.date.localeCompare(b.date));

    let maxStreakCount = 0;
    let currentStreakCount = 0;
    let todayStreakCount = 0;

    // 最後のデータの日付を保持する変数
    let lastDate = null;

    for (const item of sortedData) {
      // 今日以降のデータは無視
      if (item.date > todayYYYYMMDD) {
        break;
      }

      // 連続しているかどうかの判定
      const currentDate = new Date(`${item.date.slice(0, 4)}-${item.date.slice(4, 6)}-${item.date.slice(6, 8)}`);
      if (lastDate && (currentDate.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24) > 1) {
        // 日付が連続していない場合、ストリークをリセット
        currentStreakCount = 0;
      }

      if (item.status === STATUS_NO) {
        currentStreakCount++;
      } else {
        currentStreakCount = 0;
      }

      // 最大ストリークを更新
      maxStreakCount = Math.max(maxStreakCount, currentStreakCount);

      // 今日のストリークを更新
      if (item.date === todayYYYYMMDD) {
        todayStreakCount = currentStreakCount;
      }

      // 最終処理された日付を更新
      lastDate = currentDate;
    }

    // todayYYYYMMDDがデータに存在しない場合、昨日のストリークが今日のストリークになる
    if (todayStreakCount === 0) {
      // todayの一つ前の日付を取得
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);
      const yesterdayYYYYMMDD = yesterday.toISOString().split('T')[0].replace(/-/g, '');

      const yesterdayData = sortedData.find(item => item.date === yesterdayYYYYMMDD);
      if (yesterdayData && yesterdayData.status === STATUS_NO) {
        // 昨日のデータがSTATUS_NOであれば、今日のストリークは昨日のストリークの継続
        const tempStreak = [];
        let date = yesterday;
        while (true) {
          const dateStr = date.toISOString().split('T')[0].replace(/-/g, '');
          const data = sortedData.find(item => item.date === dateStr);
          if (data && data.status === STATUS_NO) {
            tempStreak.push(data);
            date.setDate(date.getDate() - 1);
          } else {
            break;
          }
        }
        todayStreakCount = tempStreak.length;
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

  /** 
   * 選択された日付のデータをFirestoreに保存
   */
  const handleSetStatus = async (status?: string, weight?: string, memo?: string) => {
    if (!selectedDate) return;
    const yyyymmdd = selectedDate.replace(/-/g, '');
    await setStatusForDate({ date: yyyymmdd, status: status, weight: weight, memo: memo });
    await loadData();
  };

  /** 
   * カレンダーの日付がタップされたときに実行される関数
   */
  const handleDayPress = (date: { dateString: string }) => {
    setSelectedDate(date.dateString);
    const selectedData = calendarValues.find((item: CalendarDto) => item.date === date.dateString.replace(/-/g, ''));
    setStatus(selectedData?.status || STATUS_NONE);
    setWeight(selectedData?.weight);
    setMemo(selectedData?.memo);
  };

  /** 
   * カレンダーに表示するマーク付きの日付データを計算し、キャッシュする関数
   */
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