import { z } from "zod";

export const appointmentSchema = z.object({
  client_id: z.string().min(1, "El cliente es requerido"),
  service_id: z
    .number()
    .nullable()
    .transform((val) => (val === undefined ? null : val)),
  promotion_id: z
    .number()
    .nullable()
    .transform((val) => (val === undefined ? null : val)),
  start_datetime: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: "La fecha de inicio debe ser una fecha válida",
  }),
  end_datetime: z
    .string()
    .refine((val) => !val || !isNaN(Date.parse(val)), {
      message: "La fecha de fin debe ser una fecha válida",
    })
    .optional(),
  status: z.string().optional(),
  notes: z
    .string()
    .max(500, "Las notas no pueden tener más de 500 caracteres")
    .optional()
    .or(z.literal("")),
});

export type AppointmentFormValues = z.infer<typeof appointmentSchema>;
