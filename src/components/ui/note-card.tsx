import type React from "react";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

interface NoteCardProps {
  title: string;
  content: React.ReactNode;
  className?: string;
  highlight?: boolean;
  icon?: ReactNode;
}

export function NoteCard({
  title,
  content,
  className,
  highlight = false,
  icon,
}: NoteCardProps) {
  return (
    <Card
      className={cn(
        "p-4 rounded-lg transition-all duration-300 ease-in-out",
        highlight
          ? "bg-indigo-50 dark:bg-indigo-900/20 border-l-4 border-indigo-500"
          : "bg-gray-50 dark:bg-gray-900/50",
        className,
      )}
    >
      <h3
        className={cn(
          "text-lg font-semibold mb-2 flex items-center gap-2",
          highlight
            ? "text-indigo-700 dark:text-indigo-400"
            : "text-gray-800 dark:text-gray-200",
        )}
      >
        {icon}
        {title}
      </h3>
      <div className="ml-2 text-gray-700 dark:text-gray-300">{content}</div>
    </Card>
  );
}
