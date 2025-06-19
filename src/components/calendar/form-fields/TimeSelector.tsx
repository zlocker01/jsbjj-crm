"use client";

import type { Control } from "react-hook-form";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { format, isValid } from "date-fns";
import type { AppointmentFormValues } from "@/schemas/appointmentSchemas/appointmentSchema";

interface DateTimeSelectorProps {
  control: Control<AppointmentFormValues>;
  disabled?: boolean;
}

export function DateTimeSelector({
  control,
  disabled = false,
}: DateTimeSelectorProps) {
  return (
    <FormField
      control={control}
      name="start_datetime"
      render={({ field }) => {
        const currentValue = field.value;
        const value =
          currentValue && isValid(new Date(currentValue))
            ? format(new Date(currentValue), "yyyy-MM-dd'T'HH:mm")
            : "";

        return (
          <FormItem>
            <FormLabel>Fecha y hora de inicio</FormLabel>
            <FormControl>
              <Input
                type="datetime-local"
                value={value}
                onChange={(e) => {
                  const localDatetime = e.target.value;
                  if (localDatetime) {
                    const date = new Date(localDatetime);
                    field.onChange(date.toISOString()); // Almacenar como ISO string (UTC)
                  } else {
                    field.onChange("");
                  }
                }}
                disabled={disabled}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        );
      }}
    />
  );
}
