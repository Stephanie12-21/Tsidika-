"use client";

import { useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { X } from "lucide-react";
import SuccessModal from "@/app/(modal)/SuccessModal";
import ErrorModal from "@/app/(modal)/ErrorModal";
import InfoModal from "@/app/(modal)/InfoModal";

export default function NewsletterSubscription() {
  const [step, setStep] = useState<"initial" | "input" | "submitting">(
    "initial"
  );
  const [email, setEmail] = useState("");

  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [showInfoModal, setShowInfoModal] = useState(false);
  const [infoMessage, setInfoMessage] = useState("");

  const [isAnimating, setIsAnimating] = useState(false);

  const handleSubscribe = async () => {
    if (step === "initial") {
      setIsAnimating(true);
      setTimeout(() => {
        setStep("input");
        setIsAnimating(false);
      }, 400);
    } else if (step === "input" && email) {
      setStep("submitting");
      setIsAnimating(true);

      // Simuler l'envoi / traitement
      setTimeout(() => {
        setIsAnimating(false);

        // Exemple de gestion d'erreur ou info
        // Ici tu peux remplacer par un vrai appel API qui retourne un statut
        const isAlreadySubscribed = email === "test@exemple.com"; // ex

        if (isAlreadySubscribed) {
          setStep("initial");
          setEmail("");
          setInfoMessage("Vous êtes déjà abonné à la newsletter.");
          setShowInfoModal(true);
        } else {
          // Succès
          setStep("initial");
          setEmail("");
          setShowSuccessModal(true);
        }
      }, 1200);
    }
  };

  const handleCancel = () => {
    if (step === "submitting") {
      setShowErrorModal(true);
    } else if (step === "input") {
      setIsAnimating(true);
      setTimeout(() => {
        setStep("initial");
        setEmail("");
        setIsAnimating(false);
      }, 400);
    }
  };

  const closeSuccessModal = () => setShowSuccessModal(false);
  const closeErrorModal = () => setShowErrorModal(false);
  const closeInfoModal = () => setShowInfoModal(false);

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      {/* ... ton contenu principal (titre, input, boutons) ... */}
      <div className="relative z-10 w-full max-w-lg">
        {/* Titre + logo */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full mb-6 shadow-lg">
            <Image src="/logo.png" width={64} height={64} alt="Logo" />
          </div>
          <h1 className="text-4xl font-bold text-black mb-4">Restez informé</h1>
          <p className="text-gray-700 text-base font-medium">
            Recevez nos dernières actualités et conseils directement dans votre
            boîte mail
          </p>
        </div>

        {/* Input + boutons */}
        <div className="relative flex items-center justify-center h-16 mb-8">
          <div className="relative flex items-center bg-white/90 backdrop-blur-sm rounded-full shadow-2xl border border-white/60 overflow-hidden transition-all duration-700 ease-out">
            <div
              className={`transition-all duration-700 ease-out transform ${
                step === "input" && !isAnimating
                  ? "w-80 opacity-100 scale-100"
                  : step === "submitting"
                  ? "w-80 opacity-50 scale-100"
                  : "w-0 opacity-0 scale-95"
              }`}
            >
              <Input
                type="email"
                placeholder="votre@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full h-16 bg-transparent border-none focus:ring-0 focus:outline-none text-base px-6 placeholder:text-gray-500"
                disabled={step === "submitting"}
                autoFocus={step === "input"}
                onKeyDown={(e) => {
                  if (e.key === "Escape") {
                    handleCancel();
                  }
                }}
              />
            </div>

            {(step === "input" || step === "submitting") && (
              <Button
                onClick={handleCancel}
                variant="ghost"
                size="sm"
                className="h-12 w-12 p-0 rounded-full hover:bg-orange-100 transition-all duration-300 flex-shrink-0 mr-2"
                disabled={step === "submitting"}
              >
                <X className="h-5 w-5 text-gray-600" />
              </Button>
            )}

            <Button
              onClick={handleSubscribe}
              disabled={step === "input" && !email}
              className={`h-16 px-8 bg-[#f36f0f] hover:bg-[#e55a00] text-white rounded-full transition-all duration-700 ease-out transform shadow-lg hover:shadow-xl relative overflow-hidden group flex-shrink-0 ${
                step === "submitting" ? "opacity-80 cursor-not-allowed" : ""
              }`}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/15 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
              <div className="relative flex items-center space-x-2">
                {step === "submitting" ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    <span className="text-base font-medium">
                      Inscription...
                    </span>
                  </>
                ) : (
                  <span className="text-base font-medium whitespace-nowrap">
                    {step === "input"
                      ? "Confirmer"
                      : "S'abonner à la newsletter"}
                  </span>
                )}
              </div>
            </Button>
          </div>
        </div>
      </div>

      {/* Modales */}
      <SuccessModal
        open={showSuccessModal}
        onClose={closeSuccessModal}
        title="Bienvenue !"
        message="Votre abonnement à la newsletter est confirmé. 🎉"
      />

      <ErrorModal
        open={showErrorModal}
        onClose={closeErrorModal}
        title={infoMessage ? "Information" : "Erreur"}
        message="Impossible de contacter le serveur. Veuillez réessayer plus tard."
      />

      <InfoModal
        open={showInfoModal}
        onClose={closeInfoModal}
        title="Déjà inscrit"
        message="Cette adresse email est déjà abonnée à notre newsletter."
      />
    </div>
  );
}
