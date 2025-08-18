import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

export async function POST(req: Request) {
  try {
    const { sql } = await req.json();
    
    if (!sql) {
      return NextResponse.json({ 
        success: false, 
        error: "No SQL query provided" 
      }, { status: 400 });
    }

    const supabase = await createClient();
    
    // Execute the SQL query directly
    const { data, error } = await supabase.rpc('exec_sql', { query: sql });

    if (error) {
      console.error("Error executing SQL:", error);
      return NextResponse.json({ 
        success: false, 
        error: error.message 
      }, { status: 500 });
    }

    return NextResponse.json({ 
      success: true,
      message: "SQL executed successfully",
      data
    });
  } catch (error) {
    console.error("Unexpected error:", error);
    return NextResponse.json({ 
      success: false, 
      error: String(error) 
    }, { status: 500 });
  }
}
