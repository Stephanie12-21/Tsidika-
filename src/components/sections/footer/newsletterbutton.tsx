"use client";
import { X } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import SuccessModal from "@/app/(modal)/SuccessModal";
import ErrorModal from "@/app/(modal)/ErrorModal";
import InfoModal from "@/app/(modal)/InfoModal";
import { z } from "zod";

// Validation email
const emailSchema = z
  .string()
  .email({ message: "Adresse email invalide." })
  .refine(
    (email) => {
      const allowedDomains = [
        "gmail.com",
        "yahoo.com",
        "outlook.com",
        "hotmail.com",
        "live.com",
        "icloud.com",
        "orange.fr",
        "free.fr",
        "protonmail.com",
      ];
      const domain = email.split("@")[1]?.toLowerCase();
      return allowedDomains.includes(domain);
    },
    {
      message: "Domaine email non autorisé.",
    }
  );

const NewsletterButton = () => {
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
      const result = emailSchema.safeParse(email);
      if (!result.success) {
        setInfoMessage(result.error.issues[0]?.message || "Email invalide");
        setShowInfoModal(true);
        return;
      }

      setStep("submitting");
      setIsAnimating(true);

      try {
        const res = await fetch("/api/newsletter", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email }),
        });

        const data = await res.json();

        setIsAnimating(false);
        setEmail("");
        setStep("initial");

        if (res.status === 200) {
          setShowSuccessModal(true);
        } else if (res.status === 409) {
          setInfoMessage(data.message || "Cet email est déjà abonné.");
          setShowInfoModal(true);
        } else {
          setShowErrorModal(true);
        }
      } catch (error) {
        console.error("Erreur lors de l'inscription :", error);
        setIsAnimating(false);
        setStep("initial");
        setShowErrorModal(true);
      }
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

  return (
    <div>
      <div className="relative z-10 flex-shrink-0">
        <div className="relative flex items-start justify-items-start h-10">
          <div className="relative flex items-start bg-white backdrop-blur-sm rounded-full shadow-lg overflow-hidden transition-all duration-700 ease-out">
            <div
              className={`transition-all duration-700 ease-out transform ${
                step === "input" && !isAnimating
                  ? "w-64 opacity-100 scale-100"
                  : step === "submitting"
                  ? "w-64 opacity-50 scale-100"
                  : "w-0 opacity-0 scale-95"
              }`}
            >
              <Input
                type="email"
                placeholder="votre@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full h-10 bg-transparent border-none focus:ring-0 focus:outline-none text-base px-4 text-black placeholder:text-gray-400"
                disabled={step === "submitting"}
                autoFocus={step === "input"}
                onKeyDown={(e) => {
                  if (e.key === "Escape") handleCancel();
                }}
              />
            </div>

            {(step === "input" || step === "submitting") && (
              <Button
                onClick={handleCancel}
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0 rounded-full hover:bg-orange-300 cursor-pointer transition-all duration-300 flex-shrink-0 mr-1"
                disabled={step === "submitting"}
              >
                <X className="h-3 w-3 text-gray-500" />
              </Button>
            )}
            <Button
              onClick={handleSubscribe}
              disabled={step === "input" && !email}
              className={`h-10 px-5 bg-[#F36F0F] hover:bg-[#e55e00] text-white rounded-full transition-all duration-300 transform shadow-md hover:shadow-lg flex-shrink-0 ${
                step === "submitting" ? "opacity-80 cursor-not-allowed" : ""
              }`}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
              <div className="relative flex items-center space-x-2">
                {step === "submitting" ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
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
        onClose={() => setShowSuccessModal(false)}
        title="Bienvenue !"
        message="Votre abonnement à la newsletter est confirmé. 🎉"
      />
      <ErrorModal
        open={showErrorModal}
        onClose={() => setShowErrorModal(false)}
        title="Erreur"
        message="Impossible de contacter le serveur. Veuillez réessayer plus tard."
      />
      <InfoModal
        open={showInfoModal}
        onClose={() => setShowInfoModal(false)}
        title="Information"
        message={infoMessage}
      />
    </div>
  );
};

export default NewsletterButton;
