import { createClient } from "@/utils/supabase/server";

export const deleteInventoryItem = async (id: number): Promise<boolean> => {
  const supabase = await createClient();

  const { error } = await supabase.from("inventory").delete().eq("id", id);

  if (error) {
    console.error("Error deleting inventory item:", error.message);
    return false;
  }

  return true;
};

