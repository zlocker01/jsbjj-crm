import { createClient } from "@/utils/supabase/server";
import { unstable_noStore as noStore } from 'next/cache';

export const getUserId = async (): Promise<string | null> => {
  noStore();
  const supabase = await createClient();

  const { data, error } = await supabase.auth.getUser();
  if (!data || error) {
    console.error("error!!! -->", error?.message);
    return null;
  }
  const userId = data.user.id;
  return userId;
};
