// "use client";

// import React, { useState, useEffect } from "react";
// import { useSearchParams, useRouter } from "next/navigation";
// import { Button } from "@/components/ui/button";
// import { Card } from "@/components/ui/card";
// import { Badge } from "@/components/ui/badge";
// import {
//   Search,
//   MapPin,
//   Clock,
//   Star,
//   Users,
//   Calendar,
//   Euro,
// } from "lucide-react";
// import Image from "next/image";
// import {
//   Dialog,
//   DialogContent,
//   DialogDescription,
//   DialogHeader,
//   DialogTitle,
//   DialogTrigger,
//   DialogFooter,
// } from "@/components/ui/dialog";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";

// interface Trip {
//   id: number;
//   slug: string;
//   titre: string;
//   prix: number;
//   image: string;
//   description: string;
//   passagers: number;
//   durée: number;
//   note: number;
//   localisation: string;
// }

// const PlacesContent = () => {
//   const router = useRouter();
//   const searchParams = useSearchParams();

//   const [trips, setTrips] = useState<Trip[]>([]);
//   const [hoveredCard, setHoveredCard] = useState<number | null>(null);
//   const tripsPerPage = 6;

//   const [currentPage, setCurrentPage] = useState(1);

//   // Filtres
//   const [filterDestination, setFilterDestination] = useState("");
//   const [filterPassagers, setFilterPassagers] = useState<number | "">("");
//   const [filterDuree, setFilterDuree] = useState<number | "">("");
//   const [filterPrixMax, setFilterPrixMax] = useState<number | "">("");

//   const [open, setOpen] = useState(false); // Pour Dialog

//   // Charger trips.json
//   useEffect(() => {
//     fetch("/data/trips.json")
//       .then((res) => res.json())
//       .then((data) => setTrips(data))
//       .catch((error) => console.error("Erreur chargement trips :", error));
//   }, []);

//   // Extraire page de l'URL
//   useEffect(() => {
//     const pageFromUrl = parseInt(searchParams.get("page") || "1", 10);
//     setCurrentPage(isNaN(pageFromUrl) ? 1 : pageFromUrl);
//   }, [searchParams]);

//   const filteredTrips = trips.filter((trip) => {
//     const destinationMatch =
//       trip.localisation
//         .toLowerCase()
//         .includes(filterDestination.toLowerCase()) ||
//       trip.titre.toLowerCase().includes(filterDestination.toLowerCase());

//     const passagersMatch =
//       filterPassagers === "" || trip.passagers >= Number(filterPassagers);

//     const dureeMatch = filterDuree === "" || trip.durée >= Number(filterDuree);

//     const prixMatch =
//       filterPrixMax === "" || trip.prix <= Number(filterPrixMax);

//     return destinationMatch && passagersMatch && dureeMatch && prixMatch;
//   });

//   const totalPages = Math.ceil(filteredTrips.length / tripsPerPage);

//   useEffect(() => {
//     if (currentPage > totalPages && totalPages > 0) {
//       setCurrentPage(1);
//       router.push(`?page=1`);
//     }
//   }, [filteredTrips, currentPage, totalPages, router]);

//   const indexOfLastTrip = currentPage * tripsPerPage;
//   const indexOfFirstTrip = indexOfLastTrip - tripsPerPage;
//   const currentTrips = filteredTrips.slice(indexOfFirstTrip, indexOfLastTrip);

//   const handlePageChange = (page: number) => {
//     if (page >= 1 && page <= totalPages) {
//       router.push(`?page=${page}`);
//       setCurrentPage(page);
//     }
//   };

//   const handleApplyFilters = () => {
//     setOpen(false);
//     setCurrentPage(1);
//     router.push(`?page=1`);
//   };

//   const handleResetFilters = () => {
//     setFilterDestination("");
//     setFilterPassagers("");
//     setFilterDuree("");
//     setFilterPrixMax("");
//   };

//   return (
//     <div className="min-h-screen px-4">
//       <div className="mx-auto px-12">
//         {/* Header + bouton filtre */}
//         <div className="mb-8 mt-36 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
//           <div>
//             <h1 className="text-3xl md:text-4xl font-bold text-[#1c1817] mb-2">
//               Découvrez nos destinations
//             </h1>
//             <p className="text-gray-600 text-lg">
//               Trouvez votre prochaine aventure parmi nos voyages exceptionnels
//             </p>
//           </div>

//           {/* Bouton filtre */}
// <Dialog open={open} onOpenChange={setOpen}>
//   <DialogTrigger asChild>
//     <Button
//       size="lg"
//       className="bg-[#f36f0f] hover:bg-[#f36f0f]/90 text-white font-semibold rounded-xl px-8 py-4 shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
//     >
//       Filtrer les voyages
//     </Button>
//   </DialogTrigger>

