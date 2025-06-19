import type { Plan } from "@/interfaces/plans/Plan";
import { createClient } from "@/utils/supabase/client";

export const getPlans = async (): Promise<Plan[] | null> => {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("stripe_plans")
    .select("*")
    .order("price", { ascending: true });

  if (error) {
    console.error("🚀 ~ getPlans ~ error:", error.message);
    return null;
  }

  return data;
};
