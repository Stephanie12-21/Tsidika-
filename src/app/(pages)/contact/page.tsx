"use client";

import { useState } from "react";
import SuccessModal from "@/app/(modal)/SuccessModal";
import ErrorModal from "@/app/(modal)/ErrorModal";
import InfoModal from "@/app/(modal)/InfoModal";
import ContactDetails from "@/components/sections/sections/contactdetails";
import ContactForm from "@/components/sections/sections/contactform";

type ModalType = "success" | "error" | "info" | null;

export default function ContactPage() {
  const [modalType, setModalType] = useState<ModalType>(null);
  const [modalTitle, setModalTitle] = useState("");
  const [modalMessage, setModalMessage] = useState("");

  const showModal = (type: ModalType, title: string, message: string) => {
    setModalType(type);
    setModalTitle(title);
    setModalMessage(message);
  };

  const closeModal = () => {
    setModalType(null);
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
          <ContactForm
            onSuccess={(title, message) => showModal("success", title, message)}
            onError={(title, message) => showModal("error", title, message)}
          />
          <ContactDetails />
        </div>
      </div>

      {modalType === "success" && (
        <SuccessModal
          open
          onClose={closeModal}
          title={modalTitle}
          message={modalMessage}
        />
      )}
      {modalType === "error" && (
        <ErrorModal
          open
          onClose={closeModal}
          title={modalTitle}
          message={modalMessage}
        />
      )}
      {modalType === "info" && (
        <InfoModal
          open
          onClose={closeModal}
          title={modalTitle}
          message={modalMessage}
        />
      )}
    </div>
  );
}
