import { createClient } from "@/utils/supabase/server";
import type { Promotion } from "@/interfaces/promotions/Promotion";
import { getUserId } from "@/data/getUserIdServer";

export const createPromotion = async (
  promotionData: Omit<Promotion, "id" | "user_id">,
): Promise<number | undefined> => {
  try {
    const supabase = await createClient();
    const userId = await getUserId();

    if (!userId) {
      return undefined;
    }

    const { data, error } = await supabase
      .from("promotions")
      .insert([
        {
          ...promotionData,
          user_id: userId,
        },
      ])
      .select("id")
      .single();

    if (error) {
      console.error("Error creating promotion:", error);
      return undefined;
    }

    return data.id;
  } catch (error) {
    console.error("Unexpected error:", error);
    return undefined;
  }
};
