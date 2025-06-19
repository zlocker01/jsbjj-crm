import { createBrowserClient } from "@supabase/ssr";

// Configuración para el mecanismo de reintento
const MAX_RETRIES = 3;
const INITIAL_BACKOFF_MS = 1000; // 1 segundo

// Función para esperar un tiempo determinado
const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// Función para crear un cliente con capacidad de reintento
export function createRetryClient() {
  const client = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );

  // Envolvemos los métodos que necesitan reintento
  const originalAuthGetUser = client.auth.getUser.bind(client.auth);

  // Sobrescribimos el método getUser con capacidad de reintento
  client.auth.getUser = async () => {
    let retries = 0;
    let lastError;

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
