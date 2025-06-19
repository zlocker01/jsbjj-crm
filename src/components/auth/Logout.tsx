"use client";

import { createClient } from "@/utils/supabase/client";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";

export const Logout = () => {
  const router = useRouter();

  const supabase = createClient();
  async function signOut() {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error(error);
    } else {
      router.push("/");
    }
  }
  return (
    <Button onClick={signOut} className="my-20">
      Cerrar Sesión
    </Button>
  );
};
