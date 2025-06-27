"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import {
  Mail,
  Phone,
  MapPin,
  Facebook,
  Linkedin,
  Instagram,
  Globe,
} from "lucide-react";
import { FaWhatsapp } from "react-icons/fa";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";

import SuccessModal from "@/app/(modal)/SuccessModal";
import ErrorModal from "@/app/(modal)/ErrorModal";
import InfoModal from "@/app/(modal)/InfoModal";

const inputFocusClasses =
  "border-gray-200 focus:border-[#F36F0F] focus:ring-[#F36F0F] transition-all duration-300 bg-[#FFFFFF]";
const iconButtonClasses =
  "w-10 h-10 bg-[#F36F0F] rounded-full flex items-center justify-center hover:bg-[#E55A00] cursor-pointer transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-110";

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

const ContactPage: React.FC = () => {
  const [nom, setNom] = useState("");
  const [prenom, setPrenom] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [object, setObject] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [showInfoModal, setShowInfoModal] = useState(false);
  const [modalTitle, setModalTitle] = useState("");
  const [modalMessage, setModalMessage] = useState("");

  const resetForm = () => {
    setNom("");
    setPrenom("");
    setEmail("");
    setPhone("");
    setObject("");
    setMessage("");
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    const Phone = `+${phone}`;
    const data = { nom, prenom, email, Phone, object, message };

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result?.message || "Erreur lors de l'envoi du formulaire"
        );
      }

      // Si tout s'est bien passé
      setModalTitle("Message envoyé avec succès !");
      setModalMessage(
        "Merci de nous avoir contactés. Nous vous répondrons rapidement."
      );
      setShowSuccessModal(true);
      resetForm();
    } catch (error) {
      setModalTitle("Erreur");
      setModalMessage(
        (error as Error).message || "Une erreur inconnue s’est produite."
      );
      setShowErrorModal(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-red-50 to-yellow-50 py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold text-[#1d1818] mb-4">
            Besoin d&apos;informations supplémentaires ?
          </h1>
          <h2 className="text-2xl md:text-3xl font-bold text-[#F36F0F]">
            N&apos;hésitez pas à nous contacter
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* Formulaire de contact */}
          <div className="lg:col-span-3">
            <Card className="border-0 shadow-xl bg-white">
              <CardContent className="p-8">
                <form className="space-y-6" onSubmit={handleSubmit}>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label
                        htmlFor="nom"
                        className="text-[#1C1817] font-medium"
                      >
                        Nom
                      </Label>
                      <Input
                        id="nom"
                        name="nom"
                        placeholder="Votre nom ici..."
                        className={`h-12 ${inputFocusClasses}`}
                        value={nom}
                        onChange={(e) => setNom(e.target.value)}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label
                        htmlFor="prenom"
                        className="text-[#1C1817] font-medium"
                      >
                        Prénom
                      </Label>
                      <Input
                        id="prenom"
                        name="prenom"
                        placeholder="Votre prénom ici..."
                        className={`h-12 ${inputFocusClasses}`}
                        value={prenom}
                        onChange={(e) => setPrenom(e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label
                      htmlFor="email"
                      className="text-[#1C1817] font-medium"
                    >
                      Email
                    </Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="Votre adresse email ici..."
                      className={`h-12 ${inputFocusClasses}`}
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label
                      htmlFor="phone"
                      className="text-[#1C1817] font-medium"
                    >
                      Numéro de téléphone
                    </Label>
                    <PhoneInput
                      country="mg"
                      value={phone}
                      onChange={setPhone}
                      placeholder="Entrez votre numéro"
                      inputStyle={{ width: "100%", height: 40 }}
                      buttonClass="custom-flag-style"
                      inputClass={`w-full bg-[#edf2f7] text-base text-[#1C1817] font-medium ${inputFocusClasses}`}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label
                      htmlFor="object"
                      className="text-[#1C1817] font-medium"
                    >
                      Objet du message
                    </Label>
                    <Input
                      id="object"
                      name="object"
                      type="text"
                      placeholder="L'objet ici..."
                      className={`h-12 ${inputFocusClasses}`}
                      value={object}
                      onChange={(e) => setObject(e.target.value)}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label
                      htmlFor="message"
                      className="text-[#1C1817] font-medium"
                    >
                      Message
                    </Label>
                    <Textarea
                      id="message"
                      name="message"
                      placeholder="Saisissez votre message ici..."
                      className={`min-h-[150px] resize-none ${inputFocusClasses}`}
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      required
                    />
                  </div>

                  <div className="space-y-4">
                    <div className="flex justify-end w-full gap-4">
                      <Button
                        onClick={resetForm}
                        type="button"
                        variant="outline"
                        className="border-2 border-gray-300 h-10 text-gray-600 hover:border-[#F36F0F] hover:text-[#F36F0F] hover:bg-[#F36F0F]/5 px-8 py-3 rounded-xl font-semibold transition-all duration-300 group order-2 sm:order-1 bg-transparent"
                        disabled={isSubmitting}
                      >
                        Annuler
                      </Button>
                      <Button
                        type="submit"
                        disabled={isSubmitting}
                        className="h-10 bg-gradient-to-r from-[#F36F0F] to-[#E55A00] hover:from-[#E55A00] hover:to-[#D44A00] text-white px-8 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 group relative overflow-hidden order-1 sm:order-2"
                      >
                        <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity duration-300" />
                        <span className="relative flex items-center">
                          {isSubmitting ? (
                            <>
                              <div className="w-5 h-5 mr-2 border-2 border-white border-t-transparent rounded-full animate-spin" />
                              Envoi en cours...
                            </>
                          ) : (
                            <>Envoyer le message</>
                          )}
                        </span>
                      </Button>
                    </div>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Infos de contact */}
          <div className="lg:col-span-2">
            <Card className="bg-[#1C1817] text-white border-0 shadow-xl h-full">
              <CardContent className="p-8 space-y-8">
                <section>
                  <h3 className="text-2xl font-bold mb-4">Adresse</h3>
                  <div className="flex items-start space-x-3">
                    <MapPin className="h-5 w-5 text-[#F36F0F] mt-1 flex-shrink-0" />
                    <p className="text-[#F4F3EC]">Toliara Centre</p>
                  </div>
                  <div className="flex items-start space-x-3 mt-4">
                    <MapPin className="h-5 w-5 text-[#F36F0F] mt-1 flex-shrink-0" />
                    <p className="text-[#F4F3EC]">Tuléar 601, Madagascar</p>
                  </div>
                </section>

                <section>
                  <h3 className="text-2xl font-bold mb-4">Contact</h3>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3">
                      <Phone className="h-5 w-5 text-[#F36F0F]" />
                      <a
                        href="tel:+261325427839"
                        className="text-[#F4F3EC] hover:underline"
                      >
                        +(261) 32 54 278 39
                      </a>
                    </div>
                    <div className="flex items-center space-x-3">
                      <FaWhatsapp className="h-5 w-5 text-[#F36F0F]" />
                      <a
                        href="https://wa.me/261381182627"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[#F4F3EC] hover:underline"
                      >
                        +(261) 38 11 826 27
                      </a>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Mail className="h-5 w-5 text-[#F36F0F]" />
                      <a
                        href="mailto:stephaniepageot42@gmail.com"
                        className="text-[#F4F3EC] hover:underline"
                      >
                        stephaniepageot42@gmail.com
                      </a>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Globe className="h-5 w-5 text-[#F36F0F]" />
                      <a
                        href="https://stephanie-maminiaina.vercel.app/"
                        className="text-[#F4F3EC] hover:underline"
                      >
                        Portfolio de la développeuse
                      </a>
                    </div>
                  </div>
                </section>

                <section>
                  <h3 className="text-2xl font-bold mb-4">Restez connecté</h3>
                  <div className="flex space-x-3">
                    {socialIcons.map(({ Icon, label, href }) => (
                      <a
                        key={label}
                        href={href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={iconButtonClasses}
                        aria-label={label}
                        title={label}
                      >
                        <Icon className="h-5 w-5 text-white" />
                      </a>
                    ))}
                  </div>
                </section>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      <SuccessModal
        open={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
        title={modalTitle}
        message={modalMessage}
      />

      <ErrorModal
        open={showErrorModal}
        onClose={() => setShowErrorModal(false)}
        title={modalTitle}
        message={modalMessage}
      />

      <InfoModal
        open={showInfoModal}
        onClose={() => setShowInfoModal(false)}
        title={modalTitle}
        message={modalMessage}
      />
    </div>
  );
};

export default ContactPage;
