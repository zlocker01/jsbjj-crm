import { createClient } from "@/utils/supabase/server";
import { getUserId } from "./getUserIdServer";

export const getUserRole = async (): Promise<string | null> => {
  const supabase = await createClient();
  const userId = await getUserId();

  const { data, error } = await supabase
    .from("users")
    .select("role")
    .eq("id", userId)
    .single();

  if (error || !data) {
    console.error("Error fetching user role:", error?.message);
    return null;
  }

  return data.role;
};
