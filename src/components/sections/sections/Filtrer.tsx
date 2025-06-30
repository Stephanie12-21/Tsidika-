// "use client";

// import { useState } from "react";
// import { Search, Filter, X, MapPin, Users, Euro, Settings } from "lucide-react";
// import { Input } from "@/components/ui/input";
// import { Button } from "@/components/ui/button";
// import { Badge } from "@/components/ui/badge";
// import {
//   Dialog,
//   DialogContent,
//   DialogHeader,
//   DialogTitle,
//   DialogTrigger,
// } from "@/components/ui/dialog";

// export default function TravelFilters() {
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [selectedDestination, setSelectedDestination] = useState("all");
//   const [travelType, setTravelType] = useState("all");
//   const [numberOfPeople, setNumberOfPeople] = useState(1);
//   const [minPrice, setMinPrice] = useState(0);
//   const [maxPrice, setMaxPrice] = useState(5000);

//   const clearFilters = () => {
//     setSearchTerm("");
//     setSelectedDestination("all");
//     setTravelType("all");
//     setNumberOfPeople(1);
//     setMinPrice(0);
//     setMaxPrice(5000);
//   };

//   const hasActiveFilters =
//     searchTerm ||
//     selectedDestination !== "all" ||
//     travelType !== "all" ||
//     numberOfPeople !== 1 ||
//     minPrice !== 0 ||
//     maxPrice !== 5000;

//   const activeFiltersCount = [
//     searchTerm,
//     selectedDestination !== "all",
//     travelType !== "all",
//     numberOfPeople !== 1,
//     minPrice !== 0 || maxPrice !== 5000,
//   ].filter(Boolean).length;

//   const handleApplyFilters = () => {
//     setIsModalOpen(false);
//     // Ici vous pouvez ajouter la logique pour appliquer les filtres
//     console.log("Filtres appliqués:", {
//       searchTerm,
//       selectedDestination,
//       travelType,
//       numberOfPeople,
//       minPrice,
//       maxPrice,
//     });
//   };

//   return (
//     <div className="w-full max-w-7xl mx-auto p-4">
//       {/* Main Filter Button */}
//       <div className="flex justify-center mb-8">
//         <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
//           <DialogTrigger asChild>
//             <Button
//               size="lg"
//               className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold py-4 px-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
//             >
//               <Settings className="w-5 h-5 mr-3" />
//               Filtrer les destinations
//               {hasActiveFilters && (
//                 <Badge
//                   variant="secondary"
//                   className="ml-3 bg-white text-blue-600"
//                 >
//                   {activeFiltersCount}
//                 </Badge>
//               )}
//             </Button>
//           </DialogTrigger>

//           <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
//             <DialogHeader>
//               <DialogTitle className="text-2xl font-bold text-gray-900 flex items-center gap-3">
//                 <div className="p-2 bg-blue-50 rounded-lg">
//                   <Filter className="w-6 h-6 text-blue-600" />
//                 </div>
//                 Filtres de voyage
//               </DialogTitle>
//             </DialogHeader>

//             <div className="py-6">
//               {/* Filter Controls Grid */}
//               <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
//                 {/* Left Column */}
//                 <div className="space-y-6">
//                   {/* Destination Search */}
//                   <div className="space-y-3">
//                     <div className="flex items-center gap-2">
//                       <MapPin className="w-5 h-5 text-blue-600" />
//                       <label className="text-sm font-semibold text-gray-700">
//                         Destination
//                       </label>
//                     </div>
//                     <div className="relative">
//                       <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
//                       <Input
//                         placeholder="Rechercher ou saisir une destination..."
//                         value={searchTerm}
//                         onChange={(e) => setSearchTerm(e.target.value)}
//                         className="pl-10 border-gray-200 focus:border-blue-500 focus:ring-blue-500 h-12"
//                       />
//                     </div>
//                   </div>
//                 </div>

//                 {/* Right Column */}
//                 <div className="space-y-6">
//                   {/* Number of People */}
//                   <div className="space-y-3">
//                     <div className="flex items-center gap-2">
//                       <Users className="w-5 h-5 text-blue-600" />
//                       <label className="text-sm font-semibold text-gray-700">
//                         Nombre de voyageurs
//                       </label>
//                     </div>
//                     <div className="flex items-center gap-3">
//                       <Button
//                         variant="outline"
//                         size="sm"
//                         onClick={() =>
//                           setNumberOfPeople(Math.max(1, numberOfPeople - 1))
//                         }
//                         disabled={numberOfPeople <= 1}
//                         className="h-12 w-12 p-0 text-lg"
//                       >
//                         -
//                       </Button>
//                       <Input
//                         type="number"
//                         value={numberOfPeople}
//                         onChange={(e) =>
//                           setNumberOfPeople(
//                             Math.max(1, Number.parseInt(e.target.value) || 1)
//                           )
//                         }
//                         min="1"
//                         max="20"
//                         className="text-center w-24 h-12 text-lg font-semibold border-gray-200 focus:border-blue-500"
//                       />
//                       <Button
//                         variant="outline"
//                         size="sm"
//                         onClick={() =>
//                           setNumberOfPeople(Math.min(20, numberOfPeople + 1))
//                         }
//                         disabled={numberOfPeople >= 20}
//                         className="h-12 w-12 p-0 text-lg"
//                       >
//                         +
//                       </Button>
//                       <span className="text-sm text-gray-600 ml-2 font-medium">
//                         {numberOfPeople === 1 ? "personne" : "personnes"}
//                       </span>
//                     </div>
//                   </div>

