import "./globals.css";
import type React from "react";
import type { Metadata } from "next";
import { ThemeProvider } from "@/components/theme-provider";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { ToastProvider } from "@/components/toast-provider";
import { getLandingId } from "@/data/getLandingId";

export const metadata: Metadata = {
  title: "Dashboard de Gestión",
  description: "Dashboard completo para la gestión de La Rochelle",
};

export default async function RootLayout({
  // You might consider renaming this function for clarity, e.g., PrivateAreaLayout
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const landingId = await getLandingId();
  if (!landingId) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-2xl font-bold">
          No se encontró el ID de la landing page
        </p>
      </div>
    );
  }
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="light"
      enableSystem
      disableTransitionOnChange={false}
    >
      <ToastProvider>
        <DashboardLayout landingId={landingId}>{children}</DashboardLayout>
      </ToastProvider>
    </ThemeProvider>
  );
}
