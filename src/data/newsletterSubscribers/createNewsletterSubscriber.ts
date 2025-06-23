import * as z from "zod";
import { createClient } from "@/utils/supabase/server";
import type { NewsletterSubscriber } from "@/interfaces/newsletterSubscribers/NewsletterSubscriber";
import { newsLetterFormSchema } from "@/schemas/newsLetterSchemas/newsLetterFormSchema";

export const createNewsletterSubscriber = async (
  values: z.infer<typeof newsLetterFormSchema>,
  source: string = "web",
): Promise<NewsletterSubscriber | null> => {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("newsletter_subscribers")
    .insert({
      email: values.email,
      subscribed_at: new Date().toISOString(),
      is_subscribed: true,
      source: source,
    })
    .select()
    .single();

  if (error) {
    console.error("Error creating newsletter subscriber:", error.message);
    return null;
  }

  return data as NewsletterSubscriber;
};
