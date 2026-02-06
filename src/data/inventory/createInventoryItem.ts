import { createClient } from "@/utils/supabase/server";
import type { InventoryItem } from "@/interfaces/inventory/InventoryItem";

export type CreateInventoryItemInput = Omit<
  InventoryItem,
  "id" | "created_at" | "updated_at"
>;

export const createInventoryItem = async (
  payload: CreateInventoryItemInput,
): Promise<InventoryItem | null> => {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("inventory")
    .insert({
      ...payload,
    })
    .select("*")
    .single();

  if (error) {
    console.error("Error creating inventory item:", error.message);
    return null;
  }

  return data as InventoryItem;
};

