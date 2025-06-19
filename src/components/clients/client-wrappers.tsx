"use client";

import { useRouter, usePathname } from "next/navigation";
import { useToast } from "@/components/ui/use-toast";
import { ClientDetails } from "./client-details";
import type { Client } from "@/interfaces/client/Client";

export function ClientDetailsWrapper({
  client,
  searchQuery,
}: {
  client: Client;
  searchQuery?: string;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const { toast } = useToast();

  const handleDeleteSuccess = () => {
    const params = new URLSearchParams();
    if (searchQuery) {
      params.set("q", searchQuery);
    }
    router.push(`${pathname}?${params.toString()}`);

    toast({
      title: "Cliente eliminado",
      description: "El cliente ha sido eliminado correctamente.",
      variant: "success",
    });
  };

  return (
    <ClientDetails client={client} onDeleteSuccess={handleDeleteSuccess} />
  );
}
