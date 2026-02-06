import { createClient } from "@/utils/supabase/server";
import type { InventoryItem } from "@/interfaces/inventory/InventoryItem";

export const getInventoryItems = async (): Promise<InventoryItem[] | null> => {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("inventory")
    .select("*")
    .order("name", { ascending: true });

  if (error) {
    console.error("Error fetching inventory items:", error.message);
    return null;
  }

  return data as InventoryItem[];
};

