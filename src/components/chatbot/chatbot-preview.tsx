"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Send } from "lucide-react";

export function ChatbotPreview() {
  const [messages, setMessages] = useState([
    {
      role: "bot",
      content:
        "¡Hola! Soy el asistente virtual de Mi Negocio. ¿En qué puedo ayudarte hoy?",
    },
  ]);
  const [input, setInput] = useState("");

  const handleSend = () => {
    if (!input.trim()) {
      return;
    }

    // Añadir mensaje del usuario
    setMessages([
      ...messages,
      {
        role: "user",
        content: input,
      },
    ]);

    // Simular respuesta del bot
    setTimeout(() => {
      let response =
        "Gracias por tu mensaje. Un representante te responderá pronto.";

      // Respuestas simples basadas en palabras clave
      if (
        input.toLowerCase().includes("hola") ||
        input.toLowerCase().includes("saludos")
      ) {
        response = "¡Hola! ¿En qué puedo ayudarte hoy?";
      } else if (
        input.toLowerCase().includes("hora") ||
        input.toLowerCase().includes("horario")
      ) {
        response =
          "Nuestro horario es de Lunes a Viernes de 9:00 a 18:00 y Sábados de 10:00 a 15:00.";
      } else if (
        input.toLowerCase().includes("precio") ||
        input.toLowerCase().includes("costo")
      ) {
        response =
          "Nuestros precios varían según el servicio. ¿Sobre qué servicio específico te gustaría información?";
      } else if (
        input.toLowerCase().includes("cita") ||
        input.toLowerCase().includes("reserva")
      ) {
        response =
          "Para reservar una cita, por favor indícame qué servicio te interesa y cuándo te gustaría venir.";
      }

      setMessages((prev) => [
        ...prev,
        {
          role: "bot",
          content: response,
        },
      ]);
    }, 1000);

    setInput("");
  };

  return (
    <div className="border rounded-lg overflow-hidden flex flex-col h-[500px] dark:border-gray-700">
      <div className="bg-primary p-3 text-primary-foreground">
        <h3 className="font-medium">Chat con Mi Negocio</h3>
      </div>

      <ScrollArea className="flex-1 p-3">
        <div className="space-y-4">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`flex gap-2 max-w-[80%] ${message.role === "user" ? "flex-row-reverse" : ""}`}
              >
                {message.role === "bot" && (
                  <Avatar className="h-8 w-8">
                    <AvatarImage
                      src="/placeholder.svg?height=32&width=32"
                      alt="Bot"
                    />
                    <AvatarFallback>B</AvatarFallback>
                  </Avatar>
                )}
                <div
                  className={`rounded-lg p-3 ${
                    message.role === "user"
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted"
                  }`}
                >
                  {message.content}
                </div>
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>

      <div className="border-t p-3 flex gap-2 dark:border-gray-700">
        <Input
          placeholder="Escribe un mensaje..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleSend();
            }
          }}
          className="flex-1"
        />
        <Button size="icon" onClick={handleSend}>
          <Send className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
