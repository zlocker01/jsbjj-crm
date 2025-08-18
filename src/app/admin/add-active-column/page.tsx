"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Code } from "lucide-react";

export default function AddActiveColumnPage() {
  return (
    <div className="container mx-auto py-10">
      <Card>
        <CardHeader>
          <CardTitle>Añadir columna 'active' a la tabla de promociones</CardTitle>
        </CardHeader>
        <CardContent>
          <Alert className="mb-6">
            <AlertTitle>Error detectado</AlertTitle>
            <AlertDescription>
              Se ha detectado que falta la columna 'active' en la tabla de promociones.
            </AlertDescription>
          </Alert>
          
          <h3 className="text-lg font-semibold mb-2">Instrucciones para añadir la columna:</h3>
          
          <ol className="list-decimal pl-6 space-y-4 mb-6">
            <li>
              <p>Accede al panel de administración de Supabase</p>
            </li>
            <li>
              <p>Ve a la sección "Table Editor" en el menú lateral</p>
            </li>
            <li>
              <p>Selecciona la tabla "promotions"</p>
            </li>
            <li>
              <p>Haz clic en "Edit Table"</p>
            </li>
            <li>
              <p>Añade una nueva columna con las siguientes propiedades:</p>
              <ul className="list-disc pl-6 mt-2">
                <li><strong>Nombre:</strong> active</li>
                <li><strong>Tipo:</strong> boolean</li>
                <li><strong>Valor predeterminado:</strong> true</li>
                <li><strong>¿Es nulo?:</strong> No</li>
              </ul>
            </li>
            <li>
              <p>Guarda los cambios</p>
            </li>
          </ol>
          
          <div className="bg-gray-100 p-4 rounded-md mb-6">
            <h4 className="font-semibold flex items-center"><Code className="mr-2 h-4 w-4" /> SQL Equivalente:</h4>
            <pre className="bg-gray-800 text-white p-3 rounded mt-2 overflow-x-auto">
              ALTER TABLE promotions ADD COLUMN active BOOLEAN DEFAULT true NOT NULL;
            </pre>
          </div>
          
          <Alert>
            <AlertTitle>Nota importante</AlertTitle>
            <AlertDescription>
              Después de añadir la columna, actualiza la página para que los cambios surtan efecto en la aplicación.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    </div>
  );
}
