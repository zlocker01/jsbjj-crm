import { createClient } from "@/utils/supabase/server";
import { getUserId } from "@/data/getUserIdServer";
import type { Client } from "@/interfaces/client/Client";

export const getClients = async (): Promise<Client[] | undefined> => {
  const supabase = await createClient();
  const userId = await getUserId();

  const { data, error } = await supabase
    .from("clients")
    .select("*")
    .eq("user_id", userId);

  if (error) {
    console.error("🚀 ~ getClients error:", error.message);
    return undefined;
  }

  return data as Client[];
};
