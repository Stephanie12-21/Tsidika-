"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { X } from "lucide-react";
import { z } from "zod";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";

type Trip = {
  slug: string;
  titre: string;
  prix: number;
  passagers: number;
};

type BookingModalProps = {
  trip: Trip;
  showBooking: boolean;
  setShowBooking: (value: boolean) => void;
  setShowSuccessModal: (value: boolean) => void;
  setShowErrorModal: (value: boolean) => void;
  setShowInfoModal: (value: boolean) => void;
  setModalTitle: (value: string) => void;
  setModalMessage: (value: string) => void;
};

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

const bookingSchema = z.object({
  nom: z.string().min(1, "Le nom est requis"),
  email: emailSchema,
  personnes: z.coerce.number().min(1, "Au moins 1 personne"),
  phone: z.string().min(5, "Le numéro de téléphone est requis"),
});

export default function BookingModal({
  trip,
  showBooking,
  setShowBooking,
  setShowSuccessModal,
  setShowErrorModal,
  setShowInfoModal,
  setModalTitle,
  setModalMessage,
}: BookingModalProps) {
  const [formData, setFormData] = useState({
    nom: "",
    email: "",
    personnes: 1,
    phone: "",
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };
  const handlePhoneChange = (value: string) => {
    setFormData((prev) => ({ ...prev, phone: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // On affiche la modale info dès que la soumission commence
    setShowInfoModal(true);
    setModalTitle("Traitement en cours");
    setModalMessage("Votre réservation est en cours de traitement...");

    const result = bookingSchema.safeParse(formData);
    if (!result.success) {
      setShowInfoModal(false); // on ferme la modale info si erreur
      const fieldErrors: { [key: string]: string } = {};
      result.error.errors.forEach((err) => {
        const field = err.path[0] as string;
        fieldErrors[field] = err.message;
      });
      setErrors(fieldErrors);
      setShowErrorModal(true);
      setModalTitle("Erreur de formulaire");
      setModalMessage("Merci de corriger les erreurs avant de soumettre.");
      return;
    }

    const payload = { ...result.data, slug: trip.slug };

    try {
      const res = await fetch("/api/trips", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      setShowInfoModal(false); // on ferme la modale info dès que la réponse arrive

      if (!res.ok) throw new Error("Erreur API");

      setErrors({});
      setShowBooking(false);
      setShowSuccessModal(true);
      setModalTitle("Réservation confirmée");
      setModalMessage(
        "Un email de confirmation vous a été envoyé avec la fiche PDF du voyage."
      );
    } catch (error) {
      setShowInfoModal(false); // aussi fermer si erreur
      console.error(error);
      setShowErrorModal(true);
      setModalTitle("Erreur serveur");
      setModalMessage(
        "Une erreur est survenue lors de l'envoi de l'email. Veuillez réessayer plus tard."
      );
    }
  };

  return (
    <AnimatePresence>
      {showBooking && (
        <motion.div
          className="
         fixed inset-0 z-50 flex items-start justify-center
         pt-10 sm:pt-16 md:pt-20 lg:pt-24
         bg-black/70
       "
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <motion.div
            className="bg-white rounded-lg w-full max-w-md sm:max-w-lg md:max-w-xl lg:max-w-2xl p-6 shadow-lg"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-[#f36f0f]">
                Réserver votre voyage
              </h2>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowBooking(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="h-6 w-6" />
              </Button>
            </div>

            <p className="text-gray-700 mb-4">
              Vous êtes sur le point de réserver le voyage{" "}
              <strong>{trip.titre}</strong> pour {trip.prix}€ par personne.
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-3">
                <Label htmlFor="nom">Nom</Label>
                <Input
                  id="nom"
                  name="nom"
                  value={formData.nom}
                  onChange={handleChange}
                />
                {errors.nom && (
                  <p className="text-sm text-red-500 mt-1">{errors.nom}</p>
                )}
              </div>

              <div className="space-y-3">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                />
                {errors.email && (
                  <p className="text-sm text-red-500 mt-1">{errors.email}</p>
                )}
              </div>

              <div className="space-y-3">
                <Label htmlFor="phone">Téléphone</Label>
                <PhoneInput
                  country="mg"
                  value={formData.phone}
                  onChange={handlePhoneChange}
                  inputClass="w-full bg-[#edf2f7] text-base"
                  inputStyle={{ width: "100%", height: 40 }}
                  placeholder="Entrez votre numéro"
                />
                {errors.phone && (
                  <p className="text-sm text-red-500 mt-1">{errors.phone}</p>
                )}
              </div>

              <div className="space-y-3">
                <Label htmlFor="personnes">Nombre de personnes</Label>
                <Input
                  id="personnes"
                  name="personnes"
                  type="number"
                  min={1}
                  max={trip.passagers}
                  value={formData.personnes}
                  onChange={handleChange}
                />
                {errors.personnes && (
                  <p className="text-sm text-red-500 mt-1">
                    {errors.personnes}
                  </p>
                )}
              </div>

              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-[#f36f0f] to-[#ff8533] text-white font-bold py-3"
              >
                Confirmer la réservation
              </Button>
              <Button
                type="button"
                onClick={() => {
                  setShowBooking(false);
                  setShowErrorModal(false); // ← important pour éviter que l’erreur reste affichée
                }}
                className="w-full bg-white border-[#f36f0f] text-[#f36f0f] font-bold py-3"
              >
                Annuler la réservation
              </Button>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
