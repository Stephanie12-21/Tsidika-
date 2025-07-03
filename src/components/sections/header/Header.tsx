"use client";

import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";

const navItems = [
  { label: "Accueil", href: "/" },
  { label: "Destinations", href: "/places" },
  { label: "Blog", href: "/blog" },
  { label: "Contact", href: "/contact" },
];

export function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const activeNav = pathname || "/";

  const handleNavClick = (href: string) => {
    setIsOpen(false); // Ferme le menu mobile
    router.push(href);
  };

  // Ferme le menu mobile quand la route change
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  return (
    <header className="fixed top-4 left-1/2 transform -translate-x-1/2 z-[1000] w-full max-w-8xl px-4">
      <nav className="bg-white/10 backdrop-blur-md border border-border/50 rounded-2xl shadow-lg relative overflow-hidden">
        {/* Effet de fond */}
        <div className="absolute -inset-1 bg-[#e85e03]/10 rounded-2xl pointer-events-none z-[-1]" />

        <div className="flex items-center justify-between px-6 py-4 relative z-10">
          {/* Logo */}
          <div className="flex items-center gap-2 text-2xl font-bold text-[#e85e03]">
            <Image
              src="/images/logo.png"
              alt="Tsidika Logo"
              width={36}
              height={36}
              className="rounded-full"
              priority
            />
            Tsidika
          </div>

          {/* Menu Desktop */}
          <ul className="hidden md:flex items-center gap-8">
            {navItems.map(({ href, label }) => (
              <li key={href} className="relative group">
                <button
                  onClick={() => handleNavClick(href)}
                  className="text-[#1C1817] font-medium relative"
                >
                  {label}
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{
                      width: activeNav === href ? "100%" : 0,
                    }}
                    transition={{ duration: 0.3 }}
                    className="absolute -bottom-1 left-0 h-0.5 bg-[#e85e03]"
                  />
                </button>
              </li>
            ))}
          </ul>

          {/* Bouton + menu burger */}
          <div className="flex items-center gap-4">
            {/* Réserver (desktop) */}
            <button
              className="hidden md:flex px-6 py-2.5 bg-[#e85e03] text-white rounded-lg font-medium shadow-lg hover:shadow-xl"
              onClick={() => handleNavClick("/contact")}
            >
              Réserver
            </button>

            {/* Burger (mobile) */}
            <button
              className="md:hidden text-[#1C1817]"
              onClick={() => setIsOpen(!isOpen)}
              aria-label="Menu"
            >
              {isOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>

        {/* Menu Mobile */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="md:hidden px-6 pb-4 bg-transparent z-[1000] relative rounded-b-2xl"
            >
              <ul className="flex flex-col gap-4 mt-2">
                {navItems.map(({ href, label }) => (
                  <li key={href}>
                    <button
                      onClick={() => handleNavClick(href)}
                      className="w-full text-left text-[#1C1817] font-medium py-2"
                    >
                      {label}
                    </button>
                  </li>
                ))}
                <button
                  onClick={() => handleNavClick("/contact")}
                  className="w-full mt-4 bg-[#e85e03] text-white rounded-lg py-2 font-medium shadow-md"
                >
                  Réserver
                </button>
              </ul>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </header>
  );
}
