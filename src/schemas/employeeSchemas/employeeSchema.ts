import { z } from "zod";

export const employeeFormSchema = z.object({
  name: z
    .string()
    .min(2, "El nombre debe tener al menos 2 caracteres")
    .max(100, "El nombre no puede tener más de 100 caracteres"),
  position: z
    .string()
    .min(3, "El cargo debe tener al menos 3 caracteres")
    .max(100, "El cargo no puede tener más de 100 caracteres"),
  experience: z
    .string()
    .max(500, "La experiencia no puede tener más de 500 caracteres"),
  skills: z.array(z.string()),
  image: z
    .string()
    .url("La URL de la imagen no es válida")
    .startsWith("http", {
      message: "La URL debe comenzar con http:// o https://",
    })
    .optional()
    .or(z.literal("")),
});

export type EmployeeFormData = z.infer<typeof employeeFormSchema>;
