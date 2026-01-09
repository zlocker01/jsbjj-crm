export interface Promotion {
  id: number;
  user_id?: string;
  title: string;
  description: string;
  image: string;
  price: number;
  discount_price: number;
  valid_until: string;
  landing_page_id?: string;
  duration_minutes: number;
  category: string;
  sessions_count?: number;
  target_audience?: string;
  active?: boolean;
}
