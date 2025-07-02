"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";

// Import Lightbox et styles
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";

interface Section {
  title: string;
  content: string;
}

interface BlogArticle {
  title: string;
  introduction: string;
  sections: Section[];
  conclusion: string;
  images?: string[];
}

export default function BlogArticlePage() {
  const params = useParams();
  const slugParam = params.slug;
  const slug = Array.isArray(slugParam) ? slugParam[0] : slugParam;

  const [article, setArticle] = useState<BlogArticle | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Lightbox state
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        const res = await fetch("/data/bloginfo.json");
        if (!res.ok) throw new Error("Erreur de récupération du fichier JSON");

        const articles = await res.json();
        const found = slug ? articles[slug] : undefined;
        if (!found) throw new Error("Article non trouvé");

        setArticle(found);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Erreur inconnue");
      } finally {
        setLoading(false);
      }
    };

    fetchArticle();
  }, [slug]);

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
        Chargement...
      </div>
    );
  if (error)
    return (
      <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
        Erreur: {error}
      </div>
    );
  if (!article)
    return (
      <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
        Article introuvable.
      </div>
    );

  return (
    <main className="container mx-auto px-4 py-12 mt-24 max-w-4xl">
      <h1 className="text-3xl font-bold mb-6 capitalize">{article.title}</h1>

      {/* Afficher la première image cliquable */}
      {article.images && article.images.length > 0 && (
        <div
          className="mb-8 cursor-pointer relative w-full h-[400px] rounded-lg overflow-hidden"
          onClick={() => {
            setLightboxIndex(0);
            setLightboxOpen(true);
          }}
        >
          <Image
            src={article.images[0]}
            alt={`${article.title} - image 1`}
            fill
            style={{ objectFit: "cover" }}
            className="rounded-lg"
            priority={true}
          />
        </div>
      )}

      <p className="text-lg mb-6">{article.introduction}</p>

      {article.sections.map((section, idx) => (
        <section key={idx} className="mb-8">
          <h2 className="text-xl font-semibold mb-2">{section.title}</h2>
          <p className="text-gray-700 whitespace-pre-line">{section.content}</p>
        </section>
      ))}

      <p className="mt-8 italic">{article.conclusion}</p>

      {/* Lightbox */}
      <Lightbox
        open={lightboxOpen}
        close={() => setLightboxOpen(false)}
        slides={article.images?.map((src) => ({ src })) || []}
        index={lightboxIndex}
      />
    </main>
  );
}
