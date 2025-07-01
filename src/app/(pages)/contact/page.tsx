"use client";

import { useState } from "react";
import SuccessModal from "@/app/(modal)/SuccessModal";
import ErrorModal from "@/app/(modal)/ErrorModal";
import InfoModal from "@/app/(modal)/InfoModal";
import ContactDetails from "@/components/sections/sections/contactdetails";
import ContactForm from "@/components/sections/sections/contactform";

export default function ContactPage() {
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [showInfoModal, setShowInfoModal] = useState(false);
  const [modalTitle, setModalTitle] = useState("");
  const [modalMessage, setModalMessage] = useState("");

  const handleSuccess = (title: string, message: string) => {
    setModalTitle(title);
    setModalMessage(message);
    setShowSuccessModal(true);
  };

  const handleError = (title: string, message: string) => {
    setModalTitle(title);
    setModalMessage(message);
    setShowErrorModal(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-red-50 to-yellow-50 py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12 mt-24">
          <h1 className="text-3xl md:text-4xl font-bold text-[#1d1818] mb-4">
            Besoin d&apos;informations supplémentaires ?
          </h1>
          <h2 className="text-2xl md:text-3xl font-bold text-[#F36F0F]">
            N&apos;hésitez pas à nous contacter
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <ContactForm onSuccess={handleSuccess} onError={handleError} />
          <ContactDetails />
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
}
