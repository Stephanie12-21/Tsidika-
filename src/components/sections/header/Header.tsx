"use client";

import { motion } from "framer-motion";
import { Globe } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { usePathname, useRouter } from "next/navigation";

interface NavItem {
  label: { FR: string; EN: string };
  href: string;
}

const navItems: NavItem[] = [
  { label: { FR: "Accueil", EN: "Home" }, href: "/" },
  { label: { FR: "Destinations", EN: "Destinations" }, href: "/places" },
  { label: { FR: "Blog", EN: "Blog" }, href: "/blog" },
  { label: { FR: "Contact", EN: "Contact" }, href: "/contact" },
];

export function Header() {
  const [currentLang, setCurrentLang] = useState<"FR" | "EN">("FR");
  const pathname = usePathname();
  const router = useRouter();

  // L'état actif est déterminé automatiquement par le pathname actuel
  const activeNav = pathname || "/";

  const toggleLanguage = () => {
    setCurrentLang((prev) => (prev === "FR" ? "EN" : "FR"));
  };

  const handleNavClick = (href: string) => {
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

          {/* Navigation */}
          <ul className="hidden md:flex items-center gap-8">
            {navItems.map(({ href, label }) => (
              <li key={href} className="relative group">
                <button
                  onClick={() => handleNavClick(href)}
                  className="text-[#1C1817] transition-colors duration-300 font-medium relative cursor-pointer"
                >
                  {label[currentLang]}
                  {/* underline animation on hover and active */}
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

          {/* Actions */}
          <div className="flex items-center gap-4">
            {/* Language Switcher simple toggle */}
            <motion.button
              onClick={toggleLanguage}
              className="flex items-center gap-2 px-3 py-2 rounded-lg bg-muted/50 hover:bg-muted transition-colors duration-300 text-sm font-medium"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              aria-label="Toggle language"
            >
              <Globe className="h-4 w-4" />
              <span>{currentLang === "FR" ? "FR" : "EN"}</span>
            </motion.button>

            {/* Réserver Button */}
            <motion.button
              className="flex items-center gap-2 px-6 py-2.5 bg-[#e85e03] text-white rounded-lg font-medium shadow-lg hover:shadow-xl transition-shadow duration-300"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <span>{currentLang === "FR" ? "Réserver" : "Book Now"}</span>
            </motion.button>
          </div>
        </div>
      </motion.nav>
    </motion.header>
  );
}
// "use client";

// import { motion } from "framer-motion";
// import { Globe } from "lucide-react";
// import Image from "next/image";
// import { useState } from "react";
// import { usePathname, useRouter } from "next/navigation";

// interface NavItem {
//   label: { FR: string; EN: string };
//   href: string;
// }

// const navItems: NavItem[] = [
//   { label: { FR: "Accueil", EN: "Home" }, href: "/" },
//   { label: { FR: "Destinations", EN: "Destinations" }, href: "/places" },
//   { label: { FR: "Blog", EN: "Blog" }, href: "/blog" },
//   { label: { FR: "Contact", EN: "Contact" }, href: "/contact" },
// ];

// export function Header() {
//   const [currentLang, setCurrentLang] = useState<"FR" | "EN">("FR");
//   const pathname = usePathname();
//   const router = useRouter();

//   // Etat actif déterminé automatiquement par le pathname
//   const activeNav = pathname || "/";

//   const toggleLanguage = () => {
//     setCurrentLang((prev) => (prev === "FR" ? "EN" : "FR"));
//   };

//   const handleNavClick = (href: string) => {
//     router.push(href);
//   };

//   return (
//     <motion.header
//       className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 w-full max-w-8xl px-4"
//       initial={{ y: -100, opacity: 0 }}
//       animate={{ y: 0, opacity: 1 }}
//       transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
//     >
//       <motion.nav
//         className="bg-white/10 backdrop-blur-md border border-border/50 rounded-2xl shadow-lg relative overflow-hidden group"
//         initial="initial"
//       >
//         {/* Background toujours visible */}
//         <motion.div className="absolute -inset-1 bg-[#e85e03]/10 rounded-2xl opacity-100 transition-opacity duration-500" />

//         <div className="flex items-center justify-between px-6 py-4 relative z-10">
//           {/* Logo */}
//           <motion.div
//             className="flex items-center gap-2 text-2xl font-bold text-[#e85e03]"
//             whileHover={{ scale: 1.05 }}
//             transition={{ type: "spring", stiffness: 400, damping: 25 }}
//           >
//             <Image
//               src="/images/logo.png"
//               alt="Tsidika Logo"
//               width={36}
//               height={36}
//               className="rounded-full"
//               priority
//             />
//             Tsidika
//           </motion.div>

//           {/* Navigation */}
//           <ul className="hidden md:flex items-center gap-8">
//             {navItems.map(({ href, label }) => (
//               <li key={href} className="relative group">
//                 <button
//                   onClick={() => handleNavClick(href)}
//                   className="text-[#1C1817] transition-colors duration-300 font-medium relative cursor-pointer"
//                 >
//                   {label[currentLang]}

//                   {/* Underline animée sur hover et si actif */}
//                   <motion.div
//                     initial={{ width: 0 }}
//                     animate={{
//                       width: activeNav === href ? "100%" : undefined,
//                     }}
//                     whileHover={{ width: "100%" }}
//                     className="absolute -bottom-1 left-0 h-0.5 bg-[#e85e03] transition-all duration-300"
//                   />
//                 </button>
//               </li>
//             ))}
//           </ul>

//           {/* Actions */}
//           <div className="flex items-center gap-4">
//             {/* Language Switcher simple toggle */}
//             <motion.button
//               onClick={toggleLanguage}
//               className="flex items-center gap-2 px-3 py-2 rounded-lg bg-muted/50 hover:bg-muted transition-colors duration-300 text-sm font-medium"
//               whileHover={{ scale: 1.05 }}
//               whileTap={{ scale: 0.95 }}
//               aria-label="Toggle language"
//             >
//               <Globe className="h-4 w-4" />
//               <span>{currentLang === "FR" ? "FR" : "EN"}</span>
//             </motion.button>

//             {/* Réserver Button */}
//             <motion.button
//               className="flex items-center gap-2 px-6 py-2.5 bg-[#e85e03] text-white rounded-lg font-medium shadow-lg hover:shadow-xl transition-shadow duration-300"
//               whileHover={{ scale: 1.05 }}
//               whileTap={{ scale: 0.95 }}
//             >
//               <span>{currentLang === "FR" ? "Réserver" : "Book Now"}</span>
//             </motion.button>
//           </div>
//         </div>
//       </motion.nav>
//     </motion.header>
//   );
// }
