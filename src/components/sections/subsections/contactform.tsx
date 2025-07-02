"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { z } from "zod";

interface ContactFormProps {
  onSuccess: (title: string, message: string) => void;
  onError: (title: string, message: string) => void;
}

const inputFocusClasses =
  "border-gray-200 focus:border-[#F36F0F] focus:ring-[#F36F0F] transition-all duration-300 bg-[#FFFFFF]";

const contactSchema = z.object({
  nom: z.string().min(2, "Le nom est requis."),
  prenom: z.string().min(2, "Le prénom est requis."),
  email: z
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
      { message: "Domaine email non autorisé." }
    ),
  phone: z.string().min(5, "Numéro de téléphone requis."),
  object: z.string().min(2, "Objet requis."),
  message: z.string().min(5, "Message requis."),
});

export default function ContactForm({ onSuccess, onError }: ContactFormProps) {
  const [nom, setNom] = useState("");
  const [prenom, setPrenom] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [object, setObject] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const resetForm = () => {
    setNom("");
    setPrenom("");
    setEmail("");
    setPhone("");
    setObject("");
    setMessage("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const validation = contactSchema.safeParse({
      nom,
      prenom,
      email,
      phone,
      object,
      message,
    });

    if (!validation.success) {
      const firstError = validation.error.issues[0];
      onError("Erreur de validation", firstError.message);
      setIsSubmitting(false);
      return;
    }

    const data = {
      nom,
      prenom,
      email,
      Phone: `+${phone}`,
      object,
      message,
    };

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result?.message || "Erreur lors de l'envoi");
      }

      onSuccess(
        "Message envoyé avec succès !",
        "Merci de nous avoir contactés. Nous vous répondrons rapidement."
      );
      resetForm();
    } catch (error) {
      onError("Erreur", (error as Error).message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="border-0 shadow-xl bg-white h-full">
      <CardContent className="p-8">
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="nom">Nom</Label>
              <Input
                id="nom"
                value={nom}
                onChange={(e) => setNom(e.target.value)}
                placeholder="Votre nom ici..."
                className={`h-12 ${inputFocusClasses}`}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="prenom">Prénom</Label>
              <Input
                id="prenom"
                value={prenom}
                onChange={(e) => setPrenom(e.target.value)}
                placeholder="Votre prénom ici..."
                className={`h-12 ${inputFocusClasses}`}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Votre adresse email ici..."
              className={`h-12 ${inputFocusClasses}`}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">Téléphone</Label>
            <PhoneInput
              country="mg"
              value={phone}
              onChange={setPhone}
              inputClass={`w-full bg-[#edf2f7] text-base ${inputFocusClasses}`}
              inputStyle={{ width: "100%", height: 40 }}
              placeholder="Entrez votre numéro"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="object">Objet</Label>
            <Input
              id="object"
              value={object}
              onChange={(e) => setObject(e.target.value)}
              placeholder="L'objet ici..."
              className={`h-12 ${inputFocusClasses}`}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="message">Message</Label>
            <Textarea
              id="message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Votre message ici..."
              className={`min-h-[150px] resize-none ${inputFocusClasses}`}
            />
          </div>

          <div className="flex justify-end gap-4">
            <Button
              type="button"
              onClick={resetForm}
              variant="outline"
              className="h-10 px-8 border-[#F36F0F] text-[#F36F0F] hover:bg-[#F36F0F]/10 transition-colors duration-300"
              disabled={isSubmitting}
            >
              Annuler
            </Button>
            <Button
              type="submit"
              className="h-10 px-8 bg-[#F36F0F] text-white hover:bg-[#E55A00] transition-colors duration-300"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Envoi en cours..." : "Envoyer le message"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
