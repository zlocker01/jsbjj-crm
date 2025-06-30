"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export default function CookiesModal() {
  const [isClient, setIsClient] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setIsClient(true);
    const hasConsent = localStorage.getItem('cookieConsent');
    if (!hasConsent) {
      setOpen(true);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('cookieConsent', 'true');
    setOpen(false);
  };

  if (!isClient) return null;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Uso de cookies</DialogTitle>
          <DialogDescription>
            Utilizamos cookies esenciales para que nuestro sitio funcione correctamente. 
            Al hacer clic en "Aceptar", aceptas el uso de estas cookies según nuestra 
            <a href="/politica-de-cookies" className="text-primary underline ml-1">
              Política de Cookies
            </a>.
          </DialogDescription>
        </DialogHeader>
        <div className="flex gap-2 justify-end">
          <Button variant="outline" onClick={() => setOpen(false)}>
            Rechazar
          </Button>
          <Button onClick={handleAccept}>
            Aceptar
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}