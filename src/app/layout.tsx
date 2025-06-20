import './globals.css';
import type { Metadata } from 'next';
import { Toaster } from '@/components/ui/toaster';
import { ThemeProvider } from '@/components/theme/theme-provider';
import { Poppins, Playfair_Display } from 'next/font/google';
import { cn } from '@/lib/utils';
import Header from '@/components/landing-page/header';
import Footer from '@/components/landing-page/footer';

const poppins = Poppins({
  weight: ['400', '500', '600'],
  subsets: ['latin'],
  variable: '--font-poppins',
  display: 'swap',
});

const playfairDisplay = Playfair_Display({
  weight: ['700', '800'],
  subsets: ['latin'],
  variable: '--font-playfair',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'La Rochelle - Estetica & Barberia',
  description: 'Servicios de estética y barberia profesional',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" suppressHydrationWarning>
      <head />
      <Header />
      <body
        suppressHydrationWarning
        className={cn(
          poppins.variable,
          playfairDisplay.variable,
          'min-h-screen bg-background antialiased font-sans'
        )}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
          <Toaster />
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
