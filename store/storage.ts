import AsyncStorage from "@react-native-async-storage/async-storage";
import { CalendarDto } from "@/types/api";

const STORAGE_KEY = "calendarInfo";

type StorageEntry = {
  status: string;
  weight: string;
  memo: string;
};

type StorageData = Record<string, StorageEntry>;

const getAll = async (): Promise<StorageData> => {
  const json = await AsyncStorage.getItem(STORAGE_KEY);
  return json ? JSON.parse(json) : {};
};

export const setStatusForDate = async (data: CalendarDto) => {
  const all = await getAll();
  all[data.date] = {
    status: data.status ?? "0",
    weight: data.weight ?? "",
    memo: data.memo ?? "",
  };
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(all));
};

export const getAllData = async (): Promise<CalendarDto[]> => {
  const all = await getAll();
  return Object.entries(all).map(([date, entry]) => ({
    date,
    status: entry.status,
    weight: entry.weight,
    memo: entry.memo,
  }));
};

export const getStatusByDate = async (date: string): Promise<string | null> => {
  const all = await getAll();
  return all[date]?.status ?? null;
};
