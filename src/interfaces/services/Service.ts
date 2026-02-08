export interface Service {
  id: number;
  user_id?: string;
  title: string;
  description: string;
  level: string;
  benefits?: string[];
  image: string;
  landing_page_id?: string;
}
