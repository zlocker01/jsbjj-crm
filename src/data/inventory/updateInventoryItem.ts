import { createClient } from "@/utils/supabase/server";
import type { InventoryItem } from "@/interfaces/inventory/InventoryItem";

export type UpdateInventoryItemInput = Partial<
  Omit<InventoryItem, "id" | "created_at" | "updated_at">
>;

export const updateInventoryItem = async (
  id: number,
  payload: UpdateInventoryItemInput,
): Promise<InventoryItem | null> => {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("inventory")
    .update({
      ...payload,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id)
    .select("*")
    .single();

  if (error) {
    console.error("Error updating inventory item:", error.message);
    return null;
  }

  return data as InventoryItem;
};

