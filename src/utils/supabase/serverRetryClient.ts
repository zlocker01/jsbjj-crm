import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { cookies } from "next/headers";

// Configuración para forzar el modo dinámico y evitar errores de generación estática
export const dynamic = 'force-dynamic';

// Configuración para el mecanismo de reintento
const MAX_RETRIES = 3;
const INITIAL_BACKOFF_MS = 1000; // 1 segundo

// Función para esperar un tiempo determinado
const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export async function createRetryServerClient() {
  const cookieStore = await cookies(); // await the cookies() Promise

  const client = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet: Array<{ name: string; value: string; options: CookieOptions }>) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options),
            );
          } catch {
            // The `setAll` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing
            // user sessions.
          }
        },
      },
    },
  );

  // Envolvemos los métodos que necesitan reintento
  const originalAuthGetUser = client.auth.getUser.bind(client.auth);

  // Sobrescribimos el método getUser con capacidad de reintento
  client.auth.getUser = async () => {
    let retries = 0;
    let lastError: any;

    while (retries < MAX_RETRIES) {
      try {
        const result = await originalAuthGetUser();
        return result;
      } catch (error: any) {
        lastError = error;

        // Si es un error de límite de tasa, reintentamos
        if (error?.code === "over_request_rate_limit") {
          retries++;
          const backoffTime = INITIAL_BACKOFF_MS * Math.pow(2, retries - 1);
          console.log(
            `Reintentando después de ${backoffTime}ms (intento ${retries}/${MAX_RETRIES})`,
          );
          await sleep(backoffTime);
        } else {
          // Si es otro tipo de error, lo lanzamos inmediatamente
          throw error;
        }
      }
    }

    // Si llegamos aquí, hemos agotado los reintentos
    throw lastError;
  };

  return client;
}