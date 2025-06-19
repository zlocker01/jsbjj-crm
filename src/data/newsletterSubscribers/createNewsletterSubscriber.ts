import { createClient } from "@/utils/supabase/server";
import type { NewsletterSubscriber } from "@/interfaces/newsletterSubscribers/NewsletterSubscriber";

export const createNewsletterSubscriber = async (
  email: string,
  source?: string,
): Promise<NewsletterSubscriber | undefined> => {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("newsletter_subscribers")
    .insert({
      email,
      source,
      subscribed_at: new Date().toISOString(),
      is_subscribed: true,
    })
    .select()
    .single();

  if (error) {
    console.error("Error creating newsletter subscriber:", error.message);
    return undefined;
  }

  return data as NewsletterSubscriber;
};
