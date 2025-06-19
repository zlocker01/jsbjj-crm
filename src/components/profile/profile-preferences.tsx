"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/components/ui/use-toast";
import { useTheme } from "next-themes";
import { Bell, Moon, Settings } from "lucide-react";
import { Label } from "../ui/label";

export function ProfilePreferences() {
  const { toast } = useToast();
  const { theme, setTheme } = useTheme();
  const [notifications, setNotifications] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleToggleDarkMode = () => {
    const newTheme = theme === "dark" ? "light" : "dark";
    setTheme(newTheme);
    toast({
      title: `Modo ${newTheme === "dark" ? "oscuro" : "claro"} activado`,
      description: `Has cambiado al modo ${newTheme === "dark" ? "oscuro" : "claro"}.`,
    });
  };

  const handleToggleNotifications = (checked: boolean) => {
    setNotifications(checked);
    toast({
      title: `Notificaciones ${checked ? "activadas" : "desactivadas"}`,
      description: `Has ${checked ? "activado" : "desactivado"} las notificaciones.`,
      variant: checked ? "success" : "destructive",
    });
  };

  const handleResetPreferences = () => {
    // Restablecer preferencias a valores predeterminados
    setTheme("light");
    setNotifications(true);

    toast({
      title: "Preferencias restablecidas",
      description:
        "Tus preferencias han sido restablecidas a los valores predeterminados.",
      variant: "success",
    });
  };

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div className="space-y-1">
          <CardTitle className="flex items-center">
            <Settings className="mr-2 h-5 w-5 text-primary" />
            Preferencias
          </CardTitle>
          <CardDescription>
            Configura tus preferencias de usuario
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Moon className="h-5 w-5 text-muted-foreground" />
              <Label htmlFor="dark-mode">Modo Oscuro</Label>
            </div>
            {mounted && (
              <Switch
                id="dark-mode"
                checked={theme === "dark"}
                onCheckedChange={handleToggleDarkMode}
              />
            )}
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Bell className="h-5 w-5 text-muted-foreground" />
              <Label htmlFor="notifications">Notificaciones</Label>
            </div>
            <Switch
              id="notifications"
              checked={notifications}
              onCheckedChange={handleToggleNotifications}
            />
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button
          variant="outline"
          className="w-full"
          onClick={handleResetPreferences}
        >
          Restablecer Preferencias
        </Button>
      </CardFooter>
    </Card>
  );
}
