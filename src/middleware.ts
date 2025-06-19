import { NextResponse, type NextRequest } from "next/server";
import { updateSession } from "@/utils/supabase/middleware";
// import { validatePlan } from "@/utils/stripe/middleware";

export async function middleware(request: NextRequest) {
  const sessionResponse = await updateSession(request);

  // const planValidationResponse = await validatePlan(request);

  // 4. Check if validatePlan decided to redirect (e.g., to /precios)
  // THIS CHECK IS CRITICAL:
  // const isPlanRedirect =
  //   (planValidationResponse.status >= 300 &&
  //     planValidationResponse.status < 400) ||
  //   planValidationResponse.headers.has("Location");

  // if (isPlanRedirect) {
  //   return planValidationResponse;
  // }

  if (sessionResponse !== NextResponse.next()) {
    return sessionResponse;
  }

  // if (planValidationResponse !== NextResponse.next()) {
  //   return planValidationResponse;
  // }

  return NextResponse.next();
}

export const config = {
  matcher: [
    // '/profile/:path*',
    // '/dashboard/:path*',
  ],
};
