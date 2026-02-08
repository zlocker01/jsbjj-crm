'use client';

import { useState } from 'react';
import { Edit, Clock, Layers, Users, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { DeleteServiceButton } from './DeleteServiceButton';
import { EditServiceModal } from './EditServiceModal';
import type { Service } from '@/interfaces/services/Service';
import { toast } from '@/components/ui/use-toast';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import { LevelBadge } from './LevelBadge';

interface ServiceCardProps {
  service: Service;
  onServiceUpdated?: () => void;
}

export function ServiceCard({
  service,
  onServiceUpdated = () => {},
}: ServiceCardProps) {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const router = useRouter();

  const handleServiceDeleted = (deletedServiceId: number) => {
    toast({
      title: 'Clase eliminada',
      description: 'La clase ha sido eliminada correctamente.',
      variant: 'success',
    });
    router.refresh();
  };

  return (
    <Card className="w-full max-w-sm overflow-hidden transition-shadow hover:shadow-lg flex flex-col h-full">
      <div className="h-48 w-full overflow-hidden relative shrink-0">
        <img
          src={service.image || '/placeholder-service.jpg'}
          alt={service.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute top-2 right-2">
          <LevelBadge level={service.level} />
        </div>
      </div>

      <CardHeader>
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg font-semibold">
            {service.title}
          </CardTitle>
        </div>
      </CardHeader>

      <CardContent className="flex-grow">
        <p className="text-sm text-muted-foreground line-clamp-3 mb-4">
          {service.description}
        </p>

        <div className="space-y-2">
          {service.benefits && service.benefits.length > 0 && (
            <>
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Beneficios:
              </p>
              <ul className="space-y-1">
                {service.benefits.map((benefit, index) => (
                  <li key={index} className="text-sm flex items-start gap-2">
                    <span className="text-primary mt-1">•</span>
                    <span className="text-muted-foreground">{benefit}</span>
                  </li>
                ))}
              </ul>
            </>
          )}
        </div>
      </CardContent>

      <CardFooter className="flex justify-between border-t pt-4 mt-auto">
        <Button
          onClick={() => setIsEditModalOpen(true)}
          variant="outline"
          className="flex-1 mr-2"
        >
          <Edit className="mr-2 h-4 w-4" />
          Editar Clase
        </Button>
        <DeleteServiceButton
          serviceId={service.id}
          onServiceDeleted={handleServiceDeleted}
        />
      </CardFooter>

      <EditServiceModal
        service={service}
        isOpen={isEditModalOpen}
        onOpenChange={setIsEditModalOpen}
        onServiceUpdated={() => {
          onServiceUpdated();
          setIsEditModalOpen(false);
        }}
      />
    </Card>
  );
}