//   <DialogContent className="sm:max-w-[500px] p-0 overflow-hidden">
//     <DialogHeader className="flex flex-col items-center justify-center">
//       <DialogTitle className="text-xl font-bold pt-5">
//         Filtrer les voyages
//       </DialogTitle>
//       <DialogDescription className="text-gray-600 text-sm text-center">
//         Affinez votre recherche avec les critères ci-dessous
//       </DialogDescription>
//     </DialogHeader>

//     <div className="p-6 space-y-6">
//       <div className="grid gap-4">
//         <div className="space-y-2">
//           <Label htmlFor="destination">
//             <div className="flex items-center gap-2">
//               <MapPin className="w-4 h-4 text-[#f36f0f]" />
//               Destination
//             </div>
//           </Label>
//           <Input
//             id="destination"
//             value={filterDestination}
//             onChange={(e) => setFilterDestination(e.target.value)}
//           />
//         </div>

//         <div className="grid grid-cols-2 gap-4">
//           <div className="space-y-2">
//             <Label htmlFor="passagers">
//               <div className="flex items-center gap-2">
//                 <Users className="w-4 h-4 text-[#f36f0f]" />
//                 Passagers
//               </div>
//             </Label>
//             <Input
//               id="passagers"
//               type="number"
//               min={1}
//               value={filterPassagers === "" ? "" : filterPassagers}
//               onChange={(e) =>
//                 setFilterPassagers(
//                   e.target.value === "" ? "" : Number(e.target.value)
//                 )
//               }
//             />
//           </div>

//           <div className="space-y-2">
//             <Label htmlFor="duree">
//               <div className="flex items-center gap-2">
//                 <Calendar className="w-4 h-4 text-[#f36f0f]" />
//                 Durée
//               </div>
//             </Label>
//             <Input
//               id="duree"
//               type="number"
//               min={1}
//               value={filterDuree === "" ? "" : filterDuree}
//               onChange={(e) =>
//                 setFilterDuree(
//                   e.target.value === "" ? "" : Number(e.target.value)
//                 )
//               }
//             />
//           </div>
//         </div>

//         <div className="space-y-2">
//           <Label htmlFor="prix">
//             <div className="flex items-center gap-2">
//               <Euro className="w-4 h-4 text-[#f36f0f]" />
//               Budget
//             </div>
//           </Label>
//           <Input
//             id="prix"
//             type="number"
//             min={0}
//             value={filterPrixMax === "" ? "" : filterPrixMax}
//             onChange={(e) =>
//               setFilterPrixMax(
//                 e.target.value === "" ? "" : Number(e.target.value)
//               )
//             }
//           />
//         </div>
//       </div>

//       <DialogFooter className="flex flex-col sm:flex-row gap-3 sm:justify-between">
//         <Button variant="outline" onClick={handleResetFilters}>
//           Réinitialiser
//         </Button>
//         <Button onClick={handleApplyFilters}>
//           Appliquer les filtres
//         </Button>
//       </DialogFooter>
//     </div>
//   </DialogContent>
// </Dialog>
//         </div>

//         {/* Cartes des voyages */}
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//           {currentTrips.map((trip) => (
//             <Card
//               key={trip.id}
//               className="relative overflow-hidden cursor-pointer group rounded-2xl"
//               onMouseEnter={() => setHoveredCard(trip.id)}
//               onMouseLeave={() => setHoveredCard(null)}
//             >
//               <div className="absolute inset-0">
//                 <Image
//                   src={trip.image || "/placeholder.svg"}
//                   alt={trip.titre}
//                   fill
//                   className={`object-cover transition-all duration-300 ${
//                     hoveredCard === trip.id ? "blur-sm scale-105" : ""
//                   }`}
//                 />
//               </div>

//               <div
//                 className={`absolute inset-0 bg-black/60 transition-all duration-300 flex flex-col justify-between p-6 ${
//                   hoveredCard === trip.id ? "opacity-100" : "opacity-0"
//                 }`}
//               >
//                 <div className="flex justify-between items-start">
//                   <div className="flex items-center gap-1">
//                     <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
//                     <span className="text-white text-sm font-medium">
//                       {trip.note}
//                     </span>
//                   </div>
//                   <Badge className="bg-white text-black font-semibold">
//                     €{trip.prix}
//                   </Badge>
//                 </div>

//                 <div className="space-y-4">
//                   <div>
//                     <h3 className="text-2xl font-bold text-white mb-2">
//                       {trip.titre}
//                     </h3>
//                     <div className="flex items-center text-white/80 text-sm mb-3">
//                       <MapPin className="w-4 h-4 mr-1" />
//                       {trip.localisation}
//                     </div>
//                     <p className="text-white/90 text-sm leading-relaxed">
//                       {trip.description}
//                     </p>
//                   </div>

