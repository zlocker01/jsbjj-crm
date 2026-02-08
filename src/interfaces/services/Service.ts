export interface Service {
  id: number;
  user_id?: string;
  title: string;
  description: string;
  price: number;
  duration_minutes?: number;
  image: string;
  category: string;
  landing_page_id?: string;
}
