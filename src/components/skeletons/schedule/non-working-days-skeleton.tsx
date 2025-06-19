import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Label } from "@/components/ui/label";

export function NonWorkingDaysSkeleton() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label htmlFor="new-date-skeleton">Fecha</Label>
          <Skeleton className="h-10 w-full" />
        </div>
        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="new-description-skeleton">Descripción</Label>
          <div className="flex gap-2">
            <Skeleton className="h-10 flex-grow" />
            <Skeleton className="h-10 w-10" /> {/* Skeleton for Button */}
          </div>
        </div>
      </div>

      <div className="overflow-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>
                <Skeleton className="h-5 w-24" />
              </TableHead>
              <TableHead>
                <Skeleton className="h-5 w-48" />
              </TableHead>
              <TableHead className="w-[100px]">
                <Skeleton className="h-5 w-20" />
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {[...Array(3)].map((_, index) => (
              <TableRow key={index}>
                <TableCell>
                  <Skeleton className="h-5 w-32" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-5 w-full" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-8 w-8" />{" "}
                  {/* Skeleton for Action Button - Removed {' '} */}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
