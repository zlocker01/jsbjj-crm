import { NextResponse } from "next/server";
import { getSchedules } from "@/data/schedule/getSchedules";

export async function GET() {
  const schedules = await getSchedules();

  if (!schedules) {
    return NextResponse.json(
      { error: "No se pudieron obtener los horarios." },
      { status: 500 },
    );
  }

  return NextResponse.json({ schedules });
}
