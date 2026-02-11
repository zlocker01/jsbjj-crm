export interface Package {
  id: number;
  landing_page_id: string;
  user_id: string;
  name: string;
  price: number;
  subtitle: string;
  image?: string;
  benefits: string[];
  restrictions?: string[];
  created_at?: string;
}
