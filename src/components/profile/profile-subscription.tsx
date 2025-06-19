"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";
import { CreditCard, CheckCircle } from "lucide-react";

export function ProfileSubscription() {
  const { toast } = useToast();

  const handleManageSubscription = () => {
    toast({
      title: "Gestionar suscripción",
      description: "Redirigiendo al portal de gestión de suscripciones...",
    });
    // Aquí iría la lógica real para redirigir al portal de suscripciones
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div className="space-y-1">
          <CardTitle className="flex items-center">
            <CreditCard className="mr-2 h-5 w-5 text-primary" />
            Suscripción
          </CardTitle>
          <CardDescription>Detalles de tu plan actual</CardDescription>
        </div>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-muted-foreground">
                Estado:
              </span>
              <Badge
                variant="outline"
                className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100"
              >
                <CheckCircle className="mr-1 h-3 w-3" /> Activo
              </Badge>
            </div>
            <div className="flex justify-between">
              <span className="text-sm font-medium text-muted-foreground">
                Plan:
              </span>
              <span className="text-sm font-medium">Pro - $25/mes</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm font-medium text-muted-foreground">
                Expira:
              </span>
              <span className="text-sm font-medium">20 Oct 2024</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm font-medium text-muted-foreground">
                Método de pago:
              </span>
              <span className="text-sm font-medium">•••• •••• •••• 4242</span>
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button className="w-full" onClick={handleManageSubscription}>
          Gestionar Suscripción
        </Button>
      </CardFooter>
    </Card>
  );
}
