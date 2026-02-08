import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

export async function GET() {
  try {
    const supabase = await createClient();

    const sql = `
      ALTER TABLE services 
      ADD COLUMN IF NOT EXISTS level text,
      ADD COLUMN IF NOT EXISTS benefits jsonb;

      ALTER TABLE services
      DROP COLUMN IF EXISTS category,
      DROP COLUMN IF EXISTS price,
      DROP COLUMN IF EXISTS duration;
    `;

    // Execute the SQL query directly using the exec_sql RPC function
    // This assumes the exec_sql function is defined in your Supabase database
    const { error } = await supabase.rpc('exec_sql', { query: sql });

    if (error) {
      console.error("Error executing migration SQL:", error);
      return NextResponse.json({ 
        success: false, 
        error: error.message,
        details: "Ensure the 'exec_sql' RPC function exists in your database."
      }, { status: 500 });
    }

    return NextResponse.json({ 
      success: true,
      message: "Services table schema updated successfully: Added level/benefits, removed category/price/duration." 
    });
  } catch (error) {
    console.error("Unexpected error:", error);
    return NextResponse.json({ 
      success: false, 
      error: String(error) 
    }, { status: 500 });
  }
}
