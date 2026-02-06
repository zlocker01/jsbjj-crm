'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export function DashboardRefresher() {
  const router = useRouter();

  useEffect(() => {
    // Refrescar cada 30 segundos para mantener los datos actualizados
    const interval = setInterval(() => {
      router.refresh();
    }, 30000);

    // Refrescar cuando la ventana recupera el foco (ej. usuario vuelve de otra pestaña)
    const onFocus = () => {
      router.refresh();
    };

    window.addEventListener('focus', onFocus);

    return () => {
      clearInterval(interval);
      window.removeEventListener('focus', onFocus);
    };
  }, [router]);

  return null;
}
