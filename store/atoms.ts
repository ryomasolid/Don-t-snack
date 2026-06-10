import { atom } from "jotai";
import { CalendarDto } from "@/types/api";

export const colorAtom = atom(false);
export const calendarAtom = atom<CalendarDto[]>([]);
