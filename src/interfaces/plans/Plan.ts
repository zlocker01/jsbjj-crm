export interface Plan {
  id: number;
  plan_id: string;
  name: string;
  description: string;
  price: number;
  annual_price: number;
  period: string;
  stripe_price_id: string;
  stripe_annual_price_id: string;
  discount_percentage: number | null;
  highlighted: boolean;
  badge: string | null;
  cta: string;
  created_at?: string;
  updated_at?: string;
  features?: PlanFeature[];
}

export interface PlanFeature {
  text: string;
  included: boolean;
}
