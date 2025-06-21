import { NextResponse } from "next/server";
import { sendJobApplicationEmail } from "@/utils/resend/jobApplicationEmailTemplate";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const message = formData.get("message") as string;
    const cv = formData.get("cv") as File;

    if (!name || !email || !cv) {
      return NextResponse.json(
        { success: false, error: "Faltan campos requeridos." },
        { status: 400 },
      );
    }

    // Convertir el archivo a un Buffer para adjuntarlo
    const buffer = Buffer.from(await cv.arrayBuffer());

    await sendJobApplicationEmail({
      name,
      email,
      message,
      attachment: {
        filename: cv.name,
        content: buffer,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error sending job application email:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { success: false, error: errorMessage },
      { status: 500 },
    );
  }
}
