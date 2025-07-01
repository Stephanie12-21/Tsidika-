"use client";
import Image from "next/image";
import { Facebook, Instagram, Linkedin, X } from "lucide-react";
import { FaWhatsapp } from "react-icons/fa";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import SuccessModal from "@/app/(modal)/SuccessModal";
import ErrorModal from "@/app/(modal)/ErrorModal";
import InfoModal from "@/app/(modal)/InfoModal";
import { z } from "zod";
import Link from "next/link";

// Icônes sociales
const socialIcons = [
  {
    Icon: Facebook,
    label: "Facebook",
    href: "https://www.facebook.com/stephanie.maminiaina.12",
  },
  {
    Icon: Linkedin,
    label: "Linkedin",
    href: "https://www.linkedin.com/in/st%C3%A9phanie-maminiaina-262066303/",
  },
  {
    Icon: Instagram,
    label: "Instagram",
    href: "https://www.instagram.com/stephaniiiiiiiiiiieeee/?igsh=YzljYTk1ODg3Zg%3D%3D#",
  },
  {
    Icon: FaWhatsapp,
    label: "WhatsApp",
    href: "https://wa.me/261381182627",
  },
];

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

const Footer = () => {
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
    <footer>
      <div className=" mx-auto px-12 py-6">
        {/* Ligne du haut */}
        <div className="flex items-center justify-between gap-6 mb-4">
          {/* Logo */}
          <div className="flex items-center gap-3 flex-shrink-0">
            <Image
              src="/images/logo.png"
              alt="Tsidika Logo"
              width={40}
              height={40}
              className="rounded-full"
            />

            <div className="flex flex-col items-start justify-between">
              <span className="text-lg font-semibold bg-gradient-to-r from-orange-500 to-orange-600 bg-clip-text text-transparent">
                Tsidika
              </span>
              <div className="flex gap-3 ">
                {socialIcons.map(({ Icon, label, href }) => (
                  <a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-8 h-8 rounded-full flex items-center justify-center text-gray-500 hover:text-white hover:bg-gradient-to-r hover:from-orange-500 hover:to-orange-600 transition-all duration-300 hover:scale-110"
                    aria-label={label}
                  >
                    <Icon className="h-4 w-4" />
                  </a>
                ))}
              </div>
            </div>
          </div>
          <div className=" flex justify-center">
            <p className="text-base text-gray-500 text-center">
              © {new Date().getFullYear()} Développé par{" "}
              <Link
                href="https://stephanie-maminiaina.vercel.app/"
                className="text-orange-500 font-medium cursor-pointer hover:underline"
              >
                Stéphanie MAMINIAINA
              </Link>
            </p>
          </div>
          {/* Newsletter */}
          <div className="relative z-10 flex-shrink-0">
            <div className="relative flex items-center justify-center h-10">
              <div className="relative flex items-center bg-white backdrop-blur-sm rounded-full shadow-lg border border-orange-200 overflow-hidden transition-all duration-700 ease-out">
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
                    className="w-full h-10 bg-transparent border-none focus:ring-0 focus:outline-none text-base px-4 placeholder:text-gray-400"
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
                  className={`h-10 px-5 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white rounded-full transition-all duration-700 ease-out transform shadow-md hover:shadow-lg relative overflow-hidden group flex-shrink-0 ${
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
                        {step === "input" ? "Confirmer" : "Newsletter"}
                      </span>
                    )}
                  </div>
                </Button>
              </div>
            </div>
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
    </footer>
  );
};

export default Footer;
