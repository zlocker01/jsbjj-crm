"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import useSWR from "swr";
import type { Client } from "@/interfaces/client/Client";
import { useState } from "react";
import { ClientsTableRowSkeleton } from "../skeletons/clients/table-row-skeleton";

interface ClientsTableProps {
  searchQuery: string;
  onClientSelect: (client: Client) => void;
  selectedClientId?: string;
}

export function ClientsTable({
  searchQuery,
  onClientSelect,
  selectedClientId,
}: ClientsTableProps) {
  const [page, setPage] = useState(1);
  const pageSize = 5; // Usaremos esto para determinar cuántas filas de esqueleto mostrar
  const { data, isLoading } = useSWR("/api/clients", async (url) => {
    const res = await fetch(url);
    const data = await res.json();
    return data.clients || [];
  });

  const clients = data || [];

  const filteredClients = clients.filter((client: Client) => {
    const query = searchQuery.toLowerCase();
    return (
      client.name.toLowerCase().includes(query) ||
      client.email?.toLowerCase().includes(query) ||
      client.phone?.includes(query)
    );
  });

  const totalPages = Math.ceil(filteredClients.length / pageSize);
  const paginatedClients = filteredClients.slice(
    (page - 1) * pageSize,
    page * pageSize,
  );

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("es-ES", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="space-y-4">
      <div style={{ width: '100%', overflowX: 'auto' }}>
        <Table className="min-w-[900px] w-max">
          <TableHeader>
            <TableRow>
              <TableHead>Nombre</TableHead>
              <TableHead className="hidden md:table-cell">Email</TableHead>
              <TableHead className="hidden sm:table-cell">Teléfono</TableHead>
              <TableHead className="text-right">Citas</TableHead>
              <TableHead className="hidden sm:table-cell">
                Última Visita
              </TableHead>
              <TableHead>Estado</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              Array.from({ length: pageSize }).map((_, index) => (
                <ClientsTableRowSkeleton key={`skeleton-${index}`} />
              ))
            ) : paginatedClients.length > 0 ? (
              paginatedClients.map((client: Client) => (
                <TableRow
                  key={client.id}
                  className={`cursor-pointer ${client.id === selectedClientId ? "bg-muted" : ""}`}
                  onClick={() => onClientSelect(client)}
                >
                  <TableCell className="font-medium">{client.name}</TableCell>
                  <TableCell className="table-cell">
                    {client.email}
                  </TableCell>
                  <TableCell className="table-cell">
                    {client.phone}
                  </TableCell>
                  <TableCell className="text-right">
                    {client.appointments}
                  </TableCell>
                  <TableCell className="table-cell">
                    {client.last_visit_date
                      ? formatDate(client.last_visit_date)
                      : "Sin visitas"}
                  </TableCell>
                  <TableCell>
                    <span
                      className={`inline-block px-2 py-1 text-xs rounded-full ${client.is_active === true
                          ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100"
                          : "bg-red-100 text-gray-800 dark:bg-red-800 dark:text-gray-100"
                        }`}
                    >
                      {client.is_active === true ? "Activo" : "Inactivo"}
                    </span>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="text-center py-4 text-muted-foreground"
                >
                  No se encontraron clientes
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-end space-x-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => setPage(1)}
            disabled={page === 1}
          >
            <ChevronsLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={() => setPage(page - 1)}
            disabled={page === 1}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="text-sm text-muted-foreground">
            Página {page} de {totalPages}
          </span>
          <Button
            variant="outline"
            size="icon"
            onClick={() => setPage(page + 1)}
            disabled={page === totalPages}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={() => setPage(totalPages)}
            disabled={page === totalPages}
          >
            <ChevronsRight className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  );
}
