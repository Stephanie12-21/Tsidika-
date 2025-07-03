"use client";

import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
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
  const activeNav = pathname || "/";
  const [isOpen, setIsOpen] = useState(false);

  const handleNavClick = (href: string) => {
    setIsOpen(false); // fermer le menu mobile
    router.push(href);
  };

  return (
    <motion.header
      className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 w-full max-w-8xl px-4"
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
    >
      <motion.nav
        className="bg-white/10 backdrop-blur-md border border-border/50 rounded-2xl shadow-lg relative overflow-hidden group"
        whileHover="hover"
        initial="initial"
      >
        <motion.div className="absolute -inset-1 bg-[#e85e03]/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

        <div className="flex items-center justify-between px-6 py-4 relative z-10">
          {/* Logo */}
          <motion.div
            className="flex items-center gap-2 text-2xl font-bold text-[#e85e03]"
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 400, damping: 25 }}
          >
            <Image
              src="/images/logo.png"
              alt="Tsidika Logo"
              width={36}
              height={36}
              className="rounded-full"
              priority
            />
            Tsidika
          </motion.div>

          {/* Navigation Desktop */}
          <ul className="hidden md:flex items-center gap-8">
            {navItems.map(({ href, label }) => (
              <li key={href} className="relative group">
                <button
                  onClick={() => handleNavClick(href)}
                  className="text-[#1C1817] transition-colors duration-300 font-medium relative cursor-pointer"
                >
                  {label}
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{
                      width: activeNav === href ? "100%" : undefined,
                    }}
                    whileHover={{ width: "100%" }}
                    className="absolute -bottom-1 left-0 h-0.5 bg-[#e85e03] transition-all duration-300"
                  />
                </button>
              </li>
            ))}
          </ul>

          {/* Actions (mobile + desktop) */}
          <div className="flex items-center gap-4">
            {/* Réserver bouton visible partout */}
            <motion.button
              className="hidden md:flex items-center gap-2 px-6 py-2.5 bg-[#e85e03] text-white rounded-lg font-medium shadow-lg hover:shadow-xl transition-shadow duration-300"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Réserver
            </motion.button>

            {/* Hamburger menu (mobile) */}
            <button
              className="md:hidden text-[#1C1817]"
              onClick={() => setIsOpen(!isOpen)}
              aria-label="Menu"
            >
              {isOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>

        {/* Menu mobile */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="md:hidden px-6 pb-4"
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
                <motion.button
                  onClick={() => router.push("/contact")}
                  className="w-full mt-4 bg-[#e85e03] text-white rounded-lg py-2 font-medium shadow-md"
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                >
                  Réserver
                </motion.button>
              </ul>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>
    </motion.header>
  );
}
