"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

const Unsubscribe: React.FC = () => {
  const router = useRouter();

  useEffect(() => {
    const handleUnsubscribe = async () => {
      const urlSearchParams = new URLSearchParams(window.location.search);
      const token = urlSearchParams.get("token");

      if (!token) return;

      try {
        const response = await fetch(
          `/api/newsletter/desabonnement?token=${token}`,
          {
            method: "GET",
          }
        );

        if (response.ok) {
          setTimeout(() => {
            router.push("/");
          }, 3000);
        } else {
          console.error("Erreur lors du désabonnement");
        }
      } catch (error) {
        console.error(error);
      }
    };

    handleUnsubscribe();
  }, [router]);

  const handleSubmit = () => {
    router.push("/");
  };

  return (
    <div className="flex items-center justify-center h-screen">
      <Card className="relative overflow-hidden backdrop-blur-sm bg-white/90 border border-gray-100 shadow-2xl rounded-2xl">
        <div className="absolute inset-0 bg-gradient-to-br from-red-50 via-white to-blue-50 opacity-50" />

        <CardContent className="relative p-8 space-y-6">
          <div className="flex justify-center">
            <div className="p-4 bg-red-50/50 rounded-full animate-bounce">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                className="w-20 h-20 bg-gradient-to-r from-[#f36f0f] to-orange-400 rounded-full mx-auto flex items-center justify-center"
              >
                <svg
                  className="w-10 h-10 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  ></path>
                </svg>
              </motion.div>
            </div>
          </div>

          <div className="space-y-4 text-center">
            <h2 className="mt-6 text-2xl font-bold text-orange-900">
              Désabonnement confirmé
            </h2>

            <p className="mt-2 text-base text-gray-600">
              Vous n&apos;êtes plus abonné à la newsletter de Tsidika.
            </p>

            <p className="text-sm text-gray-600">
              Redirection automatique dans quelques secondes...
            </p>
          </div>

          <div className="pt-4">
            <Button
              onClick={handleSubmit}
              className="w-full py-2 px-4 bg-gradient-to-r from-[#f36f0f] to-orange-400  text-white font-semibold rounded-lg shadow-md hover:shadow-lg transition-all duration-300 ease-in-out relative overflow-hidden"
            >
              <span className="relative z-10 flex items-center justify-center gap-2 text-lg font-medium">
                Retour à l&apos;accueil
                <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
              </span>
              <div className="absolute inset-0 -z-10 bg-gradient-to-r from-blue-400/0 via-orange-400/30 to-blue-400/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Unsubscribe;
