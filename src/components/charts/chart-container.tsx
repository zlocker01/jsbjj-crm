"use client";

import type { ReactNode, ReactElement } from "react";
import { ResponsiveContainer } from "recharts";
import { Skeleton } from "@/components/ui/skeleton";

interface ChartContainerProps {
  children?: ReactElement<any>;
  height?: number | string;
  width?: number | string;
  isLoading?: boolean;
  error?: string;
  empty?: string;
}

export function ChartContainer({
  children,
  height = 350,
  width = "100%",
  isLoading = false,
  error,
  empty,
}: ChartContainerProps) {
  if (isLoading) {
    return (
      <div className="h-[350px] flex items-center justify-center">
        <div className="space-y-2 w-full">
          <Skeleton className="h-[300px] w-full" />
          <div className="flex justify-center gap-4">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-4 w-20" />
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-[350px] flex items-center justify-center text-destructive">
        {error}
      </div>
    );
  }

  if (empty) {
    return (
      <div className="h-[350px] flex items-center justify-center text-muted-foreground">
        {empty}
      </div>
    );
  }

  if (!children) {
    return null;
  }

  return (
    <ResponsiveContainer width={width} height={height}>
      {children}
    </ResponsiveContainer>
  );
}
