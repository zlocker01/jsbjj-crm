import * as z from "zod";

export const newsLetterFormSchema = z.object({
  email: z.string().email({
    message: "Por favor ingresa un correo electrónico válido",
  }),
});