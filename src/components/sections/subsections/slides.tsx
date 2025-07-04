"use client";

import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useState } from "react";

interface Slide {
  id: string | number;
  thumbnail: string;
}

interface Props {
  slides: Slide[];
  currentSlide: number;
  goToSlide: (index: number) => void;
  prevSlide: () => void;
  nextSlide: () => void;
}

function useWindowWidth(): number {
  const [width, setWidth] = useState(
    typeof window !== "undefined" ? window.innerWidth : 0
  );

  useEffect(() => {
    function onResize() {
      setWidth(window.innerWidth);
    }
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  return width;
}

export function SlideControlsMobile({
  slides,
  currentSlide,
  goToSlide,
  prevSlide,
  nextSlide,
}: Props) {
  const width = useWindowWidth();

  let maxVisibleSlides = 3;
  if (width >= 640) maxVisibleSlides = 5;
  if (width >= 1024) maxVisibleSlides = slides.length;

  const half = Math.floor(maxVisibleSlides / 2);
  let start = currentSlide - half;
  if (start < 0) start = 0;

  let end = start + maxVisibleSlides;
  if (end > slides.length) {
    end = slides.length;
    start = Math.max(0, end - maxVisibleSlides);
  }

  const visibleSlides = slides.slice(start, end);

  return (
    <motion.div
      className="flex lg:hidden overflow-x-hidden justify-center order-2 py-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.8 }}
    >
      <div className="flex items-center space-x-4 sm:space-x-6 p-4 overflow-x-hidden">
        <Button
          variant="ghost"
          size="icon"
          onClick={prevSlide}
          className="h-10 w-10 sm:h-12 sm:w-12 rounded-full bg-white/10 text-white backdrop-blur-sm hover:bg-[#f36f0f]/80 border border-white/20 hover:border-[#f36f0f] transition-all duration-300 group"
        >
          <ChevronLeft className="h-5 w-5 sm:h-6 sm:w-6 group-hover:-translate-x-0.5 transition-transform" />
        </Button>

        <div className="flex space-x-2 sm:space-x-3">
          {visibleSlides.map((slide, idx) => {
            const realIndex = start + idx;
            return (
              <motion.button
                key={slide.id}
                onClick={() => goToSlide(realIndex)}
                className={`relative overflow-hidden rounded-xl transition-all duration-300 border-2 ${
                  realIndex === currentSlide
                    ? "border-[#f36f0f] shadow-lg shadow-[#f36f0f]/50 scale-110"
                    : "border-white/20 opacity-70 hover:opacity-100 hover:border-white/40"
                }`}
                whileHover={{
                  scale: realIndex === currentSlide ? 1.1 : 1.05,
                }}
                whileTap={{ scale: 0.95 }}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{
                  opacity: 1,
                  scale: realIndex === currentSlide ? 1.1 : 1,
                }}
                transition={{ duration: 0.3 }}
              >
                <div
                  className="w-20 sm:w-24 md:w-28 aspect-[16/9] bg-cover bg-center"
                  style={{ backgroundImage: `url(${slide.thumbnail})` }}
                />
                {realIndex === currentSlide && (
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-t from-[#f36f0f]/30 to-transparent"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                  />
                )}
              </motion.button>
            );
          })}
        </div>

        <Button
          variant="ghost"
          size="icon"
          onClick={nextSlide}
          className="h-10 w-10 sm:h-12 sm:w-12 rounded-full bg-white/10 text-white backdrop-blur-sm hover:bg-[#f36f0f]/80 border border-white/20 hover:border-[#f36f0f] transition-all duration-300 group"
        >
          <ChevronRight className="h-5 w-5 sm:h-6 sm:w-6 group-hover:translate-x-0.5 transition-transform" />
        </Button>
      </div>
    </motion.div>
  );
}
