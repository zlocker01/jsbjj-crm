export interface Schedule {
  id: bigint;
  user_id: string; // uuid se representa comúnmente como string
  day_of_week: string;
  is_working_day: boolean;
  start_time: string; // time without time zone se representa como string (ej: "HH:mm:ss")
  end_time: string;
  break_start_time?: string;
  break_end_time?: string;
}
