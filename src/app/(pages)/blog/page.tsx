"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  CalendarDays,
  Clock,
  MapPin,
  Plane,
  Star,
  Loader2,
} from "lucide-react";

interface BlogPost {
  id: number;
  title: string;
  description: string;
  author: string;
  date: string;
  readTime: string;
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

const Blog = () => {
  const [blogData, setBlogData] = useState<BlogData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-primary mx-auto mb-4" />
          <p className="text-gray-600">Chargement des articles...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-50 flex items-center justify-center">
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

  if (!blogData) {
    return null;
  }

  const { blogPosts, categories } = blogData;
  const featuredPost = blogPosts.find((post) => post.featured);
  const regularPosts = blogPosts.filter((post) => !post.featured);

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-50">
      <main className="container mx-auto px-4 py-8">
        {/* Categories */}
        <section className="mb-12 mt-24">
          <div className="flex flex-wrap gap-4 justify-center">
            {categories.map((category) => (
              <Link
                key={category.name}
                href={`/category/${category.name.toLowerCase()}`}
                className="flex items-center gap-2 bg-white px-4 py-2 rounded-full border border-gray-200 hover:border-primary hover:shadow-md transition-all"
              >
                <span className="text-lg">{category.icon}</span>
                <span className="font-medium text-gray-800 hover:text-primary transition-colors">
                  {category.name}
                </span>
                <span className="text-sm text-gray-500">
                  ({category.count})
                </span>
              </Link>
            ))}
          </div>
        </section>

        {/* Featured Article */}
        {featuredPost && (
          <section className="mb-12">
            <div className="flex items-center gap-2 mb-6">
              <Star className="w-5 h-5 text-primary fill-current" />
              <h2 className="text-2xl font-bold text-gray-800">À la une</h2>
            </div>
            <Card className="overflow-hidden shadow-lg hover:shadow-xl transition-shadow">
              <div className="md:flex">
                <div className="md:w-1/2">
                  <Image
                    src={featuredPost.image || "/placeholder.svg"}
                    alt={featuredPost.title}
                    width={600}
                    height={300}
                    className="w-full h-64 md:h-full object-cover"
                  />
                </div>
                <div className="md:w-1/2 p-6">
                  <div className="flex flex-wrap gap-2 mb-3">
                    {featuredPost.tags.map((tag) => (
                      <Badge
                        key={tag}
                        className="bg-primary/10 text-primary border-0"
                      >
                        {tag}
                      </Badge>
                    ))}
                  </div>
                  <h3 className="text-2xl font-bold mb-3 text-gray-800">
                    {featuredPost.title}
                  </h3>
                  <p className="text-gray-600 mb-4">
                    {featuredPost.description}
                  </p>
                  <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
                    <div className="flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      {featuredPost.author}
                    </div>
                    <div className="flex items-center gap-1">
                      <CalendarDays className="w-4 h-4" />
                      {featuredPost.date}
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {featuredPost.readTime}
                    </div>
                  </div>
                  <Link
                    href={`/blog/${featuredPost.id}`}
                    className="inline-flex items-center bg-primary text-white px-6 py-3 rounded-lg hover:bg-primary-600 transition-colors font-medium"
                  >
                    Lire l&apos;article
                    <Plane className="w-4 h-4 ml-2" />
                  </Link>
                </div>
              </div>
            </Card>
          </section>
        )}

        {/* Articles Grid */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6 text-gray-800">
            Derniers articles
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {regularPosts.map((post) => (
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
                        className="text-xs border-primary/30 text-primary"
                      >
                        {tag}
                      </Badge>
                    ))}
                  </div>
                  <CardTitle className="line-clamp-2">{post.title}</CardTitle>
                  <CardDescription className="line-clamp-3">
                    {post.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between text-sm text-gray-500 mb-3">
                    <div className="flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      {post.author}
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {post.readTime}
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">{post.date}</span>
                    <Link
                      href={`/blog/${post.id}`}
                      className="text-primary hover:underline font-medium text-sm"
                    >
                      Lire plus →
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
};

export default Blog;
