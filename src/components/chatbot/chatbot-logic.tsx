"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Plus, Trash } from "lucide-react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  chatbotRuleSchema,
  type ChatbotRuleFormValues,
} from "@/schemas/chatbotSchemas/chatbotRuleSchema";
import type { ChatbotRule } from "@/interfaces/chatbot/ChatbotRule";

export function ChatbotLogic() {
  const { toast } = useToast();
  const [rules, setRules] = useState<ChatbotRule[]>([]);
  const [loading, setLoading] = useState(true);

  const form = useForm<ChatbotRuleFormValues>({
    resolver: zodResolver(chatbotRuleSchema),
    defaultValues: {
      trigger: "",
      response: "",
    },
  });

  // Cargar reglas al montar el componente
  useEffect(() => {
    async function fetchRules() {
      setLoading(true);
      try {
        const res = await fetch("/api/chatbot/rules");
        if (!res.ok) {
          throw new Error("Error al obtener las reglas");
        }
        const data = await res.json();
        setRules(data || []);
      } catch (error) {
        toast({
          title: "Error",
          description: "No se pudieron cargar las reglas.",
          variant: "destructive",
        });
        setRules([]); // Ensure rules is an array in case of error
      }
      setLoading(false);
    }
    fetchRules();
  }, [toast]);

  const handleAddRule = async (data: ChatbotRuleFormValues) => {
    try {
      const res = await fetch("/api/chatbot/rules", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        throw new Error("Error al añadir la regla");
      }
      const newRule = await res.json();
      setRules((prevRules) => [...prevRules, newRule]);
      form.reset();
      toast({
        title: "Regla añadida",
        description: "La regla ha sido añadida correctamente.",
        variant: "success",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo añadir la regla. Intenta nuevamente.",
        variant: "destructive",
      });
    }
  };

  const handleDeleteRule = async (id: string) => {
    try {
      const res = await fetch(`/api/chatbot/rules/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        throw new Error("Error al eliminar la regla");
      }
      setRules((prevRules) => prevRules.filter((rule) => rule.id !== id));
      toast({
        title: "Regla eliminada",
        description: "La regla ha sido eliminada correctamente.",
        variant: "success",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo eliminar la regla. Intenta nuevamente.",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return <div>Cargando reglas...</div>;
  }

  return (
    <div className="space-y-6">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleAddRule)} className="space-y-4">
          <FormField
            control={form.control}
            name="trigger"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Palabra o Frase Clave</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Ej: reservar cita, horarios, precios"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="response"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Respuesta del Chatbot</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Respuesta que dará el chatbot cuando detecte la palabra clave"
                    className="min-h-[100px]"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" className="w-full">
            <Plus className="mr-2 h-4 w-4" /> Añadir Regla
          </Button>
        </form>
      </Form>

      <div>
        <h3 className="text-lg font-medium mb-2">Reglas Configuradas</h3>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Palabra Clave</TableHead>
              <TableHead>Respuesta</TableHead>
              <TableHead className="w-[80px]">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rules.map((rule, idx) => (
              <TableRow key={rule.id ? `${rule.id}-${idx}` : `idx-${idx}`}>
                <TableCell className="font-medium">{rule.trigger}</TableCell>
                <TableCell className="max-w-[300px] truncate">
                  {rule.response}
                </TableCell>
                <TableCell>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDeleteRule(rule.id)}
                  >
                    <Trash className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
            {rules.length === 0 && !loading && (
              <TableRow>
                <TableCell
                  colSpan={3}
                  className="text-center py-4 text-muted-foreground"
                >
                  No hay reglas configuradas
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
