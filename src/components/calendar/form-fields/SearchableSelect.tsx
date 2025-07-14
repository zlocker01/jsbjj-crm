"use client";

import * as React from "react";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import type { Control } from "react-hook-form";

interface SearchableSelectProps {
  control: Control<any>;
  name: string;
  label: string;
  placeholder: string;
  notFoundMessage?: string;
  options: { value: string; label: string }[];
  icon?: React.ReactNode;
  onValueChange?: (value: string, onChange: (...event: any[]) => void) => void;
}

export function SearchableSelect({
  control,
  name,
  label,
  placeholder,
  notFoundMessage = "No se encontraron resultados.",
  options,
  icon,
  onValueChange,
}: SearchableSelectProps) {
  const [open, setOpen] = React.useState(false);

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <FormControl>
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={open}
                  className={cn(
                    "w-full justify-between font-normal",
                    "hover:bg-background hover:text-foreground",
                    !field.value && "text-muted-foreground"
                  )}
                >
                  <div className="flex items-center">
                    {icon}
                    {field.value
                      ? options.find(
                          (option) => option.value === field.value.toString()
                        )?.label
                      : placeholder}
                  </div>
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </FormControl>
            </PopoverTrigger>
            <PopoverContent className="w-full p-0 bg-gray-100 dark:bg-zinc-900" style={{ minWidth: 'var(--radix-popover-trigger-width)', maxWidth: '95vw' }}>
              <Command className="max-h-[300px] overflow-hidden">
                <CommandInput placeholder="Buscar..." />
                <CommandEmpty>{notFoundMessage}</CommandEmpty>
                <CommandGroup className="max-h-[200px] overflow-y-auto overflow-x-hidden" style={{ touchAction: 'pan-y', WebkitOverflowScrolling: 'touch' }}>
                  {options.map((option) => (
                    <CommandItem
                      value={option.label}
                      key={option.value}
                      className="aria-selected:bg-goldHover aria-selected:text-primary-foreground"
                      onSelect={() => {
                        if (onValueChange) {
                          onValueChange(option.value, field.onChange);
                        } else {
                          field.onChange(option.value);
                        }
                        setOpen(false);
                      }}
                    >
                      <Check
                        className={cn(
                          "mr-2 h-4 w-4",
                          option.value === field.value?.toString()
                            ? "opacity-100"
                            : "opacity-0"
                        )}
                      />
                      {option.label}
                    </CommandItem>
                  ))}
                </CommandGroup>
              </Command>
            </PopoverContent>
          </Popover>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
