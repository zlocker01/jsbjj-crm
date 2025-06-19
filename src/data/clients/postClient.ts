import { createClient } from "@/utils/supabase/server";
import { getUserId } from "@/data/getUserIdServer";
import type { Client } from "@/interfaces/client/Client";
import { getUserRole } from "@/data/getUserRole";

export const postClient = async (
  clientData: Omit<
    Client,
    "id" | "registration_date" | "user_id" | "client_source"
  >,
): Promise<boolean> => {
  const supabase = await createClient();
  const userId = await getUserId();
  const userRole = await getUserRole();

  const { error } = await supabase.from("clients").insert([
    {
      ...clientData,
      user_id: userId,
      registration_date: new Date().toISOString(),
      client_source: userRole || "empleado",
    },
  ]);

  if (error) {
    console.error("🚀 ~ postClient error:", error.message);
    return false;
  }

  return true;
};
