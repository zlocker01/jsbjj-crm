import { Badge } from '@/components/ui/badge';
import { cn, getLevelBadgeColor } from '@/lib/utils';
import {
  Baby,
  Sparkles,
  Smile,
  HeartPulse,
  Users,
  Trophy,
  Star,
} from 'lucide-react';

interface LevelBadgeProps {
  level: string | undefined;
  className?: string;
}

export function LevelBadge({ level, className }: LevelBadgeProps) {
  if (!level) return null;

  const getIcon = () => {
    switch (level) {
      case 'Principiantes':
        return <Baby className="mr-1 h-3 w-3" />;
      case 'Avanzado':
        return <Sparkles className="mr-1 h-3 w-3" />;
      case 'Niños':
        return <Smile className="mr-1 h-3 w-3" />;
      case 'Mujeres':
        return <HeartPulse className="mr-1 h-3 w-3" />;
      case 'Mixto':
        return <Users className="mr-1 h-3 w-3" />;
      case 'Competencia':
        return <Trophy className="mr-1 h-3 w-3" />;
      default:
        return <Star className="mr-1 h-3 w-3" />;
    }
  };

  return (
    <Badge
      className={cn(
        "flex items-center border-none shadow-sm px-2 py-1",
        getLevelBadgeColor(level),
        className
      )}
    >
      {getIcon()}
      {level}
    </Badge>
  );
}
