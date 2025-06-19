import { z } from "zod";

export const chatbotRuleSchema = z.object({
  trigger: z.string().min(1, { message: "La palabra clave es obligatoria" }),
  response: z.string().min(1, { message: "La respuesta es obligatoria" }),
});

export type ChatbotRuleFormValues = z.infer<typeof chatbotRuleSchema>;
