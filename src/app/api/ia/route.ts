import { runAI } from "@/utils/ai/runAI";
import { createClient } from "@/utils/supabase/server"; // Use server client for user-specific actions
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    // Extraer prompt y provider al inicio para que estén disponibles en todo el ámbito
    const {
      prompt,
      provider,
    }: { prompt: string; provider?: "google" | "openai" } = await req.json();

    if (!prompt) {
      return NextResponse.json(
        { error: "El prompt es obligatorio" },
        { status: 400 },
      );
    }

    const supabase = await createClient(); // Server client to get user session

    // 1. Get Authenticated User
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // 2. Get User's Generation Limit from 'usuarios' table
    const { data: userData, error: userFetchError } = await supabase
      .from("usuarios") // Fetch from usuarios table
      .select("generations_remaining")
      .eq("user_id", user.id) // Cambiado de 'id' a 'user_id'
      .single();

    if (userFetchError) {
      console.error(`Error fetching user data for ${user.id}:`, userFetchError);

      // Si el error es que no hay filas, podemos usar valores predeterminados
      if (userFetchError.code === "PGRST116") {
        console.log(
          "Usuario no encontrado en la tabla usuarios, usando valores por defecto",
        );
        // Continuar con el proceso usando un valor predeterminado para generationsRemaining
        return NextResponse.json(
          {
            result: await runAI([{ role: "user", content: prompt }], provider),
          },
          { status: 200 },
        );
      }

      return NextResponse.json(
        { error: "Error fetching user profile." },
        { status: 500 },
      );
    }

    if (!userData) {
      console.error(`User profile not found in usuarios table for ${user.id}`);
      return NextResponse.json(
        { error: "User profile not found." },
        { status: 404 },
      );
    }

    const generationsRemaining = userData.generations_remaining;

    // 3. Check Limit (null or -1 could mean unlimited)
    // Treat null as potentially unlimited, 0 means limit reached
    if (generationsRemaining === 0) {
      console.log(
        `User ${user.id} attempted generation with 0 credits remaining.`,
      );
      return NextResponse.json(
        { error: "Has alcanzado tu límite de generaciones." },
        { status: 402 },
      ); // 402 Payment Required
    }

    // 4. Generate Document (Call the actual AI service)
    const result = await runAI([{ role: "user", content: prompt }], provider);

    // 5. Decrement Count (if successful and limit is not null/-1)
    if (generationsRemaining !== null && generationsRemaining !== -1) {
      // Use supabase client again as it's a user-specific update
      const { error: decrementError } = await supabase
        .from("usuarios")
        .update({ generations_remaining: generationsRemaining - 1 })
        .eq("user_id", user.id); // Cambiado de 'id' a 'user_id'

      if (decrementError) {
        // Log error but still return result to user
        console.error(
          `Failed to decrement generation count for user ${user.id}:`,
          decrementError,
        );
        // Decide if this is critical. Usually, you still give the user the result.
      } else {
        console.log(
          `Decremented generation count for user ${user.id}. New count: ${generationsRemaining - 1}`,
        );
      }
    } else {
      console.log(
        `User ${user.id} has unlimited generations. Count not decremented.`,
      );
    }

    // 6. Return Result
    return NextResponse.json({ result });
  } catch (error: any) {
    console.error(`Error during AI generation:`, error.message);
    return NextResponse.json(
      {
        error:
          error.message || "Error interno del servidor al generar documento",
      },
      { status: 500 },
    );
  }
}
