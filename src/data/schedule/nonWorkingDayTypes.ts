import type { NonWorkingDay } from "@/interfaces/schedule/NonWorkingDays";

// id, user_id y created_at son gestionados por la base de datos o el backend.
export type CreateNonWorkingDayData = Pick<
  NonWorkingDay,
  "date" | "description"
>;

// No se necesita un tipo Update específico si solo se crean/eliminan.
// Si se permitiera editar, se definiría aquí.

export interface NonWorkingDaysApiResponse {
  nonWorkingDays: NonWorkingDay[];
  error?: string;
}

export interface NonWorkingDayApiResponse {
  nonWorkingDay?: NonWorkingDay;
  message: string;
  error?: string;
}