//                   {/* Price Range */}
//                   <div className="space-y-3">
//                     <div className="flex items-center gap-2">
//                       <Euro className="w-5 h-5 text-blue-600" />
//                       <label className="text-sm font-semibold text-gray-700">
//                         Budget par personne
//                       </label>
//                     </div>
//                     <div className="grid grid-cols-2 gap-4">
//                       <div>
//                         <label className="text-xs text-gray-500 mb-2 block font-medium">
//                           Prix minimal
//                         </label>
//                         <div className="relative">
//                           <Input
//                             type="number"
//                             value={minPrice}
//                             onChange={(e) =>
//                               setMinPrice(
//                                 Math.max(
//                                   0,
//                                   Number.parseInt(e.target.value) || 0
//                                 )
//                               )
//                             }
//                             min="0"
//                             max="10000"
//                             placeholder="0"
//                             className="pr-8 border-gray-200 focus:border-blue-500 h-12 text-lg"
//                           />
//                           <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm font-medium">
//                             €
//                           </span>
//                         </div>
//                       </div>
//                       <div>
//                         <label className="text-xs text-gray-500 mb-2 block font-medium">
//                           Prix maximal
//                         </label>
//                         <div className="relative">
//                           <Input
//                             type="number"
//                             value={maxPrice}
//                             onChange={(e) =>
//                               setMaxPrice(
//                                 Math.max(
//                                   minPrice,
//                                   Number.parseInt(e.target.value) || 0
//                                 )
//                               )
//                             }
//                             min={minPrice}
//                             max="10000"
//                             placeholder="5000"
//                             className="pr-8 border-gray-200 focus:border-blue-500 h-12 text-lg"
//                           />
//                           <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm font-medium">
//                             €
//                           </span>
//                         </div>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               </div>

//               {/* Active Filters Display */}
//               {hasActiveFilters && (
//                 <div className="mt-8 pt-6 border-t border-gray-200">
//                   <div className="flex flex-wrap gap-2 items-center">
//                     <span className="text-sm font-semibold text-gray-700 mr-2">
//                       Filtres actifs:
//                     </span>
//                     {searchTerm && (
//                       <Badge variant="secondary" className="gap-1 py-1 px-3">
//                         🔍 {searchTerm}
//                         <X
//                           className="w-3 h-3 cursor-pointer hover:text-red-500"
//                           onClick={() => setSearchTerm("")}
//                         />
//                       </Badge>
//                     )}
//                     {selectedDestination !== "all" && (
//                       <Badge variant="secondary" className="gap-1 py-1 px-3">
//                         📍 {selectedDestination}
//                         <X
//                           className="w-3 h-3 cursor-pointer hover:text-red-500"
//                           onClick={() => setSelectedDestination("all")}
//                         />
//                       </Badge>
//                     )}

//                     {numberOfPeople !== 1 && (
//                       <Badge variant="secondary" className="gap-1 py-1 px-3">
//                         👥 {numberOfPeople}{" "}
//                         {numberOfPeople === 1 ? "personne" : "personnes"}
//                         <X
//                           className="w-3 h-3 cursor-pointer hover:text-red-500"
//                           onClick={() => setNumberOfPeople(1)}
//                         />
//                       </Badge>
//                     )}
//                     {(minPrice !== 0 || maxPrice !== 5000) && (
//                       <Badge variant="secondary" className="gap-1 py-1 px-3">
//                         💰 {minPrice}€ - {maxPrice}€
//                         <X
//                           className="w-3 h-3 cursor-pointer hover:text-red-500"
//                           onClick={() => {
//                             setMinPrice(0);
//                             setMaxPrice(5000);
//                           }}
//                         />
//                       </Badge>
//                     )}
//                   </div>
//                 </div>
//               )}

//               {/* Modal Action Buttons */}
//               <div className="flex gap-4 mt-8 pt-6 border-t border-gray-200">
//                 <Button
//                   variant="outline"
//                   onClick={clearFilters}
//                   className="flex-1 h-12 text-gray-600 hover:text-gray-800 border-gray-300 bg-transparent"
//                 >
//                   <X className="w-4 h-4 mr-2" />
//                   Effacer tous les filtres
//                 </Button>
//                 <Button
//                   onClick={handleApplyFilters}
//                   className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold h-12"
//                 >
//                   <Search className="w-5 h-5 mr-2" />
//                   Appliquer les filtres
//                 </Button>
//               </div>
//             </div>
//           </DialogContent>
//         </Dialog>
//       </div>

