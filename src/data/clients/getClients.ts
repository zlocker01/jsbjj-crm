import { createClient } from "@/utils/supabase/server";
import type { Client } from "@/interfaces/client/Client";

export const getClients = async (): Promise<Client[] | undefined> => {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("clients")
    .select("*")

  if (error) {
    console.error("🚀 ~ getClients error:", error.message);
    return undefined;
  }

  return data as Client[];
};
