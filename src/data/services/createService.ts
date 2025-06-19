import { createClient } from "@/utils/supabase/server";
import type { Service } from "@/interfaces/services/Service";
import { getUserId } from "@/data/getUserIdServer";

export const createService = async (
  serviceData: Omit<Service, "id" | "user_id">,
): Promise<number | undefined> => {
  try {
    const supabase = await createClient();
    const userId = await getUserId();

    if (!userId) {
      return undefined;
    }

    const { data, error } = await supabase
      .from("services")
      .insert([
        {
          ...serviceData,
          user_id: userId,
        },
      ])
      .select("id")
      .single();

    if (error) {
      console.error("Error creating service:", error);
      return undefined;
    }

    return data.id;
  } catch (error) {
    console.error("Unexpected error:", error);
    return undefined;
  }
};