//                   <div className="flex items-center justify-between">
//                     <Badge className="bg-white/20 text-white border-white/30">
//                       {trip.passagers} passagers
//                     </Badge>
//                     <div className="flex items-center text-white/80 text-sm">
//                       <Clock className="w-4 h-4 mr-1" />
//                       {trip.durée} jours
//                     </div>
//                   </div>

//                   <Button
//                     onClick={() => router.push(`/places/${trip.slug}`)}
//                     className="w-full bg-white text-black hover:bg-white/90 font-semibold rounded-full"
//                   >
//                     Voir les détails
//                   </Button>
//                 </div>
//               </div>
//             </Card>
//           ))}
//         </div>

//         {/* Pagination */}
//         {filteredTrips.length > tripsPerPage && (
//           <div className="flex justify-center items-center gap-4 mt-12 mb-14">
//             <Button
//               onClick={() => handlePageChange(currentPage - 1)}
//               className="bg-[#f36f0f] text-white rounded-full"
//               disabled={currentPage === 1}
//             >
//               Précédent
//             </Button>
//             {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
//               <Button
//                 key={page}
//                 onClick={() => handlePageChange(page)}
//                 className={`rounded-full ${
//                   currentPage === page
//                     ? "bg-[#f36f0f] text-white"
//                     : "bg-white text-[#f36f0f] border border-[#f36f0f]"
//                 }`}
//               >
//                 {page}
//               </Button>
//             ))}
//             <Button
//               onClick={() => handlePageChange(currentPage + 1)}
//               className="bg-[#f36f0f] text-white rounded-full"
//               disabled={currentPage === totalPages}
//             >
//               Suivant
//             </Button>
//           </div>
//         )}

//         {/* Aucun résultat */}
//         {filteredTrips.length === 0 && (
//           <div className="text-center py-12">
//             <Search className="w-16 h-16 mx-auto text-gray-400 mb-4" />
//             <h3 className="text-xl font-semibold text-gray-900 mb-2">
//               Aucun voyage trouvé
//             </h3>
//             <p className="text-gray-600">
//               Essayez de modifier vos critères de recherche
//             </p>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default PlacesContent;
"use client";

import React, { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Search,
  MapPin,
  Clock,
  Star,
  Users,
  Calendar,
  Euro,
} from "lucide-react";
import Image from "next/image";

