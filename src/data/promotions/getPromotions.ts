import { createClient } from "@/utils/supabase/server";
import type { Promotion } from "@/interfaces/promotions/Promotion";

export const getPromotions = async (
  landingPageId: string,
): Promise<Promotion[] | null> => {
  try {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from("promotions")
      .select("*")
      .eq("landing_page_id", landingPageId);

    if (error) {
      console.error("Error fetching promotions:", error.message);
      return null;
    }

    return data as Promotion[];
  } catch (error) {
    console.error("Unexpected error:", error);
    return null;
  }
};
