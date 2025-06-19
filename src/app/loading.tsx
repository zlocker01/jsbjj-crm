"use client";

import { useEffect, useState } from "react";

export default function Loading() {
  const [progress, setProgress] = useState(0);

  // Puedes cambiar esta URL por la ruta a tu imagen
  const imageUrl = "/landing-page/logo.png";

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        // Incremento un poco más rápido para una experiencia más dinámica
        return prev + 2;
      });
    }, 50); // Un poco más lento para que la barra se vea progresar

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col justify-center items-center h-screen bg-gradient-to-br from-background to-muted/50 dark:from-foreground/5 dark:to-background">
      {/* Contenedor principal para la imagen y la barra de progreso */}
      <div className="relative w-80 h-80 flex items-center justify-center">
        <img
          src={imageUrl}
          alt="Cargando..."
          className="w-full h-full object-contain animate-pulse-fade"
        />
      </div>

      {/* Barra de progreso elegante debajo de la imagen */}
      <div className="w-64 max-w-xs">
        <div className="h-2 bg-muted-foreground/20 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-primary to-accent rounded-full transition-all duration-100 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
        <p className="text-center text-sm font-medium text-foreground mt-2">
          {progress}% completado
        </p>
      </div>

      {/* Loading text with fade effect */}
      <div className="mt-8 text-center">
        <h3 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent animate-pulse">
          Cargando contenido...
        </h3>
        <div className="flex justify-center mt-2 space-x-1">
          <div
            className="w-2 h-2 rounded-full bg-primary animate-bounce"
            style={{ animationDelay: "0ms" }}
          />
          <div
            className="w-2 h-2 rounded-full bg-accent animate-bounce"
            style={{ animationDelay: "150ms" }}
          />
          <div
            className="w-2 h-2 rounded-full bg-primary animate-bounce"
            style={{ animationDelay: "300ms" }}
          />
          <div
            className="w-2 h-2 rounded-full bg-accent animate-bounce"
            style={{ animationDelay: "450ms" }}
          />
        </div>
      </div>
    </div>
  );
}
