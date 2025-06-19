import { createClient } from "@/utils/supabase/server";
import { getUserId } from "@/data/getUserIdServer";
import type { Client } from "@/interfaces/client/Client";

export const updateClient = async (
  id: string,
  clientData: Partial<Client>,
): Promise<string | undefined> => {
  const supabase = await createClient();
  const userId = await getUserId();

  const { error } = await supabase
    .from("clients")
    .update(clientData)
    .eq("id", id)
    .eq("user_id", userId);

  if (error) {
    console.error("🚀 ~ updateClient error:", error.message);
    return error.message;
  }

  return;
};
