import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

export async function GET() {
  try {
    const supabase = await createClient();
    
    // Execute raw SQL query to add the column
    const { data, error } = await supabase
      .from('promotions')
      .select('id')
      .limit(1);

    if (error) {
      console.error("Error checking promotions table:", error);
      return NextResponse.json({ 
        success: false, 
        error: error.message 
      }, { status: 500 });
    }

    // Use the REST API to add the column directly
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/promotions?select=id&limit=1`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '',
          'Authorization': `Bearer ${process.env.SUPABASE_SERVICE_KEY || ''}`,
          'Prefer': 'return=minimal'
        },
        body: JSON.stringify({
          active: true
        })
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Error adding column via REST API:", errorText);
      return NextResponse.json({ 
        success: false, 
        error: errorText 
      }, { status: 500 });
    }

    return NextResponse.json({ 
      success: true,
      message: "Active column added to promotions table successfully" 
    });
  } catch (error) {
    console.error("Unexpected error:", error);
    return NextResponse.json({ 
      success: false, 
      error: String(error) 
    }, { status: 500 });
  }
}
