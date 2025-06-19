import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { createClient } from "../supabase/server";

export async function validatePlan(request: NextRequest) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  const { data: suscripcion, error } = await supabase
    .from("suscripciones")
    .select("is_subscribed, status")
    .eq("user_id", user.id)
    .maybeSingle();

  if (error) {
    const url = request.nextUrl.clone();
    url.pathname = "/error";
    return NextResponse.redirect(url);
  }

  if (
    suscripcion?.is_subscribed === false ||
    suscripcion?.status === "inactive" ||
    !suscripcion
  ) {
    if (
      !request.nextUrl.pathname.startsWith("/precios") &&
      !request.nextUrl.pathname.startsWith("/perfil")
    ) {
      const url = request.nextUrl.clone();
      url.pathname = "/precios";
      console.log(
        `validatePlan: Redirecting unsubscribed/inactive user ${user?.id} from ${request.nextUrl.pathname} to /precios`,
      );
      return NextResponse.redirect(url);
    }
    // Log when allowing access to /planes or /perfil for unsubscribed/inactive user (Optional)
    // else {
    //   console.log(`validatePlan: Allowing unsubscribed/inactive user ${user?.id} access to ${request.nextUrl.pathname}`);
    // }
  }
  // Log when allowing access generally (Optional)
  // else {
  //   console.log(`validatePlan: Allowing subscribed user ${user?.id} access to ${request.nextUrl.pathname}`);
  // }

  return NextResponse.next();
}
