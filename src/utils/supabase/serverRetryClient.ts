"use server";

import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export async function createRetryServerClient() {
  const cookieStore = await cookies();

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name) {
          return cookieStore.get(name)?.value;
        },
        set(name, value, options) {
          try {
            // Only attempt to set cookies if we're in a server context
            if (typeof window === 'undefined') {
              cookieStore.set(name, value, options);
            }
          } catch (e) {
            console.error("Error setting cookie:", e);
            // Silent fail for cases where we're not in a proper server action context
          }
        },
        remove(name, options) {
          try {
            // Only attempt to set cookies if we're in a server context
            if (typeof window === 'undefined') {
              cookieStore.set(name, '', { ...options, maxAge: 0 });
            }
          } catch (e) {
            console.error("Error removing cookie:", e);
            // Silent fail for cases where we're not in a proper server action context
          }
        }
      }
    }
  );

  return supabase;
}