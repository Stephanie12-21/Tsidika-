"use client";

import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";
import { Info } from "lucide-react";

type InfoModalProps = {
  open: boolean;
  onClose: () => void;
  title?: string;
  message?: string;
};

export default function InfoModal({
  open,
  onClose,
  title,
  message,
}: InfoModalProps) {
  return (
    <AlertDialog open={open} onOpenChange={onClose}>
      <AlertDialogContent className="sm:max-w-md">
        <AlertDialogHeader>
          <div className="flex items-center space-x-3 mb-2">
            <Info className="h-8 w-8 text-blue-600" />
            <AlertDialogTitle>{title ?? "Information"}</AlertDialogTitle>
          </div>
          <AlertDialogDescription>
            {message ?? "Voici une information importante à connaître."}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <div className="flex justify-end mt-6">
          <AlertDialogAction onClick={onClose}>Fermer</AlertDialogAction>
        </div>
      </AlertDialogContent>
    </AlertDialog>
  );
}
