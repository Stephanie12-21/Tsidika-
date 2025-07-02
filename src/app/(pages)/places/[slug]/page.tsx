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
  Calendar,
  X,
  Check,
  XIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

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
  activités?: {
    [jour: string]: {
      titre: string;
      description: string;
      image: string;
    }[];
  };
  programme?: {
    [jour: string]: {
      titre: string;
      description: string;
      activites: string[];
      repas?: string[];
      hebergement?: string;
    };
  };
  inclus?: string[];
  nonInclus?: string[];
  highlights?: string[];
}

interface Slide {
  id: number;
  title: string;
  subtitle?: string;
  location: string;
  description: string;
  image: string;
  thumbnail: string;
}

// Configuration des chemins possibles pour le fichier JSON
const POSSIBLE_JSON_PATHS = [
  "/data/trips.json",
  "/api/trips.json",
  "/trips.json",
  "/public/data/trips.json",
  "/assets/trips.json",
  "/data/voyages.json",
  "/voyages.json",
];

export default function TripPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const unwrappedParams = use(params);
  const slug = unwrappedParams.slug || "rio-de-janeiro";
  const [trip, setTrip] = useState<Trip | null>(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [slides, setSlides] = useState<Slide[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showDetails, setShowDetails] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState(
    "Chargement de votre aventure..."
  );

  useEffect(() => {
    const fetchTrip = async () => {
      let trips: Trip[] = [];
      let dataLoaded = false;

      // Essayer de charger depuis différents emplacements
      for (const path of POSSIBLE_JSON_PATHS) {
        try {
          setLoadingMessage(`Recherche des données dans ${path}...`);
          const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "";
          const fullPath = baseUrl + path;

          const res = await fetch(fullPath, {
            cache: "no-store",
            headers: {
              "Content-Type": "application/json",
            },
          });

          if (res.ok) {
            const data = await res.json();
            trips = Array.isArray(data)
              ? data
              : data.trips || data.voyages || [];
            dataLoaded = true;
            break;
          }
        } catch {
          continue;
        }
      }

      // Si aucun fichier JSON n'a été trouvé, utiliser les données de fallback
      if (!dataLoaded) {
        setLoadingMessage("Utilisation des données de démonstration...");
      }

      // Trouver le voyage correspondant au slug
      const foundTrip = trips.find((t) => t.slug === slug);

      if (!foundTrip && trips.length > 0) {
        const defaultTrip = trips[0];
        setTrip(defaultTrip);
        createSlides(defaultTrip);
      } else if (foundTrip) {
        setTrip(foundTrip);
        createSlides(foundTrip);
      } else {
        setTrip(null);
        setSlides([]);
      }

      setIsLoading(false);
    };

    const createSlides = (foundTrip: Trip) => {
      const images = foundTrip.images?.length
        ? foundTrip.images
        : [foundTrip.image];

      const slidesWithDescriptions = images.map((img, idx) => {
        let activityDescription = foundTrip.description;
        let activityTitle: string | undefined = undefined;

        if (foundTrip.activités) {
          for (const [, activitésDuJour] of Object.entries(
            foundTrip.activités
          )) {
            const activité = activitésDuJour.find((act) => act.image === img);
            if (activité) {
              activityDescription = activité.description;
              activityTitle = activité.titre;
              break;
            }
          }
        }

        return {
          id: idx,
          title: foundTrip.titre,
          subtitle: activityTitle,
          location: foundTrip.localisation,
          description: activityDescription,
          image: img,
          thumbnail: img,
        };
      });

      setSlides(slidesWithDescriptions);
    };

    fetchTrip();
  }, [slug]);

  // Fermer le panneau de détails en cliquant en dehors
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (showDetails) {
        const target = event.target as HTMLElement;
        // Vérifier si le clic est sur le backdrop
        if (target.classList.contains("details-backdrop")) {
          setShowDetails(false);
        }
      }
    };

    if (showDetails) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showDetails]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-orange-900/20 to-slate-900 p-4">
        <motion.div
          className="text-center w-full max-w-sm"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <motion.div
            className="w-16 h-16 border-4 border-[#f36f0f] border-t-transparent rounded-full mx-auto mb-6"
            animate={{ rotate: 360 }}
            transition={{
              duration: 1,
              repeat: Number.POSITIVE_INFINITY,
              ease: "linear",
            }}
          />
          <motion.p
            className="text-white font-semibold text-lg mb-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            {loadingMessage}
          </motion.p>
          <motion.p
            className="text-gray-400 text-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            Recherche dans les emplacements possibles...
          </motion.p>
        </motion.div>
      </div>
    );
  }

  if (!trip || slides.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 to-slate-800 p-4">
        <div className="text-center text-white w-full max-w-md">
          <h1 className="text-2xl font-bold mb-4">Voyage non trouvé</h1>
          <p className="text-gray-300 mb-4">Le voyage demandé nexiste pas.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen overflow-hidden ">
      {/* Background Image Slide */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentSlide}
          className="absolute inset-0 z-0"
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 1.05 }}
          transition={{ duration: 1, ease: "easeInOut" }}
        >
          <div
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{
              backgroundImage: `url(${slides[currentSlide].image})`,
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/30" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-transparent to-black/20" />
        </motion.div>
      </AnimatePresence>

      {/* Content Container */}
      <div className="relative z-10 min-h-screen flex flex-col  mb-2">
        {/* Main Content */}
        <div className="flex-1 flex items-center p-4">
          <div className="w-full max-w-7xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              {/* Left: Trip Info */}
              <motion.div
                key={currentSlide}
                initial={{ opacity: 0, x: -60 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="space-y-6"
              >
                <div className="space-y-4">
                  <motion.div
                    className="flex items-center space-x-3"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.3 }}
                  >
                    <MapPin className="h-5 w-5 text-[#f36f0f] flex-shrink-0" />
                    <span className="text-lg font-medium text-orange-200">
                      {slides[currentSlide].location}
                    </span>
                  </motion.div>

                  <motion.h1
                    className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold leading-tight bg-gradient-to-r from-white via-orange-100 to-orange-200 bg-clip-text text-transparent"
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.4 }}
                  >
                    {slides[currentSlide].title}
                  </motion.h1>

                  {slides[currentSlide].subtitle && (
                    <motion.h2
                      className="text-xl md:text-2xl font-semibold text-[#f36f0f] bg-gradient-to-r from-[#f36f0f] to-[#ff8533] bg-clip-text "
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: 0.5 }}
                    >
                      {slides[currentSlide].subtitle}
                    </motion.h2>
                  )}
                </div>

                <motion.p
                  className="text-lg md:text-xl leading-relaxed text-gray-200 max-w-2xl"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.6 }}
                >
                  {slides[currentSlide].description}
                </motion.p>

                {/* Quick Stats */}
                <motion.div
                  className="flex flex-wrap gap-4"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.7 }}
                >
                  <div className="flex items-center space-x-2 bg-white/10 backdrop-blur-md rounded-full px-4 py-2 border border-white/20">
                    <Star className="h-4 w-4 text-yellow-400 fill-yellow-400 flex-shrink-0" />
                    <span className="font-semibold">{trip.note}/5</span>
                  </div>
                  <div className="flex items-center space-x-2 bg-white/10 backdrop-blur-md rounded-full px-4 py-2 border border-white/20">
                    <Clock className="h-4 w-4 text-blue-400 flex-shrink-0" />
                    <span className="font-semibold">{trip.durée} jours</span>
                  </div>
                  <div className="flex items-center space-x-2 bg-white/10 backdrop-blur-md rounded-full px-4 py-2 border border-white/20">
                    <Users className="h-4 w-4 text-green-400 flex-shrink-0" />
                    <span className="font-semibold">
                      {trip.passagers} pers.
                    </span>
                  </div>
                </motion.div>
              </motion.div>

              {/* Right: Enhanced Card - Desktop & Tablet */}
              <motion.div
                initial={{ opacity: 0, x: 60 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.5 }}
                className="hidden md:flex justify-center md:justify-end"
              >
                <Card className="bg-white/5 backdrop-blur-xl border border-white/10 text-white w-full max-w-md shadow-2xl shadow-black/50 overflow-hidden">
                  <CardContent className="p-0">
                    {/* Card Header */}
                    <div className="bg-gradient-to-r from-[#f36f0f] to-[#ff8533] p-6">
                      <div className="flex items-center justify-between">
                        <h3 className="text-xl font-bold">Réservation</h3>
                        <div className="text-right">
                          <div className="text-3xl font-bold">{trip.prix}€</div>
                          <div className="text-sm opacity-90">par personne</div>
                        </div>
                      </div>
                    </div>

                    {/* Card Content */}
                    <div className="p-6 space-y-6">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <div className="flex items-center space-x-2 text-gray-300">
                            <Calendar className="h-4 w-4 text-[#f36f0f]" />
                            <span className="text-sm">Durée</span>
                          </div>
                          <p className="font-semibold text-lg">
                            {trip.durée} jours
                          </p>
                        </div>
                        <div className="space-y-2">
                          <div className="flex items-center space-x-2 text-gray-300">
                            <Users className="h-4 w-4 text-[#f36f0f]" />
                            <span className="text-sm">Groupe</span>
                          </div>
                          <p className="font-semibold text-lg">
                            {trip.passagers} pers.
                          </p>
                        </div>
                      </div>

                      <div className="space-y-3">
                        <Button className="w-full bg-gradient-to-r from-[#f36f0f] to-[#ff8533] hover:from-[#e55a00] hover:to-[#e6661a] text-white font-bold py-4 text-lg shadow-lg shadow-[#f36f0f]/30 transition-all duration-300 hover:shadow-xl hover:shadow-[#f36f0f]/40 group">
                          Réserver maintenant
                        </Button>
                        <Button
                          variant="outline"
                          onClick={() => setShowDetails(!showDetails)}
                          className="w-full border-white/20 text-white hover:bg-white/10 py-3 bg-transparent"
                        >
                          Voir le programme détaillé
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </div>
        </div>

        {/* Navigation Container - Moved Lower */}
        <div className="pb-12">
          {/* Enhanced Navigation */}
          {slides.length > 1 && (
            <motion.div
              className="absolute bottom-1 left-1/2 transform -translate-x-1/2 z-20 "
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.8 }}
            >
              <div className="flex items-center space-x-6 mt-28 rounded-full p-4 ">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={prevSlide}
                  className="h-12 w-12 rounded-full bg-white/10 text-white backdrop-blur-sm hover:bg-[#f36f0f]/80 border border-white/20 hover:border-[#f36f0f] transition-all duration-300 group"
                >
                  <ChevronLeft className="h-6 w-6 group-hover:-translate-x-0.5 transition-transform" />
                </Button>

                <div className="flex space-x-3">
                  {slides.map((slide, index) => (
                    <motion.button
                      key={slide.id}
                      onClick={() => goToSlide(index)}
                      className={`relative overflow-hidden rounded-xl transition-all duration-300 border-2 ${
                        index === currentSlide
                          ? "border-[#f36f0f] shadow-lg shadow-[#f36f0f]/50 scale-110"
                          : "border-white/20 opacity-70 hover:opacity-100 hover:border-white/40"
                      }`}
                      whileHover={{
                        scale: index === currentSlide ? 1.1 : 1.05,
                      }}
                      whileTap={{ scale: 0.95 }}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{
                        opacity: 1,
                        scale: index === currentSlide ? 1.1 : 1,
                      }}
                      transition={{ duration: 0.3 }}
                    >
                      <div
                        className="h-16 w-24 bg-cover bg-center"
                        style={{
                          backgroundImage: `url(${slide.thumbnail})`,
                        }}
                      />
                      {index === currentSlide && (
                        <motion.div
                          className="absolute inset-0 bg-gradient-to-t from-[#f36f0f]/30 to-transparent"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ duration: 0.3 }}
                        />
                      )}
                    </motion.button>
                  ))}
                </div>

                <Button
                  variant="ghost"
                  size="icon"
                  onClick={nextSlide}
                  className="h-12 w-12 rounded-full bg-white/10 text-white backdrop-blur-sm hover:bg-[#f36f0f]/80 border border-white/20 hover:border-[#f36f0f] transition-all duration-300 group"
                >
                  <ChevronRight className="h-6 w-6 group-hover:translate-x-0.5 transition-transform" />
                </Button>
              </div>
            </motion.div>
          )}
        </div>
      </div>

      {/* Details Panel */}
      <AnimatePresence>
        {showDetails && (
          <motion.div
            className="fixed inset-0 z-40 mt-10"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="relative min-h-screen flex items-center justify-center p-4">
              <motion.div
                className="bg-white rounded-lg border-2 border-[#f36f0f] w-full max-w-4xl max-h-[90vh] shadow-2xl"
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                <div className="flex justify-between items-center p-6 border-b bg-gradient-to-r from-[#f36f0f] to-[#ff8533] text-white">
                  <h2 className="text-2xl font-bold">
                    Programme détaillé - {trip.titre}
                  </h2>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setShowDetails(false)}
                    className="text-white hover:bg-white/20"
                  >
                    <X className="h-6 w-6" />
                  </Button>
                </div>

                <div className="overflow-x-hidden rounded-lg h-[400px]">
                  <Tabs defaultValue="programme" className="w-full">
                    <TabsList className="grid w-full grid-cols-3 m-4">
                      <TabsTrigger value="programme">Programme</TabsTrigger>
                      <TabsTrigger value="inclus">Inclus</TabsTrigger>
                      <TabsTrigger value="non-inclus">Non inclus</TabsTrigger>
                    </TabsList>

                    <TabsContent
                      value="programme"
                      className="p-6 space-y-6 h-[400px] overflow-x-hidden overflow-y-auto"
                    >
                      {trip.programme &&
                        Object.entries(trip.programme).map(
                          ([jour, details]) => (
                            <Card key={jour}>
                              <CardHeader className="pt-2">
                                <CardTitle className="text-[#f36f0f] flex items-center justify-between">
                                  <span className="text-lg font-semibold">
                                    {jour}: {details.titre}
                                  </span>
                                  {details.hebergement && (
                                    <Badge
                                      variant="secondary"
                                      className="bg-orange-200 text-orange-800"
                                    >
                                      {details.hebergement}
                                    </Badge>
                                  )}
                                </CardTitle>
                              </CardHeader>
                              <CardContent className="px-6">
                                <p className="text-gray-600 mb-4">
                                  {details.description}
                                </p>

                                <div className="space-y-4">
                                  <div>
                                    <h4 className="font-semibold text-gray-800 mb-2">
                                      Activités :
                                    </h4>
                                    <ul className="space-y-1">
                                      {details.activites.map(
                                        (activite, index) => (
                                          <li
                                            key={index}
                                            className="flex items-start space-x-2"
                                          >
                                            <Check className="h-4 w-4 text-[#f36f0f] mt-0.5 flex-shrink-0" />
                                            <span className="text-sm text-gray-600">
                                              {activite}
                                            </span>
                                          </li>
                                        )
                                      )}
                                    </ul>
                                  </div>

                                  {details.repas &&
                                    details.repas.length > 0 && (
                                      <div>
                                        <h4 className="font-semibold text-gray-800">
                                          Repas inclus :
                                        </h4>
                                        <div className="flex flex-wrap gap-2 mt-2 pb-8">
                                          {details.repas.map((repas, index) => (
                                            <Badge
                                              key={index}
                                              variant="outline"
                                              className="border-[#f36f0f] text-[#f36f0f]"
                                            >
                                              {repas}
                                            </Badge>
                                          ))}
                                        </div>
                                      </div>
                                    )}
                                </div>
                              </CardContent>
                            </Card>
                          )
                        )}
                    </TabsContent>

                    <TabsContent
                      value="inclus"
                      className="p-6 h-[400px] overflow-x-hidden overflow-y-auto"
                    >
                      <Card>
                        <CardHeader className="pt-2">
                          <CardTitle className="text-[#f36f0f] flex items-center text-lg font-semibold">
                            <Check className="h-5 w-5 mr-2" />
                            Inclus dans le prix
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <ul className="space-y-3 pb-4">
                            {trip.inclus?.map((item, index) => (
                              <li
                                key={index}
                                className="flex items-start space-x-3"
                              >
                                <Check className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                                <span className="text-gray-700">{item}</span>
                              </li>
                            ))}
                          </ul>
                        </CardContent>
                      </Card>
                    </TabsContent>

                    <TabsContent
                      value="non-inclus"
                      className="p-6 h-[400px] overflow-x-hidden overflow-y-auto"
                    >
                      <Card>
                        <CardHeader className="pt-2">
                          <CardTitle className="text-red-600 flex items-center">
                            <XIcon className="h-5 w-5 mr-2" />
                            Non inclus dans le prix
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <ul className="space-y-3 pb-4">
                            {trip.nonInclus?.map((item, index) => (
                              <li
                                key={index}
                                className="flex items-start space-x-3"
                              >
                                <XIcon className="h-5 w-5 text-red-500 mt-0.5 flex-shrink-0" />
                                <span className="text-gray-700">{item}</span>
                              </li>
                            ))}
                          </ul>
                        </CardContent>
                      </Card>
                    </TabsContent>
                  </Tabs>
                </div>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
