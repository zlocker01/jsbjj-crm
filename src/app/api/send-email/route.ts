import { generateContactEmailHtml } from "@/utils/resend/emailContactFromTemplate";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { nombre, email, asunto, mensaje } = await req.json();

  try {
    const data = await generateContactEmailHtml({
      nombre,
      email,
      asunto,
      mensaje,
    });

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error("Error sending email:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { success: false, error: errorMessage },
      { status: 500 },
    );
  }
}
