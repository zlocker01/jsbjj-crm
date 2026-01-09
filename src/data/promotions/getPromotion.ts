import { createClient } from "@/utils/supabase/server";
import type { Promotion } from "@/interfaces/promotions/Promotion";

export const getPromotion = async (id: number): Promise<Promotion | null> => {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("promotions")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    console.error("Error getting promotion:", error.message);
    return null;
  }

  return data as Promotion;
};

export const getPromotions = async (
  landingId: string
): Promise<Promotion[] | null> => {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("promotions")
    .select("*")
    .eq("landing_page_id", landingId);

  if (error) {
    console.error("Error getting promotions:", error.message);
    return null;
  }

  return data as Promotion[];
};
