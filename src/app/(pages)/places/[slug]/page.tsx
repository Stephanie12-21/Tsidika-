"use client";

import { useState, useEffect, use } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronLeft,
  ChevronRight,
  MapPin,
  Star,
  Users,
  Clock,
  Euro,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { notFound } from "next/navigation";

interface Trip {
  id: number;
  slug: string;
  titre: string;
  description: string;
  image: string;
  images?: string[];
  prix: number;
  durée: number;
  note: number;
  passagers: number;
  localisation: string;
}

interface Slide {
  id: number;
  title: string;
  location: string;
  description: string;
  image: string;
  thumbnail: string;
}

export default function TripPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const unwrappedParams = use(params);
  const slug = unwrappedParams.slug;

  const [trip, setTrip] = useState<Trip | null>(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [slides, setSlides] = useState<Slide[]>([]);

  useEffect(() => {
    const fetchTrip = async () => {
      const baseUrl =
        process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
      const res = await fetch(`${baseUrl}/data/trips.json`, {
        cache: "no-store",
      });

      if (!res.ok) throw new Error("Impossible de charger les données");

      const trips: Trip[] = await res.json();
      const foundTrip = trips.find((t) => t.slug === slug);

      if (!foundTrip) {
        notFound();
        return;
      }

      setTrip(foundTrip);

      const tripSlides =
        foundTrip.images && foundTrip.images.length > 0
          ? foundTrip.images.map((img, idx) => ({
              id: idx,
              title: foundTrip.titre,
              location: foundTrip.localisation,
              description: foundTrip.description,
              image: img,
              thumbnail: img,
            }))
          : [
              {
                id: 0,
                title: foundTrip.titre,
                location: foundTrip.localisation,
                description: foundTrip.description,
                image: foundTrip.image,
                thumbnail: foundTrip.image,
              },
            ];

      setSlides(tripSlides);
    };

    fetchTrip();
  }, [slug]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  if (!trip || slides.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 to-orange-100">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#f36f0f] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-[#f36f0f] font-semibold">Chargement...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen overflow-hidden">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentSlide}
          className="absolute inset-0 z-0"
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
        >
          <div
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{
              backgroundImage: `url(${slides[currentSlide].image})`,
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-black/20" />
        </motion.div>
      </AnimatePresence>

      {/* Content Overlay */}
      <div className="relative z-10 flex min-h-screen flex-col justify-between p-6 text-white">
        {/* Main Content */}
        <div className="flex-1 flex items-center justify-center">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl w-full">
            {/* Left Side - Trip Info */}
            <motion.div
              key={currentSlide}
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="space-y-6"
            >
              <motion.h1
                className="text-4xl font-bold md:text-5xl lg:text-6xl"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
              >
                {slides[currentSlide].title}
              </motion.h1>

              <motion.div
                className="flex items-center space-x-2 text-lg"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                <MapPin className="h-5 w-5 text-[#f36f0f]" />
                <span>{slides[currentSlide].location}</span>
              </motion.div>

              <motion.p
                className="text-lg leading-relaxed text-white/90"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.5 }}
              >
                {slides[currentSlide].description}
              </motion.p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="flex items-center justify-center"
            >
              <Card className="bg-white/10 backdrop-blur-md border-[#f36f0f]/30 text-white max-w-md w-full shadow-xl shadow-[#f36f0f]/10">
                <CardContent className="p-6 space-y-4">
                  <h3 className="text-xl font-semibold mb-4 text-[#f36f0f]">
                    Détails du voyage
                  </h3>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center space-x-2">
                      <Euro className="h-4 w-4 text-[#f36f0f]" />
                      <div>
                        <p className="font-semibold">{trip.prix} €</p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Clock className="h-4 w-4 text-[#f36f0f]" />
                      <div>
                        <p className="font-semibold">{trip.durée} jours</p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Star className="h-4 w-4 text-[#f36f0f]" />
                      <div>
                        <p className="font-semibold">{trip.note}/5</p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Users className="h-4 w-4 text-[#f36f0f]" />
                      <div>
                        <p className="font-semibold">{trip.passagers}</p>
                      </div>
                    </div>
                  </div>

                  <Button className="w-full mt-6 bg-gradient-to-r from-[#f36f0f] to-[#e55a00] hover:from-[#e55a00] hover:to-[#d64500] text-white font-semibold shadow-lg shadow-[#f36f0f]/30 transition-all duration-300 hover:shadow-xl hover:shadow-[#f36f0f]/40">
                    Réserver maintenant
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>

        {/* Bottom Navigation */}
        {slides.length > 1 && (
          <div className="flex items-center justify-start space-x-8">
            {/* Previous Button */}
            <Button
              variant="ghost"
              size="icon"
              onClick={prevSlide}
              className="h-12 w-12 rounded-full bg-[#f36f0f]/20 text-white backdrop-blur-sm hover:bg-[#f36f0f]/30 border border-[#f36f0f]/30 hover:border-[#f36f0f]/50 transition-all duration-300"
            >
              <ChevronLeft className="h-6 w-6" />
            </Button>

            {/* Thumbnail Slider - Positioned center-left */}
            <div className="flex space-x-4 overflow-hidden">
              {slides.map((slide, index) => (
                <motion.button
                  key={slide.id}
                  onClick={() => goToSlide(index)}
                  className={`relative overflow-hidden rounded-lg transition-all duration-300 ${
                    index === currentSlide
                      ? "  scale-110 shadow-lg shadow-[#f36f0f]/50"
                      : "opacity-70 hover:opacity-100 "
                  }`}
                  whileHover={{ scale: index === currentSlide ? 1.1 : 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <div
                    className="h-20 w-32 bg-cover bg-center"
                    style={{
                      backgroundImage: `url(${slide.thumbnail})`,
                    }}
                  />
                  {index === currentSlide && (
                    <motion.div
                      className="absolute inset-0 rounded-lg shadow-inner"
                      layoutId="activeSlide"
                      transition={{ duration: 0.3 }}
                    />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#f36f0f]/20 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300" />
                </motion.button>
              ))}
            </div>

            {/* Next Button */}
            <Button
              variant="ghost"
              size="icon"
              onClick={nextSlide}
              className="h-12 w-12 rounded-full bg-[#f36f0f]/20 text-white backdrop-blur-sm hover:bg-[#f36f0f]/30 border border-[#f36f0f]/30 hover:border-[#f36f0f]/50 transition-all duration-300"
            >
              <ChevronRight className="h-6 w-6" />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
