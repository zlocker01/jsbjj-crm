import { createClient } from "@/utils/supabase/server";
import { getUserId } from "@/data/getUserIdServer";
import type { FaqItem } from "@/interfaces/faqItems/FaqItem";

export async function updateFaqItem(
  id: number,
  updates: Partial<FaqItem>,
): Promise<string | undefined> {
  const supabase = await createClient();
  const userId = await getUserId();

  if (!userId) {
    return undefined;
  }

  const { data, error } = await supabase
    .from("faq_items")
    .update(updates)
    .eq("id", id)
    .select("*")
    .single();

  if (error) {
    console.error("Error updating FAQ item:", error);
    return undefined;
  }

  return data.id;
}
