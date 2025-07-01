"use client";

import { Card, CardContent } from "@/components/ui/card";
import {
  MapPin,
  Phone,
  Mail,
  Globe,
  Facebook,
  Linkedin,
  Instagram,
} from "lucide-react";
import { FaWhatsapp } from "react-icons/fa";
import Newsletterbutton from "@/components/sections/footer/newsletterbutton";

const iconButtonClasses =
  "w-10 h-10 bg-[#F36F0F] rounded-full flex items-center justify-center hover:bg-[#E55A00] transition-all shadow-lg hover:shadow-xl transform hover:scale-110";

const socialIcons = [
  {
    Icon: Facebook,
    label: "Facebook",
    href: "https://www.facebook.com/stephanie.maminiaina.12",
  },
  {
    Icon: Linkedin,
    label: "Linkedin",
    href: "https://www.linkedin.com/in/st%C3%A9phanie-maminiaina-262066303/",
  },
  {
    Icon: Instagram,
    label: "Instagram",
    href: "https://www.instagram.com/stephaniiiiiiiiiiieeee/",
  },
  {
    Icon: FaWhatsapp,
    label: "WhatsApp",
    href: "https://wa.me/261381182627",
  },
];

export default function ContactDetails() {
  return (
    <Card className="bg-[#1C1817] text-white border-0 shadow-xl h-full">
      <CardContent className="p-8 space-y-8">
        <section>
          <h3 className="text-2xl font-bold mb-4">Adresse</h3>
          <div className="flex items-start space-x-3">
            <MapPin className="text-[#F36F0F] mt-1" />
            <p>Toliara Centre</p>
          </div>
          <div className="flex items-start space-x-3 mt-4">
            <MapPin className="text-[#F36F0F] mt-1" />
            <p>Tuléar 601, Madagascar</p>
          </div>
        </section>

        <section>
          <h3 className="text-2xl font-bold mb-4">Contact</h3>
          <div className="space-y-3">
            <div className="flex items-center space-x-3">
              <Phone className="text-[#F36F0F]" />
              <a href="tel:+261325427839" className="hover:underline">
                +(261) 32 54 278 39
              </a>
            </div>
            <div className="flex items-center space-x-3">
              <FaWhatsapp className="text-[#F36F0F]" />
              <a
                href="https://wa.me/261381182627"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:underline"
              >
                +(261) 38 11 826 27
              </a>
            </div>
            <div className="flex items-center space-x-3">
              <Mail className="text-[#F36F0F]" />
              <a
                href="mailto:stephaniepageot42@gmail.com"
                className="hover:underline"
              >
                stephaniepageot42@gmail.com
              </a>
            </div>
            <div className="flex items-center space-x-3">
              <Globe className="text-[#F36F0F]" />
              <a
                href="https://stephanie-maminiaina.vercel.app/"
                className="hover:underline"
              >
                Portfolio
              </a>
            </div>
          </div>
        </section>

        <section aria-label="Réseaux sociaux">
          <h3 className="text-2xl font-bold mb-4">Restez connecté</h3>
          <div className="flex gap-3 mb-4">
            {socialIcons.map(({ Icon, label, href }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className={iconButtonClasses}
                aria-label={label}
                title={label}
              >
                <Icon className="h-5 w-5 text-white" />
              </a>
            ))}
          </div>
          <Newsletterbutton />
        </section>
      </CardContent>
    </Card>
  );
}
