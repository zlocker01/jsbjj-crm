import { NextResponse, type NextRequest } from "next/server";
import { updateSession } from "@/utils/supabase/middleware";

export async function middleware(request: NextRequest) {
  const sessionResponse = await updateSession(request);

  // 4. Check if validatePlan decided to redirect (e.g., to /precios)
  // THIS CHECK IS CRITICAL:
  // const isPlanRedirect =
  //   (planValidationResponse.status >= 300 &&
  //     planValidationResponse.status < 400) ||
  //   planValidationResponse.headers.has("Location");


  if (sessionResponse !== NextResponse.next()) {
    return sessionResponse;
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
   '/private/:path*',
  ],
};
