import { createClient } from "@/utils/supabase/server";
import type { Client } from "@/interfaces/client/Client";

export const getClientById = async (
  id: string,
): Promise<Client | undefined> => {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("clients")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    console.error("🚀 ~ getClientById error:", error.message);
    return undefined;
  }

  return data as Client;
};