// Import Shadcn Dialog components
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

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
  const searchParams = useSearchParams();
  const [trips, setTrips] = useState<Trip[]>([]);
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);

  const tripsPerPage = 6;

  const pageFromUrl = parseInt(searchParams.get("page") || "1", 10);
  const [currentPage, setCurrentPage] = useState(pageFromUrl);

  // États pour filtres
  const [filterDestination, setFilterDestination] = useState("");
  const [filterPassagers, setFilterPassagers] = useState<number | "">("");
  const [filterDuree, setFilterDuree] = useState<number | "">("");
  const [filterPrixMax, setFilterPrixMax] = useState<number | "">("");

  useEffect(() => {
    setCurrentPage(pageFromUrl);
  }, [pageFromUrl]);

  useEffect(() => {
    fetch("/data/trips.json")
      .then((res) => res.json())
      .then((data) => setTrips(data))
      .catch((error) => console.error("Erreur chargement trips :", error));
  }, []);

  // Filtrage des trips selon les critères (localisation OU titre)
  const filteredTrips = trips.filter((trip) => {
    const destinationMatch =
      trip.localisation
        .toLowerCase()
        .includes(filterDestination.toLowerCase()) ||
      trip.titre.toLowerCase().includes(filterDestination.toLowerCase());

    const passagersMatch =
      filterPassagers === "" || trip.passagers >= Number(filterPassagers);

    const dureeMatch = filterDuree === "" || trip.durée >= Number(filterDuree);

    const prixMatch =
      filterPrixMax === "" || trip.prix <= Number(filterPrixMax);

    return destinationMatch && passagersMatch && dureeMatch && prixMatch;
  });

  const totalPages = Math.ceil(filteredTrips.length / tripsPerPage);

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(1);
      router.push(`?page=1`);
    }
  }, [filteredTrips, currentPage, totalPages, router]);

  const indexOfLastTrip = currentPage * tripsPerPage;
  const indexOfFirstTrip = indexOfLastTrip - tripsPerPage;
  const currentTrips = filteredTrips.slice(indexOfFirstTrip, indexOfLastTrip);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      router.push(`?page=${page}`);
      setCurrentPage(page);
    }
  };

  // Dialog state (controlled)
  const [open, setOpen] = useState(false);

  // Handler appliquer filtres : ferme le dialog (le filtre est déjà appliqué au fur et à mesure)
  const handleApplyFilters = () => {
    setOpen(false);
    setCurrentPage(1);
    router.push(`?page=1`);
  };

  // Reset filtres
  const handleResetFilters = () => {
    setFilterDestination("");
    setFilterPassagers("");
    setFilterDuree("");
    setFilterPrixMax("");
  };

  return (
    <div className="min-h-screen px-4">
      <div className="mx-auto px-12">
        {/* Ligne titre + bouton filtre */}
        <div className="mb-8 mt-24 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
              Découvrez nos destinations
            </h1>
            <p className="text-gray-600 text-lg">
              Trouvez votre prochaine aventure parmi nos voyages exceptionnels
            </p>
          </div>

          {/* Bouton filtre avec icône */}
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button
                size="lg"
                className="bg-[#f36f0f] hover:bg-[#f36f0f]/90 text-white font-semibold rounded-xl px-8 py-4 shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
              >
                Filtrer les voyages
              </Button>
            </DialogTrigger>

            <DialogContent className="sm:max-w-[500px] p-0 overflow-hidden">
              <DialogHeader className="flex flex-col items-center justify-center">
                <DialogTitle className="text-xl font-bold pt-5">
                  Filtrer les voyages
                </DialogTitle>
                <DialogDescription className="text-gray-600 text-sm text-center">
                  Affinez votre recherche avec les critères ci-dessous
                </DialogDescription>
              </DialogHeader>

              <div className="p-6 space-y-6">
                <div className="grid gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="destination">
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-[#f36f0f]" />
                        Destination
                      </div>
                    </Label>
                    <Input
                      id="destination"
                      value={filterDestination}
                      onChange={(e) => setFilterDestination(e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="passagers">
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4 text-[#f36f0f]" />
                        Passagers
                      </div>
                    </Label>
                    <Input
                      id="passagers"
                      type="number"
                      min={1}
                      value={filterPassagers === "" ? "" : filterPassagers}
                      onChange={(e) =>
                        setFilterPassagers(
                          e.target.value === "" ? "" : Number(e.target.value)
                        )
                      }
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="duree">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-[#f36f0f]" />
                        Durée (en jours)
                      </div>
                    </Label>
                    <Input
                      id="duree"
                      type="number"
                      min={1}
                      value={filterDuree === "" ? "" : filterDuree}
                      onChange={(e) =>
                        setFilterDuree(
                          e.target.value === "" ? "" : Number(e.target.value)
                        )
                      }
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="prix">
                      <div className="flex items-center gap-2">
                        <Euro className="w-4 h-4 text-[#f36f0f]" />
                        Budget (en €)
                      </div>
                    </Label>
                    <Input
                      id="prix"
                      type="number"
                      min={0}
                      value={filterPrixMax === "" ? "" : filterPrixMax}
                      onChange={(e) =>
                        setFilterPrixMax(
                          e.target.value === "" ? "" : Number(e.target.value)
                        )
                      }
                    />
                  </div>
                </div>

                <DialogFooter className="flex flex-col sm:flex-row gap-3 sm:justify-between">
                  <Button
                    className="text-[#f36f0f] bg-white border border-[#f36f0f] hover:bg-transparent"
                    onClick={handleResetFilters}
                  >
                    Réinitialiser
                  </Button>
                  <Button
                    className="bg-[#f36f0f] text-white hover:bg-[#f36f0f]/90 font-semibold "
                    onClick={handleApplyFilters}
                  >
                    Appliquer les filtres
                  </Button>
                </DialogFooter>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Cartes des voyages */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {currentTrips.map((trip) => (
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

        {/* Pagination */}
        {filteredTrips.length > tripsPerPage && (
          <div className="flex justify-center items-center gap-4 mt-12 mb-14">
            <Button
              variant="outline"
              onClick={() => handlePageChange(currentPage - 1)}
              className="disabled:opacity-50 disabled:cursor-not-allowed bg-[#f36f0f] text-white hover:bg-[#f36f0f]/90 font-semibold rounded-full"
              disabled={currentPage === 1}
            >
              Précédent
            </Button>
            {[...Array(totalPages)].map((_, index) => {
              const page = index + 1;
              const isActive = currentPage === page;

              return (
                <Button
                  key={page}
                  onClick={() => handlePageChange(page)}
                  className={`font-semibold rounded-full ${
                    isActive
                      ? "bg-[#f36f0f] text-white"
                      : "bg-white text-[#f36f0f] border border-[#f36f0f]"
                  }`}
                >
                  {page}
                </Button>
              );
            })}
            <Button
              variant="outline"
              onClick={() => handlePageChange(currentPage + 1)}
              className="disabled:opacity-50 disabled:cursor-not-allowed bg-[#f36f0f] text-white hover:bg-[#f36f0f]/90 font-semibold rounded-full"
              disabled={currentPage === totalPages}
            >
              Suivant
            </Button>
          </div>
        )}

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