//       {/* Results Summary */}
//       {hasActiveFilters && (
//         <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-100">
//           <div className="text-center">
//             <p className="text-lg font-semibold text-gray-800">
//               <span className="text-blue-600">1,247</span> voyages correspondent
//               à vos critères
//             </p>
//             <p className="text-sm text-gray-600 mt-1">
//               Résultats filtrés selon vos préférences
//             </p>

//             {/* Quick filter summary */}
//             <div className="flex flex-wrap justify-center gap-2 mt-4">
//               {searchTerm && (
//                 <Badge
//                   variant="outline"
//                   className="text-blue-600 border-blue-200"
//                 >
//                   🔍 {searchTerm}
//                 </Badge>
//               )}
//               {selectedDestination !== "all" && (
//                 <Badge
//                   variant="outline"
//                   className="text-blue-600 border-blue-200"
//                 >
//                   📍 {selectedDestination}
//                 </Badge>
//               )}

//               {numberOfPeople !== 1 && (
//                 <Badge
//                   variant="outline"
//                   className="text-blue-600 border-blue-200"
//                 >
//                   👥 {numberOfPeople}{" "}
//                   {numberOfPeople === 1 ? "personne" : "personnes"}
//                 </Badge>
//               )}
//               {(minPrice !== 0 || maxPrice !== 5000) && (
//                 <Badge
//                   variant="outline"
//                   className="text-blue-600 border-blue-200"
//                 >
//                   💰 {minPrice}€ - {maxPrice}€
//                 </Badge>
//               )}
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }
"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Search, MapPin, Clock, Star, Users, Euro } from "lucide-react";
import Image from "next/image";

interface Trip {
  id: number;
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
  const [trips, setTrips] = useState<Trip[]>([]);
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);

  // Filtres
  const [searchTerm, setSearchTerm] = useState("");
  const [numberOfPeople, setNumberOfPeople] = useState(1);
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(5000);

  useEffect(() => {
    fetch("/data/trips.json")
      .then((res) => res.json())
      .then((data) => setTrips(data))
      .catch((error) => console.error("Erreur chargement trips :", error));
  }, []);

  const filteredTrips = trips.filter(
    (trip) =>
      trip.titre.toLowerCase().includes(searchTerm.toLowerCase()) &&
      trip.passagers >= numberOfPeople &&
      trip.prix >= minPrice &&
      trip.prix <= maxPrice
  );

  return (
    <div className="min-h-screen p-4 md:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
            Découvrez nos destinations
          </h1>
          <p className="text-gray-600 text-lg">
            Trouvez votre prochaine aventure parmi nos voyages exceptionnels
          </p>
        </div>

        {/* Filtres */}
        <div className="bg-white border border-gray-100 rounded-xl shadow p-6 mb-10">
          <div className="flex flex-wrap items-end gap-4">
            <div className="flex-1 min-w-[200px]">
              <label className="text-sm font-semibold text-gray-700 flex items-center gap-2 mb-1">
                <MapPin className="w-4 h-4 text-blue-600" /> Destination
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Rechercher une destination"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 h-12"
                />
              </div>
            </div>

            <div className="flex items-center gap-2 min-w-[200px]">
              <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                <Users className="w-4 h-4 text-blue-600" /> Voyageurs
              </label>
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  setNumberOfPeople(Math.max(1, numberOfPeople - 1))
                }
                className="h-10 w-10 p-0"
              >
                -
              </Button>
              <Input
                type="number"
                value={numberOfPeople}
                onChange={(e) =>
                  setNumberOfPeople(Math.max(1, parseInt(e.target.value) || 1))
                }
                min="1"
                max="20"
                className="text-center w-16 h-10"
              />
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  setNumberOfPeople(Math.min(20, numberOfPeople + 1))
                }
                className="h-10 w-10 p-0"
              >
                +
              </Button>
            </div>

            <div className="min-w-[150px]">
              <label className="text-sm font-semibold text-gray-700 flex items-center gap-2 mb-1">
                <Euro className="w-4 h-4 text-blue-600" /> Min €
              </label>
              <Input
                type="number"
                value={minPrice}
                onChange={(e) =>
                  setMinPrice(Math.max(0, parseInt(e.target.value) || 0))
                }
                min="0"
                className="h-12"
              />
            </div>

            <div className="min-w-[150px]">
              <label className="text-sm font-semibold text-gray-700 flex items-center gap-2 mb-1">
                <Euro className="w-4 h-4 text-blue-600" /> Max €
              </label>
              <Input
                type="number"
                value={maxPrice}
                onChange={(e) =>
                  setMaxPrice(Math.max(minPrice, parseInt(e.target.value) || 0))
                }
                min={minPrice}
                className="h-12"
              />
            </div>
          </div>
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

                  <Button className="w-full bg-white text-black hover:bg-white/90 font-semibold rounded-full">
                    Voir les détails
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>

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
