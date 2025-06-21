import { createClient } from "@/utils/supabase/client";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";

/**
 * @description Asynchronous function to handle form submission sign up and login.
 *
 * @param {z.infer<typeof userFormSchema>} values - The values submitted in the form.
 * @return {void} This function does not return anything.
 */
export const OAuth = () => {
  const { toast } = useToast();

  async function onSubmit() {
    const supabase = await createClient();

    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        data: {
          role: "admin",
        },
        redirectTo: process.env.NEXT_PUBLIC_REDIRECT_URL!,
      } as any,
    });
    if (error || !data.url) {
      console.error("❌ error!!! -->", error);
      return toast({
        title: "¡Error inesperado!",
        description:
          "Ocurrió un error inesperado, por favor intenta nuevamente.",
        variant: "destructive",
      });
    } else {
      toast({
        title: "¡Listo!",
        description: "Conecta con tu cuenta de Facebook.",
        variant: "success",
      });
    }
  }

  return (
    <div className="w-100 my-8">
      <Button className="bg-red-500" size={"lg"} type="submit" onClick={onSubmit}>
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-google mr-2" viewBox="0 0 16 16">
          <path d="M15.545 6.558a9.4 9.4 0 0 1 .139 1.626c0 2.434-.87 4.492-2.384 5.885h.002C11.978 15.292 10.158 16 8 16A8 8 0 1 1 8 0a7.7 7.7 0 0 1 5.352 2.082l-2.284 2.284A4.35 4.35 0 0 0 8 3.166c-2.087 0-3.86 1.408-4.492 3.304a4.8 4.8 0 0 0 0 3.063h.003c.635 1.893 2.405 3.301 4.492 3.301 1.078 0 2.004-.276 2.722-.764h-.003a3.7 3.7 0 0 0 1.599-2.431H8v-3.08z" />
        </svg>
        Iniciar Sesión con Google
      </Button>
    </div>
  );
};
