export interface CalendarDto {
  // 日付
  date: string;
  // '0' : 未設定
  // '1' : Yes
  // '2' : No
  status?: string;
  weight?: string;
  memo?: string;
}