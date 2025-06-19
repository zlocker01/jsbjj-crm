import type React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

interface LinkButtonProps {
  href: string;
  label: string;
  icon?: ReactNode;
  className?: string;
}

export const LinkButton: React.FC<LinkButtonProps> = ({
  href,
  label,
  icon,
  className,
}) => {
  return (
    <Link
      href={href}
      className={cn(
        "w-full flex items-center justify-center gap-2 bg-primaryColor hover:bg-primaryColor/90 text-white py-2 px-4 rounded-md shadow-sm transition-all duration-200",
        className,
      )}
    >
      {icon}
      <span>{label}</span>
    </Link>
  );
};
