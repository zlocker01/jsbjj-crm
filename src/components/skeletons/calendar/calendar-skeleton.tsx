import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

export function CalendarSkeleton() {
  return (
    <div className="container mx-auto p-4">
      {/* Header Estático (Real) */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div className="flex flex-col gap-2 w-full max-w-md">
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
            Horario de Clases
          </h1>
          <p className="text-muted-foreground">
            Administra tus clases en tiempo real desde aquí
          </p>
          <p className="text-goldAccent font-bold">
            {format(new Date(), "EEEE d 'de' MMMM 'de' yyyy, hh:mm a", {
              locale: es,
            })}
          </p>
        </div>
        <Button className="w-full md:w-auto bg-black text-white hover:bg-gray-800 pointer-events-none opacity-50">
          <Plus className="mr-2 h-4 w-4" /> Nueva Clase
        </Button>
      </div>

      {/* Main Content Grid Skeleton */}
      <div className="w-full grid grid-cols-1 lg:grid-cols-10 gap-4">
        {/* Calendar Area (7 cols) */}
        <div className="col-span-1 lg:col-span-7 space-y-4">
          {/* View Toggle Buttons */}
          <div className="flex gap-2">
            <Skeleton className="h-10 w-16" />
            <Skeleton className="h-10 w-16" />
            <Skeleton className="h-10 w-16" />
          </div>
          {/* Calendar Header (Month Nav) */}
          <div className="flex justify-between items-center mb-4">
            <Skeleton className="h-10 w-10 rounded-full" />
            <Skeleton className="h-6 w-32" />
            <Skeleton className="h-10 w-10 rounded-full" />
          </div>
          {/* Calendar Grid Skeleton */}
          <div className="border rounded-lg overflow-hidden">
            {/* Weekday headers */}
            <div className="grid grid-cols-7 gap-1 p-2 bg-muted/20">
              {Array.from({ length: 7 }).map((_, i) => (
                <div key={i} className="flex justify-center">
                  <Skeleton className="h-4 w-8" />
                </div>
              ))}
            </div>
            {/* Days grid */}
            <div className="grid grid-cols-7 gap-1 p-2">
              {Array.from({ length: 35 }).map(
                (
                  _,
                  i, // 5 rows x 7 cols
                ) => (
                  <div
                    key={i}
                    className="min-h-[100px] border rounded-md p-2 space-y-2"
                  >
                    <div className="flex justify-end">
                      <Skeleton className="h-6 w-6 rounded-full" />
                    </div>
                    {/* Random appointment skeletons */}
                    {i % 3 === 0 && <Skeleton className="h-4 w-full rounded" />}
                    {i % 7 === 0 && <Skeleton className="h-4 w-3/4 rounded" />}
                  </div>
                ),
              )}
            </div>
          </div>
        </div>
        {/* Details Panel (3 cols) */}
        <div className="col-span-1 lg:col-span-3">
          <div className="border rounded-lg p-4 space-y-4 h-[400px]">
            <div className="flex justify-between items-center">
              <Skeleton className="h-6 w-32" />
              <Skeleton className="h-8 w-8 rounded-full" />
            </div>
            <div className="space-y-4 pt-4">
              <div className="flex items-center space-x-2">
                <Skeleton className="h-10 w-10 rounded-full" />
                <div className="space-y-1">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-3 w-32" />
                </div>
              </div>
              <Skeleton className="h-20 w-full rounded-md" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-16" />
                <Skeleton className="h-6 w-20 rounded-full" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
