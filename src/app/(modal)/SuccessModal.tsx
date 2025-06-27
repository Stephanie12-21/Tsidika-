"use client";

import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";
import Image from "next/image";
import { CheckCircle } from "lucide-react";

type SuccessModalProps = {
  open: boolean;
  onClose: () => void;
  title?: string;
  message?: string;
};

export default function SuccessModal({
  open,
  onClose,
  title,
  message,
}: SuccessModalProps) {
  return (
    <AlertDialog open={open} onOpenChange={onClose}>
      <AlertDialogContent className="sm:max-w-lg border-none shadow-none bg-transparent p-0 overflow-hidden">
        <div className="bg-gradient-to-br from-emerald-400 via-green-500 to-teal-600 p-1 rounded-3xl shadow-2xl">
          <div className="bg-white/95 backdrop-blur-xl rounded-3xl p-8 relative overflow-hidden">
            {/* Logo en fond */}
            <div className="absolute bottom-4 left-4 opacity-5 transform rotate-12">
              <Image
                src="/logo.png"
                width={40}
                height={40}
                alt=""
                className="h-10 w-10 object-contain"
              />
            </div>

            <AlertDialogHeader>
              <div className="text-center space-y-6">
                {/* Icône succès */}
                <div className="flex justify-center">
                  <div className="relative">
                    <div className="absolute inset-0 bg-emerald-400 rounded-full animate-ping opacity-20"></div>
                    <div className="relative bg-gradient-to-br from-emerald-400 to-green-500 rounded-full p-4 shadow-2xl animate-bounce">
                      <CheckCircle className="h-12 w-12 text-white" />
                    </div>
                  </div>
                </div>

                {/* Titre dynamique */}
                <div className="space-y-3">
                  <AlertDialogTitle className="text-2xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent leading-tight">
                    {title ?? "Inscription réussie !"}
                  </AlertDialogTitle>
                </div>

                {/* Message dynamique */}
                <AlertDialogDescription className="text-gray-600 text-base leading-relaxed max-w-md mx-auto">
                  {message ??
                    "Bienvenue dans notre communauté ! Vous serez désormais l'un des premiers à être au courant de nos futurs voyages et offres exclusives."}
                </AlertDialogDescription>
              </div>
            </AlertDialogHeader>

            {/* Bouton */}
            <div className="flex justify-center mt-10">
              <AlertDialogAction
                onClick={onClose}
                className="bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white px-12 py-4 rounded-2xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 border-none font-medium text-base"
              >
                Super 🌴
              </AlertDialogAction>
            </div>
          </div>
        </div>
      </AlertDialogContent>
    </AlertDialog>
  );
}
