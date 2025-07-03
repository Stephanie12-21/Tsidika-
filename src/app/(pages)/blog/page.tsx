// "use client";

// import { useState, useEffect } from "react";
// import { useSearchParams, useRouter } from "next/navigation";
// import Image from "next/image";
// import Link from "next/link";
// import { Badge } from "@/components/ui/badge";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Loader2, Search } from "lucide-react";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";

// interface BlogPost {
//   id: number;
//   title: string;
//   description: string;
//   slug: string;
//   date: string;
//   image: string;
//   tags: string[];
//   featured: boolean;
// }

// interface Category {
//   name: string;
//   count: number;
//   icon: string;
// }

// interface BlogData {
//   blogPosts: BlogPost[];
//   categories: Category[];
// }

// const Blog = () => {
//   const router = useRouter();
//   const searchParams = useSearchParams();

//   const [searchterm, setSearchterm] = useState("");
//   const [blogData, setBlogData] = useState<BlogData | null>(null);
//   const [filteredPosts, setFilteredPosts] = useState<BlogPost[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);

//   const postsPerPage = 6;
//   const [currentPage, setCurrentPage] = useState(1);

//   // Récupération page URL
//   useEffect(() => {
//     const pageParam = searchParams.get("page");
//     const page = pageParam ? parseInt(pageParam, 10) : 1;
//     if (!isNaN(page) && page >= 1) {
//       setCurrentPage(page);
//     }
//   }, [searchParams]);

//   // Chargement des données
//   useEffect(() => {
//     const fetchBlogData = async () => {
//       try {
//         const response = await fetch("/data/blogs.json");
//         if (!response.ok) {
//           throw new Error("Erreur lors du chargement des données");
//         }
//         const data: BlogData = await response.json();
//         setBlogData(data);
//       } catch (err) {
//         setError(
//           err instanceof Error ? err.message : "Une erreur est survenue"
//         );
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchBlogData();
//   }, []);

//   // Filtrage dynamique
//   useEffect(() => {
//     if (!blogData) return;

//     const regularPosts = blogData.blogPosts.filter((post) => !post.featured);

//     if (searchterm.trim() === "") {
//       setFilteredPosts(regularPosts);
//     } else {
//       const term = searchterm.toLowerCase();
//       const filtered = regularPosts.filter(
//         (post) =>
//           post.title.toLowerCase().includes(term) ||
//           post.description.toLowerCase().includes(term)
//       );
//       setFilteredPosts(filtered);
//     }

//     setCurrentPage(1);
//   }, [searchterm, blogData]);

//   const totalPages = Math.ceil(filteredPosts.length / postsPerPage);
//   const indexOfLastPost = currentPage * postsPerPage;
//   const indexOfFirstPost = indexOfLastPost - postsPerPage;
//   const currentPosts = filteredPosts.slice(indexOfFirstPost, indexOfLastPost);

//   const handlePageChange = (page: number) => {
//     if (page >= 1 && page <= totalPages) {
//       setCurrentPage(page);
//       router.push(`?page=${page}`);
//       window.scrollTo({ top: 0, behavior: "smooth" });
//     }
//   };

//   if (loading) {
//     return (
//       <div className="min-h-screen flex items-center justify-center">
//         <div className="text-center">
//           <Loader2 className="w-8 h-8 animate-spin text-primary mx-auto mb-4" />
//           <p className="text-gray-600">Chargement des articles...</p>
//         </div>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="min-h-screen flex items-center justify-center">
//         <div className="text-center">
//           <p className="text-red-600 mb-4">Erreur : {error}</p>
//           <button
//             onClick={() => window.location.reload()}
//             className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary-600 transition-colors"
//           >
//             Réessayer
//           </button>
//         </div>
//       </div>
//     );
//   }

//   if (!blogData) return null;

