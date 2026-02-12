export interface Appointment {
  id: string; // UUID
  client_id?: string; // UUID
  service_id?: number; // int8
  user_id: string; // UUID
  start_datetime: string;
  end_datetime: string;
  status: 'Confirmada' | 'Cancelada' | 'Proceso';
  date: string;
  actual_duration_minutes?: number;
  price_charged: number;
  created_at: string;
}
