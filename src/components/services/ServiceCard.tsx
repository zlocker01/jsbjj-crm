'use client';

import { useState } from 'react';
import { Edit, Clock, Layers, Users } from 'lucide-react';
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
      title: 'Servicio eliminado',
      description: 'El servicio ha sido eliminado correctamente.',
      variant: 'success',
    });
    router.refresh();
  };

  return (
    <Card className="w-full max-w-sm overflow-hidden transition-shadow hover:shadow-lg">
      <div className="h-48 w-full overflow-hidden relative">
        <img
          src={service.image || '/placeholder-service.jpg'}
          alt={service.title}
          className="w-full h-full object-cover"
        />
        {service.category && (
          <Badge className="absolute top-2 right-2 bg-primary/90 hover:bg-primary">
            {service.category}
          </Badge>
        )}
      </div>

      <CardHeader>
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg font-semibold">
            {service.title}
          </CardTitle>
          <span className="text-primary font-bold">
            ${service.price.toFixed(2)}
          </span>
        </div>
      </CardHeader>

      <CardContent>
        <p className="text-sm text-muted-foreground line-clamp-3 mb-3">
          {service.description}
        </p>

        <div className="space-y-1">
          {service.duration_minutes && (
            <div className="flex items-center text-sm text-muted-foreground">
              <Clock className="mr-2 h-4 w-4" />
              <span>{service.duration_minutes} minutos</span>
            </div>
          )}

          {service.sessions_count && (
            <div className="flex items-center text-sm text-muted-foreground">
              <Layers className="mr-2 h-4 w-4" />
              <span>
                {service.sessions_count}{' '}
                {service.sessions_count === 1 ? 'sesión' : 'sesiones'}
              </span>
            </div>
          )}

          {service.target_audience && (
            <div className="flex items-center text-sm text-muted-foreground">
              <Users className="mr-2 h-4 w-4" />
              <span>{service.target_audience}</span>
            </div>
          )}
        </div>
      </CardContent>

      <CardFooter className="flex justify-between border-t pt-4">
        <Button
          onClick={() => setIsEditModalOpen(true)}
          variant="outline"
          className="flex-1 mr-2"
        >
          <Edit className="mr-2 h-4 w-4" />
          Editar
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
