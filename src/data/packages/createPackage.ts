import { createClient } from "@/utils/supabase/server";
import type { Package } from "@/interfaces/packages/Package";

export const createPackage = async (
  packageData: Omit<Package, "id" | "created_at">,
): Promise<number | undefined> => {
  try {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from("packages")
      .insert([packageData])
      .select("id")
      .single();

    if (error) {
      console.error("Error creating package:", error);
      return undefined;
    }

    return data.id;
  } catch (error) {
    console.error("Unexpected error:", error);
    return undefined;
  }
};
