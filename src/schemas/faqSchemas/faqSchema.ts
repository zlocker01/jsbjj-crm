import * as z from "zod";

export const faqItemSchema = z.object({
  question: z.string().min(1, "La pregunta es requerida"),
  answer: z.string().min(1, "La respuesta es requerida"),
  user_id: z.string(),
  landing_page_id: z.string(),
});

export const faqSchema = z.object({
  items: z.array(faqItemSchema),
});
