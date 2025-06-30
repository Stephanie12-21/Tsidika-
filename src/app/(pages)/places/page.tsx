"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Search, MapPin, Clock, Star } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";

interface Trip {
  id: number;
  slug: string;
  titre: string;
  prix: number;
  image: string;
  description: string;
  passagers: number;
  durée: number;
  note: number;
  localisation: string;
}

const Places = () => {
  const router = useRouter();
  const [trips, setTrips] = useState<Trip[]>([]);
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);

  // Charger les données depuis le fichier JSON (dans public/data/trips.json)
  useEffect(() => {
    fetch("/data/trips.json")
      .then((res) => res.json())
      .then((data) => setTrips(data))
      .catch((error) => console.error("Erreur chargement trips :", error));
  }, []);

  // Pour l’instant on ne filtre pas, on affiche tout
  const filteredTrips = trips;

  return (
    <div className="min-h-screen  p-4 md:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
            Découvrez nos destinations
          </h1>
          <p className="text-gray-600 text-lg">
            Trouvez votre prochaine aventure parmi nos voyages exceptionnels
          </p>
        </div>

        {/* Cartes des voyages */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTrips.map((trip) => (
            <Card
              key={trip.id}
              className="relative overflow-hidden cursor-pointer group h-100 rounded-2xl"
              onMouseEnter={() => setHoveredCard(trip.id)}
              onMouseLeave={() => setHoveredCard(null)}
            >
              <div className="absolute inset-0">
                <Image
                  src={trip.image || "/placeholder.svg"}
                  alt={trip.titre}
                  fill
                  className={`object-cover transition-all duration-300 ${
                    hoveredCard === trip.id ? "blur-sm scale-105" : ""
                  }`}
                />
              </div>

              <div
                className={`absolute inset-0 bg-black/60 transition-all duration-300 flex flex-col justify-between p-6 ${
                  hoveredCard === trip.id ? "opacity-100" : "opacity-0"
                }`}
              >
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span className="text-white text-sm font-medium">
                      {trip.note}
                    </span>
                  </div>
                  <Badge className="bg-white text-black font-semibold">
                    €{trip.prix}
                  </Badge>
                </div>

                <div className="space-y-4">
                  <div>
                    <h3 className="text-2xl font-bold text-white mb-2">
                      {trip.titre}
                    </h3>
                    <div className="flex items-center text-white/80 text-sm mb-3">
                      <MapPin className="w-4 h-4 mr-1" />
                      {trip.localisation}
                    </div>
                    <p className="text-white/90 text-sm leading-relaxed">
                      {trip.description}
                    </p>
                  </div>

                  <div className="flex items-center justify-between">
                    <Badge
                      variant="secondary"
                      className="bg-white/20 text-white border-white/30"
                    >
                      {trip.passagers} passagers
                    </Badge>
                    <div className="flex items-center text-white/80 text-sm">
                      <Clock className="w-4 h-4 mr-1" />
                      {trip.durée} jours
                    </div>
                  </div>

                  <Button
                    onClick={() => router.push(`/places/${trip.slug}`)}
                    className="w-full bg-white text-black hover:bg-white/90 font-semibold rounded-full"
                  >
                    Voir les détails
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Aucun résultat */}
        {filteredTrips.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <Search className="w-16 h-16 mx-auto" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Aucun voyage trouvé
            </h3>
            <p className="text-gray-600">
              Essayez de modifier vos critères de recherche
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Places;
