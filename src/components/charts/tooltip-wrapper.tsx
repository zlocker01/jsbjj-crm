"use client";

import type React from "react";
import type { NameType, ValueType } from "recharts/types/component/DefaultTooltipContent";

import { Tooltip as RechartsTooltip } from "recharts";
import { tooltipStyles } from "@/lib/chart-utils";

interface TooltipWrapperProps {
  formatter?: (value: ValueType, name: NameType) => any;
  labelFormatter?: (label: any) => React.ReactNode;
}

export function TooltipWrapper({
  formatter,
  labelFormatter,
}: TooltipWrapperProps) {
  return (
    <RechartsTooltip
      contentStyle={tooltipStyles.contentStyle}
      itemStyle={tooltipStyles.itemStyle}
      labelStyle={tooltipStyles.labelStyle}
      formatter={formatter}
      labelFormatter={labelFormatter}
    />
  );
}
