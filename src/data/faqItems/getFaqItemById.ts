import { createClient } from "@/utils/supabase/server";
import type { FaqItem } from "@/interfaces/faqItems/FaqItem";

export async function getFaqItemById(id: number): Promise<FaqItem | null> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("faq_items")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    console.error("Error fetching FAQ item by ID:", error);
    return null;
  }

  return data as FaqItem;
}
