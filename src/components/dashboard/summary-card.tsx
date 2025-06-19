import type { ReactNode } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface SummaryCardProps {
  title: string;
  value: string | number;
  changePercent: number;
  changeLabel?: string;
  icon?: ReactNode;
}

export function SummaryCard({
  title,
  value,
  changePercent,
  changeLabel = "respecto al mes anterior",
  icon,
}: SummaryCardProps) {
  const isPositive = changePercent >= 0;

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <div className="flex items-center mt-1">
          <Badge
            variant="outline"
            className={
              isPositive
                ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100"
                : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100"
            }
          >
            {isPositive ? "+" : ""}
            {changePercent}%
          </Badge>
          <span className="text-xs text-muted-foreground ml-2">
            {changeLabel}
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
