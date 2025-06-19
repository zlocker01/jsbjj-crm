import { createClient } from "@/utils/supabase/server";
import { getUserId } from "@/data/getUserIdServer";
import type { Client } from "@/interfaces/client/Client";

export const getClientById = async (
  id: string,
): Promise<Client | undefined> => {
  const supabase = await createClient();
  const userId = await getUserId();

  const { data, error } = await supabase
    .from("clients")
    .select("*")
    .eq("id", id)
    .eq("user_id", userId)
    .single();

  if (error) {
    console.error("🚀 ~ getClientById error:", error.message);
    return undefined;
  }

  return data as Client;
};
