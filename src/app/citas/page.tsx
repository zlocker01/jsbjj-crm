import React from 'react';
import Booking from '@/components/landing-page/booking';
import Header from '@/components/landing-page/header';
import Footer from '@/components/landing-page/footer';
import { getLandingId } from '@/data/getLandingId';

export default async function CitasPage() {
  const landingId: string | null = await getLandingId();

  if (!landingId) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>No se encontró la configuración de la página.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow pt-24">
        <div className="container mx-auto px-4 my-6 -mb-10 flex justify-center">
          <img
            src="/landing-page/logo.png"
            alt="Logo Clínica"
            className="h-56 w-auto object-contain"
          />
        </div>
        <Booking landingId={landingId} />
      </main>
      <Footer />
    </div>
  );
}
