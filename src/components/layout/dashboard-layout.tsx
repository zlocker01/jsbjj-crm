"use client";

import type React from "react";
import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Calendar,
  CameraIcon,
  Clock,
  LayoutDashboard,
  Menu,
  MessageSquare,
  Pencil,
  Tag,
  User,
  Users,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetHeader,
} from "@/components/ui/sheet";
import { ThemeToggle } from "@/components/theme-toggle";
import { useMediaQuery } from "@/hooks/use-media-query";

export function DashboardLayout({
  children,
  landingId,
}: {
  children: React.ReactNode;
  landingId: string;
}) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const isMobile = useMediaQuery("(max-width: 768px)");

  const routes = [
    // {
    //   title: 'Dashboard',
    //   href: '/session/dashboard',
    //   icon: LayoutDashboard,
    // },
    {
      title: "Editor de Landing",
      href: "/session/landing-editor",
      icon: Pencil,
    },
    {
      title: "Personal",
      href: "/session/employees",
      icon: Users,
    },
    {
      title: "Galeria de Imagenes",
      href: "/session/images-gallery",
      icon: CameraIcon,
    },
    {
      title: "Gestión de Horarios",
      href: "/session/schedule",
      icon: Clock,
    },
    {
      title: "Servicios y Promos",
      href: "/session/services",
      icon: Tag,
    },
    {
      title: "Calendario de Citas",
      href: `/session/calendar/${landingId}`,
      icon: Calendar,
    },
    {
      title: "Clientes",
      href: "/session/clients",
      icon: Users,
    },
    // {
    //   title: "Chatbot",
    //   href: "/session/chatbot",
    //   icon: MessageSquare,
    // },
    {
      title: "Perfil",
      href: "/session/profile",
      icon: User,
    },
  ];

  // Cerrar el menú móvil cuando cambia el tamaño de la pantalla
  useEffect(() => {
    if (!isMobile) {
      setOpen(false);
    }
  }, [isMobile]);

  // Cerrar el menú móvil cuando cambia la ruta
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  return (
    <div className="flex min-h-screen flex-col md:flex-row bg-background text-foreground transition-colors duration-300">
      {/* Desktop Sidebar */}
      <div className="hidden w-64 flex-col border-r bg-card md:flex">
        <div className="flex h-14 items-center border-b px-4">
          <Link
            href="/dashboard"
            className="flex items-center gap-2 font-semibold justify-center"
          >
            <img
              src="/landing-page/logo.png"
              alt="estetica y barberia en Tlaxcala"
              className="max-h-20"
            />
          </Link>
        </div>
        <div className="flex-1 overflow-auto py-2">
          <nav className="grid gap-1 px-2">
            {routes.map((route) => (
              <Button
                key={route.href}
                variant={pathname === route.href ? "secondary" : "ghost"}
                className={cn(
                  "justify-start gap-2",
                  pathname === route.href && "font-medium",
                )}
                asChild
              >
                <Link href={route.href}>
                  <route.icon className="h-5 w-5" />
                  {route.title}
                </Link>
              </Button>
            ))}
          </nav>
        </div>
        <div className="border-t p-4">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
              <Users className="h-4 w-4 text-primary" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium">La Rochelle</p>
              <p className="text-xs text-muted-foreground">Administrador</p>
            </div>
            <ThemeToggle />
          </div>
        </div>
      </div>

      {/* Mobile Sidebar */}
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent side="left" className="p-0 w-[80%] max-w-[300px]">
          <SheetHeader className="border-b px-4 py-3">
            <SheetTitle className="flex items-center gap-2">
              <Link
                href="/dashboard"
                className="flex items-center gap-2 font-semibold"
              >
                <img
                  src="/landing-page/logo.png"
                  alt="estetica y barberia en Tlaxcala"
                  className="max-h-20"
                />
              </Link>
              <Button
                variant="ghost"
                size="icon"
                className="ml-auto"
                onClick={() => setOpen(false)}
              >
                <X className="h-5 w-5" />
              </Button>
            </SheetTitle>
          </SheetHeader>
          <div className="flex-1 overflow-auto">
            <div className="flex flex-col gap-1 p-2">
              {routes.map((route) => (
                <Button
                  key={route.href}
                  variant={pathname === route.href ? "secondary" : "ghost"}
                  className={cn(
                    "justify-start gap-2",
                    pathname === route.href && "font-medium",
                  )}
                  asChild
                  onClick={() => setOpen(false)}
                >
                  <Link href={route.href}>
                    <route.icon className="h-5 w-5" />
                    {route.title}
                  </Link>
                </Button>
              ))}
            </div>
          </div>
          <div className="border-t p-4">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                <Users className="h-4 w-4 text-primary" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium">La Rochelle</p>
                <p className="text-xs text-muted-foreground">Administrador</p>
              </div>
              <ThemeToggle />
            </div>
          </div>
        </SheetContent>
      </Sheet>

      {/* Main Content */}
      <div className="flex flex-1 flex-col">
        <header className="sticky top-0 z-10 flex h-14 items-center gap-4 border-b bg-card px-4 md:px-6">
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setOpen(true)}
          >
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle Menu</span>
          </Button>
          <div className="ml-auto flex items-center gap-2">
            <ThemeToggle />
          </div>
        </header>
        <main className="flex-1 p-4 md:p-6 overflow-x-hidden">{children}</main>
      </div>
    </div>
  );
}
