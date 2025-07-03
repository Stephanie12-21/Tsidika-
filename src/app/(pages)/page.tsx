"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const images = [
  "/images/anakao1.jpg",
  "/images/morondava2.jpg",
  "/images/tsingy2.jpg",
  "/images/farady2.jpg",
];

export default function ImprovedTravelLanding() {
  const [currentImage, setCurrentImage] = useState(0);
  const [prevImage, setPrevImage] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setPrevImage(currentImage);
      setIsTransitioning(true);
      setTimeout(() => {
        setCurrentImage((prev) => (prev + 1) % images.length);
        setIsTransitioning(false);
      }, 400);
    }, 4000);

    return () => clearInterval(interval);
  }, [currentImage]);

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-orange-50 via-white to-red-50">
      <main className="relative z-10 px-6 lg:px-14 py-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center mt-20 lg:mt-32">
            {/* Colonne gauche */}
            <div className="space-y-8">
              <h1 className="text-5xl lg:text-7xl font-bold leading-tight">
                <span className="bg-gradient-to-r from-gray-900 via-orange-600 to-red-600 bg-clip-text text-transparent">
                  EXPLORER
                </span>
                <div className="flex items-center space-x-4 my-4">
                  <Button className="bg-gradient-to-r from-[#f36f0f] to-red-500 rounded-[200px_150px_150px_0px] w-32 text-white px-8 py-3 shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:scale-110 hover:rotate-2 group">
                    <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform duration-300" />
                  </Button>
                  <div className="hidden lg:flex space-x-2 text-orange-500">
                    <span className="bg-gradient-to-r from-gray-900 via-orange-600 to-red-600 bg-clip-text text-transparent">
                      MADAGASCAR
                    </span>
                  </div>
                </div>
              </h1>

              <p className="text-lg text-gray-600 max-w-lg leading-relaxed">
                Découvrez la beauté unique de Madagascar, ses paysages
                époustouflants, sa faune et sa flore exceptionnelles dans une
                aventure inoubliable.
              </p>

              <div className="mt-16 flex items-start">
                <div className="flex items-center space-x-3 bg-gradient-to-r from-white/80 to-orange-50/80 backdrop-blur-md rounded-full px-6 py-3 border border-orange-200/50 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                  <div className="w-8 h-8 bg-gradient-to-r from-orange-400 to-red-400 rounded-full flex items-center justify-center"></div>
                  <div>
                    <span className="font-semibold text-gray-900 text-sm">
                      Développé par{" "}
                    </span>
                    <Link
                      href="https://stephanie-maminiaina.vercel.app/"
                      className="font-bold text-orange-600 hover:underline hover:cursor-pointer"
                    >
                      Stéphanie MAMINIAINA
                    </Link>
                  </div>
                </div>
              </div>
            </div>

            {/* Colonne droite - diaporama fluide */}
            <div className="relative">
              {/* glow border */}
              <div className="absolute inset-0 bg-gradient-to-r from-orange-400 via-red-400 to-pink-400 rounded-[265px_150px_150px_0px] blur-sm opacity-30" />

              <div className="relative overflow-hidden border-4 border-gradient-to-r from-red-600 to-orange-600 rounded-[265px_150px_150px_0px] w-full max-w-2xl shadow-2xl h-[400px]">
                {/* Image précédente */}
                <motion.img
                  key={`prev-${prevImage}`}
                  src={images[prevImage]}
                  alt="Image précédente"
                  className="w-full h-full object-cover absolute"
                  initial={{ opacity: 1 }}
                  animate={{ opacity: isTransitioning ? 0 : 1 }}
                  transition={{ duration: 1.5, ease: "easeInOut" }}
                />

                {/* Image suivante */}
                <motion.img
                  key={`current-${currentImage}`}
                  src={images[currentImage]}
                  alt="Image actuelle"
                  className="w-full h-full object-cover absolute"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 1.5, ease: "easeInOut" }}
                />
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
