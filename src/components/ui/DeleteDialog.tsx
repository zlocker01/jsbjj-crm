import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";

interface DeleteDialogProps {
  onDelete: () => Promise<void> | void;
  buttonText?: string;
  title?: string;
  description?: string;
  cancelText?: string;
  confirmText?: string;
  variant?:
    | "outline"
    | "destructive"
    | "default"
    | "secondary"
    | "ghost"
    | "link";
}

export function DeleteDialog({
  onDelete,
  buttonText = "Eliminar",
  title = "¿Estás seguro?",
  description = "Esta acción no se puede deshacer. Esto eliminará permanentemente este registro.",
  cancelText = "Cancelar",
  confirmText = "Eliminar",
  variant = "destructive",
}: DeleteDialogProps) {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant={variant} className="flex items-center gap-2">
          <Trash2 className="h-4 w-4" />
          {buttonText}
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent className="border border-gray-200 dark:border-gray-700 shadow-lg">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-red-600 dark:text-red-400 text-xl font-bold">
            {title}
          </AlertDialogTitle>
          <AlertDialogDescription className="text-gray-600 dark:text-gray-400">
            {description}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="flex gap-2">
          <AlertDialogCancel className="border-gray-300 text-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800">
            {cancelText}
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={onDelete}
            className="bg-red-600 hover:bg-red-700 text-white dark:bg-red-700 dark:hover:bg-red-800"
          >
            {confirmText}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
