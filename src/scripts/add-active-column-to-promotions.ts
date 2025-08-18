"use server";

import { createClient } from "@/utils/supabase/server";

export async function addActiveColumnToPromotions() {
  try {
    const supabase = await createClient();
    
    // Add the active column with a default value of true
    const { error: alterTableError } = await supabase.rpc('execute_sql', {
      sql: `
        ALTER TABLE promotions 
        ADD COLUMN IF NOT EXISTS active BOOLEAN DEFAULT true;
      `
    });

    if (alterTableError) {
      console.error("Error adding active column:", alterTableError);
      return { success: false, error: alterTableError.message };
    }

    // Update existing records to set active = true
    const { error: updateError } = await supabase.rpc('execute_sql', {
      sql: `
        UPDATE promotions 
        SET active = true 
        WHERE active IS NULL;
      `
    });

    if (updateError) {
      console.error("Error updating existing records:", updateError);
      return { success: false, error: updateError.message };
    }

    return { success: true };
  } catch (error) {
    console.error("Unexpected error:", error);
    return { success: false, error: String(error) };
  }
}