//   return (
//     <div className="min-h-screen mt-24 py-16 px-4 sm:px-6 lg:px-8">
//       <div className="container mx-auto">
//         <section className="mb-12">
//           {/* Barre de titre + recherche */}
//           <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
//             <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
//               Derniers articles
//             </h1>

//             <div className="relative w-full md:w-96">
//               <Input
//                 id="nom"
//                 value={searchterm}
//                 onChange={(e) => setSearchterm(e.target.value)}
//                 placeholder="Votre recherche ici..."
//                 className="h-12 pl-12 pr-4"
//               />
//               <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
//             </div>
//           </div>

//           {/* Articles Grid responsive */}
//           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
//             {currentPosts.length === 0 ? (
//               <p className="text-center col-span-full text-gray-500">
//                 Aucun article trouvé pour votre recherche.
//               </p>
//             ) : (
//               currentPosts.map((post) => (
//                 <Card
//                   key={post.id}
//                   className="overflow-hidden hover:shadow-lg transition-shadow"
//                 >
//                   <div className="aspect-video relative">
//                     <Image
//                       src={post.image || "/placeholder.svg"}
//                       alt={post.title}
//                       fill
//                       className="object-cover"
//                     />
//                   </div>
//                   <CardHeader>
//                     <div className="flex flex-wrap gap-2 mb-2">
//                       {post.tags.map((tag) => (
//                         <Badge
//                           key={tag}
//                           variant="outline"
//                           className="text-xs border-[#f36f0f] text-[#f36f0f]"
//                         >
//                           {tag}
//                         </Badge>
//                       ))}
//                     </div>
//                     <CardTitle>{post.title}</CardTitle>
//                   </CardHeader>
//                   <CardContent>
//                     <div className="flex items-center justify-between mb-5">
//                       <span className="text-sm text-gray-500">{post.date}</span>
//                       <Link
//                         href={`/blog/${post.slug}`}
//                         className="text-[#f36f0f] hover:underline font-medium text-base"
//                       >
//                         Lire plus
//                       </Link>
//                     </div>
//                   </CardContent>
//                 </Card>
//               ))
//             )}
//           </div>

//           {/* Pagination responsive */}
//           {totalPages > 1 && (
//             <div className="flex flex-wrap justify-center items-center gap-3 mt-12 mb-14">
//               <Button
//                 variant="outline"
//                 onClick={() => handlePageChange(currentPage - 1)}
//                 className="disabled:opacity-50 disabled:cursor-not-allowed bg-[#f36f0f] text-white hover:bg-[#f36f0f]/90 font-semibold rounded-full"
//                 disabled={currentPage === 1}
//               >
//                 Précédent
//               </Button>

//               {[...Array(totalPages)].map((_, index) => {
//                 const page = index + 1;
//                 const isActive = currentPage === page;

//                 return (
//                   <Button
//                     key={page}
//                     onClick={() => handlePageChange(page)}
//                     className={`font-semibold rounded-full ${
//                       isActive
//                         ? "bg-[#f36f0f] text-white"
//                         : "bg-white text-[#f36f0f] border border-[#f36f0f]"
//                     }`}
//                   >
//                     {page}
//                   </Button>
//                 );
//               })}

//               <Button
//                 variant="outline"
//                 onClick={() => handlePageChange(currentPage + 1)}
//                 className="disabled:opacity-50 disabled:cursor-not-allowed bg-[#f36f0f] text-white hover:bg-[#f36f0f]/90 font-semibold rounded-full"
//                 disabled={currentPage === totalPages}
//               >
//                 Suivant
//               </Button>
//             </div>
//           )}
//         </section>
//       </div>
//     </div>
//   );
// };

// export default Blog;
"use client";

