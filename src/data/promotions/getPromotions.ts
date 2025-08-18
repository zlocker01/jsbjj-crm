import { createClient } from "@/utils/supabase/server";
import type { Promotion } from "@/interfaces/promotions/Promotion";

export const getPromotions = async (
  landingPageId: string,
  includeInactive: boolean = false,
): Promise<Promotion[] | null> => {
  try {
    const supabase = await createClient();

    let query = supabase
      .from("promotions")
      .select("*")
      .eq("landing_page_id", landingPageId);
      
    // Only include active promotions unless specifically requested to include inactive ones
    if (!includeInactive) {
      query = query.eq("active", true);
    }
    
    const { data, error } = await query;

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
