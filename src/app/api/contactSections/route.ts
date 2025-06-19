import { getContactSections } from "@/data/contactSections/getContactSections";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const landingId = searchParams.get("landingId");

  if (!landingId) {
    return NextResponse.json(
      { error: "landingId is required" },
      { status: 400 },
    );
  }

  const contactSections = await getContactSections(landingId);
  return NextResponse.json(contactSections);
}
