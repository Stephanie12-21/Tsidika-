"use client";

import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";
import { XCircle } from "lucide-react";

type ErrorModalProps = {
  open: boolean;
  onClose: () => void;
  title?: string;
  message?: string;
};

export default function ErrorModal({
  open,
  onClose,
  title,
  message,
}: ErrorModalProps) {
  return (
    <AlertDialog open={open} onOpenChange={onClose}>
      <AlertDialogContent className="sm:max-w-md">
        <AlertDialogHeader>
          <div className="flex items-center space-x-3 mb-2">
            <XCircle className="h-8 w-8 text-red-600" />
            <AlertDialogTitle>
              {title ?? "Une erreur est survenue"}
            </AlertDialogTitle>
          </div>
          <AlertDialogDescription>
            {message ??
              "Nous avons rencontré un problème. Veuillez réessayer plus tard."}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <div className="flex justify-end mt-6">
          <AlertDialogAction onClick={onClose}>Fermer</AlertDialogAction>
        </div>
      </AlertDialogContent>
    </AlertDialog>
  );
}
