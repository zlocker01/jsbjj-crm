import { Skeleton } from "@/components/ui/skeleton";
import { TableCell, TableRow } from "@/components/ui/table";

export function TableRowSkeleton({ columns = 6 }: { columns?: number }) {
  return (
    <TableRow>
      {Array.from({ length: columns }).map((_, index) => (
        <TableCell key={`skeleton-cell-${index}`}>
          <Skeleton
            className={`h-5 w-${index === 0 || index === 2 || index === 4 ? "3/4" : index === 3 ? "1/4 ml-auto" : index === 5 ? "1/2" : "full"}`}
          />
        </TableCell>
      ))}
    </TableRow>
  );
}

// Para que coincida con el esqueleto original de clients-table.tsx,
// podemos hacer una versión más específica si no se necesita dinamismo:
export function ClientsTableRowSkeleton() {
  return (
    <TableRow>
      <TableCell>
        <Skeleton className="h-5 w-3/4" />
      </TableCell>
      <TableCell className="hidden md:table-cell">
        <Skeleton className="h-5 w-full" />
      </TableCell>
      <TableCell className="hidden sm:table-cell">
        <Skeleton className="h-5 w-3/4" />
      </TableCell>
      <TableCell className="text-right">
        <Skeleton className="h-5 w-1/4 ml-auto" />
      </TableCell>
      <TableCell className="hidden sm:table-cell">
        <Skeleton className="h-5 w-3/4" />
      </TableCell>
      <TableCell>
        <Skeleton className="h-5 w-1/2" />
      </TableCell>
    </TableRow>
  );
}
