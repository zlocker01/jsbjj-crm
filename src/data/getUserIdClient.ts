import { createClient } from "@/utils/supabase/client";

export const getUserId = async (): Promise<string | null> => {
  const supabase = await createClient();
  const { data, error: errorUser } = await supabase.auth.getUser();

  if (errorUser || !data?.user) {
    console.error("Error fetching user:", errorUser?.message);
    return null;
  }
  const userId = data.user.id;
  return userId;
};
