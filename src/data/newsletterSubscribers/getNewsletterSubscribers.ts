import { createClient } from "@/utils/supabase/server";
import type { NewsletterSubscriber } from "@/interfaces/newsletterSubscribers/NewsletterSubscriber";

export const getNewsletterSubscribers = async (): Promise<
  NewsletterSubscriber[] | undefined
> => {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("newsletter_subscribers")
    .select("*");

  if (error) {
    console.error("Error fetching newsletter subscribers:", error.message);
    return undefined;
  }

  return data as NewsletterSubscriber[];
};
