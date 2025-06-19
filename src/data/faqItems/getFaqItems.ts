import { createClient } from "@/utils/supabase/server";
import type { FaqItem } from "@/interfaces/faqItems/FaqItem";

export async function getFaqItems(
  landingPageId: string,
): Promise<FaqItem[] | undefined> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("faq_items")
    .select("*")
    .eq("landing_page_id", landingPageId);

  if (error) {
    console.error("Error fetching FAQ items:", error);
    return undefined;
  }

  return data as FaqItem[];
}
