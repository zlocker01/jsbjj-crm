export const dynamic = 'force-dynamic';

import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { getChatbotRules } from "@/data/chatbot/getChatbotRules";
import { updateChatbotRule } from "@/data/chatbot/updateChatbotRule";

export async function GET() {
  const rules = await getChatbotRules();
  return NextResponse.json(rules);
}

export async function POST(request: NextRequest) {
  const data = await request.json();
  const error = await updateChatbotRule(data);
  if (error) {
    return NextResponse.json(
      { error: "No se pudo crear la regla." },
      { status: 500 },
    );
  }
  return NextResponse.json(data);
}
