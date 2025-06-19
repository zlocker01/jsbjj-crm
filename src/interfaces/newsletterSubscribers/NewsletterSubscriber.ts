export interface NewsletterSubscriber {
  id: string;
  email: string;
  subscribed_at: Date;
  is_subscribed: boolean;
  source?: string;
}
