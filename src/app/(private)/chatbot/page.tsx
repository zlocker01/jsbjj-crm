"use client";

export const dynamic = 'force-dynamic';

import { useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";
import { Power, PowerOff } from "lucide-react";

export default function ChatbotPage() {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("context");
  const [qrVisible, setQrVisible] = useState(false);
  const [chatbotEnabled, setChatbotEnabled] = useState(false);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
          Configuración del Chatbot
        </h1>
        <p className="text-muted-foreground">
          El Chatbot toma el contexto de la seccion del Editor de Landing Page
        </p>
      </div>

      <div className="gap-4">
        <div className="order-1 lg:order-2">
          <Card className="h-full">
            <CardHeader>
              <CardTitle>Vista Previa y QR</CardTitle>
              <CardDescription>
                Previsualiza tu chatbot y escanea el código QR en WhatsApp para
                instalarlo
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center gap-4">
              <Button
                variant={chatbotEnabled ? "default" : "outline"}
                onClick={() => setChatbotEnabled(!chatbotEnabled)}
                className="w-full"
              >
                {chatbotEnabled ? (
                  <Power className="mr-2 h-4 w-4" />
                ) : (
                  <PowerOff className="mr-2 h-4 w-4" />
                )}
                {chatbotEnabled ? "Apagar Chatbot" : "Encender Chatbot"}
              </Button>
              {/* Mostrar QR */}
              <div className="flex flex-col items-center gap-4">
                <div className="border rounded-lg p-4 inline-block bg-white">
                  <Image
                    src="/placeholder.svg?height=200&width=200&text=QR+Code"
                    alt="QR Code"
                    width={200}
                    height={200}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