import React, { Suspense, useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface BlogPost {
  id: number;
  title: string;
  description: string;
  slug: string;
  date: string;
  image: string;
  tags: string[];
  featured: boolean;
}

interface Category {
  name: string;
  count: number;
  icon: string;
}

interface BlogData {
  blogPosts: BlogPost[];
  categories: Category[];
}

const BlogContent = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [searchterm, setSearchterm] = useState("");
  const [blogData, setBlogData] = useState<BlogData | null>(null);
  const [filteredPosts, setFilteredPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const postsPerPage = 6;
  const [currentPage, setCurrentPage] = useState(1);

  // Récupération page URL
  useEffect(() => {
    const pageParam = searchParams.get("page");
    const page = pageParam ? parseInt(pageParam, 10) : 1;
    if (!isNaN(page) && page >= 1) {
      setCurrentPage(page);
    }
  }, [searchParams]);

  // Chargement des données
  useEffect(() => {
    const fetchBlogData = async () => {
      try {
        const response = await fetch("/data/blogs.json");
        if (!response.ok) {
          throw new Error("Erreur lors du chargement des données");
        }
        const data: BlogData = await response.json();
        setBlogData(data);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Une erreur est survenue"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchBlogData();
  }, []);

  // Filtrage dynamique
  useEffect(() => {
    if (!blogData) return;

    const regularPosts = blogData.blogPosts.filter((post) => !post.featured);

    if (searchterm.trim() === "") {
      setFilteredPosts(regularPosts);
    } else {
      const term = searchterm.toLowerCase();
      const filtered = regularPosts.filter(
        (post) =>
          post.title.toLowerCase().includes(term) ||
          post.description.toLowerCase().includes(term)
      );
      setFilteredPosts(filtered);
    }

    setCurrentPage(1);
  }, [searchterm, blogData]);

  const totalPages = Math.ceil(filteredPosts.length / postsPerPage);
  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = filteredPosts.slice(indexOfFirstPost, indexOfLastPost);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      router.push(`?page=${page}`);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-primary mx-auto mb-4" />
          <p className="text-gray-600">Chargement des articles...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">Erreur : {error}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary-600 transition-colors"
          >
            Réessayer
          </button>
        </div>
      </div>
    );
  }

  if (!blogData) return null;

  return (
    <div className="min-h-screen mt-24 py-16 px-4 sm:px-6 lg:px-8">
      <div className="container mx-auto">
        <section className="mb-12">
          {/* Barre de titre + recherche */}
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
              Derniers articles
            </h1>

            <div className="relative w-full md:w-96">
              <Input
                id="nom"
                value={searchterm}
                onChange={(e) => setSearchterm(e.target.value)}
                placeholder="Votre recherche ici..."
                className="h-12 pl-12 pr-4"
              />
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            </div>
          </div>

          {/* Articles Grid responsive */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {currentPosts.length === 0 ? (
              <p className="text-center col-span-full text-gray-500">
                Aucun article trouvé pour votre recherche.
              </p>
            ) : (
              currentPosts.map((post) => (
                <Card
                  key={post.id}
                  className="overflow-hidden hover:shadow-lg transition-shadow"
                >
                  <div className="aspect-video relative">
                    <Image
                      src={post.image || "/placeholder.svg"}
                      alt={post.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <CardHeader>
                    <div className="flex flex-wrap gap-2 mb-2">
                      {post.tags.map((tag) => (
                        <Badge
                          key={tag}
                          variant="outline"
                          className="text-xs border-[#f36f0f] text-[#f36f0f]"
                        >
                          {tag}
                        </Badge>
                      ))}
                    </div>
                    <CardTitle>{post.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between mb-5">
                      <span className="text-sm text-gray-500">{post.date}</span>
                      <Link
                        href={`/blog/${post.slug}`}
                        className="text-[#f36f0f] hover:underline font-medium text-base"
                      >
                        Lire plus
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>

          {/* Pagination responsive */}
          {totalPages > 1 && (
            <div className="flex flex-wrap justify-center items-center gap-3 mt-12 mb-14">
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
        </section>
      </div>
    </div>
  );
};

const Blog = () => {
  return (
    <Suspense fallback={<div>Chargement...</div>}>
      <BlogContent />
    </Suspense>
  );
};

export default Blog;
