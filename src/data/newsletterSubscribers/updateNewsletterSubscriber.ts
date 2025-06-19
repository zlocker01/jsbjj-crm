import { createClient } from "@/utils/supabase/server";
import type { NewsletterSubscriber } from "@/interfaces/newsletterSubscribers/NewsletterSubscriber";

export const updateNewsletterSubscriber = async (
  id: number,
  isSubscribed: boolean,
): Promise<NewsletterSubscriber | undefined> => {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("newsletter_subscribers")
    .update({ is_subscribed: isSubscribed })
    .eq("id", id)
    .select()
    .single();

  if (error) {
    console.error("Error updating newsletter subscriber:", error.message);
    return undefined;
  }

  return data as NewsletterSubscriber;
};
