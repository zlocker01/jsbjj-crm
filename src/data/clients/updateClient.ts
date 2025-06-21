import { createClient } from "@/utils/supabase/server";
import type { Client } from "@/interfaces/client/Client";

export const updateClient = async (
  id: string,
  clientData: Partial<Client>,
): Promise<string | undefined> => {
  const supabase = await createClient();

  const { error } = await supabase
    .from("clients")
    .update(clientData)
    .eq("id", id);

  if (error) {
    console.error("🚀 ~ updateClient error:", error.message);
    return error.message;
  }

  return;
};
