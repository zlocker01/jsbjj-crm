import type { Category } from "../landingPages/Category";

export interface GalleryFormData {
  id?: number;
  title: string;
  description: string;
  category: Category;
  is_before_after: boolean;
  image?: string;
  landing_page_id?: string;
}
