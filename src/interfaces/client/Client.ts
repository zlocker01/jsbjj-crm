export interface Client {
  id: string; // UUID
  name: string;
  email?: string;
  phone?: string;
  avatar?: string; // URL of the client's avatar
  birthday?: string;
  notes?: string;
  registration_date: string; // ISO string para timestamp
  user_id: string; // UUID
  is_active: boolean;
  last_visit_date?: string; // ISO string para timestamp
  client_source?: string; // Rol del usuario que creó el cliente
  appointments?: number;
}
