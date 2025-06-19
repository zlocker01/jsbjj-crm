export interface CombinedUser {
  id: string;
  email: string | undefined;
  name: string | undefined;
  role: string;
  stripe_customer_id: string | null;
  stripe_price_id: string | null;
  status: string | null;
  trial_ends_at: string | null;
  current_period_ends_at: string | null;
}
