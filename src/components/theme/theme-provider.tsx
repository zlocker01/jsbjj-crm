"use client";

import * as React from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";
// Try importing the type directly from 'next-themes' or check installation
import type { ThemeProviderProps } from "next-themes";

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>;
}
