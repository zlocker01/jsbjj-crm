import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const getLevelBadgeColor = (level: string | undefined) => {
  if (!level) return 'bg-primary hover:bg-primary/90';
  
  switch (level) {
    case 'Principiantes':
      return 'bg-green-500 hover:bg-green-600 text-white';
    case 'Avanzado':
      return 'bg-red-500 hover:bg-red-600 text-white';
    case 'Niños':
      return 'bg-sky-400 hover:bg-sky-500 text-white';
    case 'Mujeres':
      return 'bg-pink-500 hover:bg-pink-600 text-white';
    case 'Mixto':
      return 'bg-purple-500 hover:bg-purple-600 text-white';
    case 'Competencia':
      return 'bg-amber-500 hover:bg-amber-600 text-white';
    default:
      return 'bg-primary hover:bg-primary/90 text-primary-foreground';
  }
};
