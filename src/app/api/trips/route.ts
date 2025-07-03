import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";
import { PDFDocument, StandardFonts, rgb } from "pdf-lib";
import { createTransport } from "nodemailer";

export async function POST(req: Request) {
  const data = await req.json();
  const { nom, email, personnes, phone, slug } = data;

  // 1. Lire trips.json depuis public
  const filePath = path.join(process.cwd(), "public/data/trips.json");
  const fileContent = await fs.readFile(filePath, "utf-8");

  type Trip = {
    slug: string;
    titre: string;
    localisation: string;
    durée: number;
    prix: number;
    inclus: string[];
    nonInclus: string[];
    programme: {
      [jour: string]: {
        titre: string;
        description: string;
        activites: string[];
        hebergement?: string;
        repas: string[];
      };
    };
  };

  const trips: Trip[] = JSON.parse(fileContent);
  const trip = trips.find((t: Trip) => t.slug === slug);

  if (!trip) {
    return NextResponse.json({ error: "Voyage introuvable" }, { status: 404 });
  }

  // 2. Création du PDF avec design amélioré
  const pdfDoc = await PDFDocument.create();
  let page = pdfDoc.addPage([595, 842]); // Format A4

  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  const italicFont = await pdfDoc.embedFont(StandardFonts.HelveticaOblique);

  // Couleurs
  const primaryColor = rgb(0.953, 0.435, 0.059); // Orange principal
  const secondaryColor = rgb(0.2, 0.4, 0.6); // Bleu foncé
  const lightGray = rgb(0.95, 0.95, 0.95);
  const darkGray = rgb(0.3, 0.3, 0.3);
  const white = rgb(1, 1, 1);
  const black = rgb(0, 0, 0);

  let y = 800;
  const margin = 50;
  const pageWidth = 595;
  const contentWidth = pageWidth - margin * 2;

  // Fonction pour dessiner une section avec fond coloré
  const drawSection = (
    title: string,
    bgColor = lightGray,
    textColor = black
  ) => {
    page.drawRectangle({
      x: margin,
      y: y - 25,
      width: contentWidth,
      height: 25,
      color: bgColor,
    });

    page.drawText(title, {
      x: margin + 10,
      y: y - 18,
      size: 12,
      font: boldFont,
      color: textColor,
    });

    y -= 35;
  };

  // Fonction pour dessiner du texte avec style
  const drawText = (
    text: string,
    size = 10,
    fontType: "normal" | "bold" | "italic" = "normal",
    color = black,
    x = margin + 10,
    indent = 0
  ) => {
    const usedFont =
      fontType === "bold"
        ? boldFont
        : fontType === "italic"
        ? italicFont
        : font;
    page.drawText(text, {
      x: x + indent,
      y,
      size,
      font: usedFont,
      color,
    });
    y -= size + 4;
  };

  // Fonction pour dessiner une ligne de séparation
  const drawSeparator = () => {
    page.drawLine({
      start: { x: margin, y: y },
      end: { x: pageWidth - margin, y: y },
      thickness: 1,
      color: lightGray,
    });
    y -= 10;
  };

  // Fonction pour vérifier si on a besoin d'une nouvelle page
  const checkNewPage = (requiredSpace = 100) => {
    if (y < requiredSpace) {
      page = pdfDoc.addPage([595, 842]);
      y = 800;
      return true;
    }
    return false;
  };

  // En-tête principal avec dégradé visuel
  page.drawRectangle({
    x: 0,
    y: y - 60,
    width: pageWidth,
    height: 60,
    color: primaryColor,
  });

  // Titre principal centré
  const mainTitle = "CONFIRMATION DE RÉSERVATION";
  const titleWidth = boldFont.widthOfTextAtSize(mainTitle, 18);
  const centerX = (pageWidth - titleWidth) / 2;

  page.drawText(mainTitle, {
    x: centerX,
    y: y - 25,
    size: 18,
    font: boldFont,
    color: white,
  });


  y -= 80;

  // Section informations client
  drawSection("INFORMATIONS CLIENT", secondaryColor, white);

  // Grille d'informations client
  const clientInfo = [
    [`Nom complet:`, nom],
    [`Email:`, email],
    [`Téléphone:`, `+${phone}`],
    [`Nombre de personnes:`, personnes.toString()],
  ];

  clientInfo.forEach(([label, value]) => {
    page.drawText(label, {
      x: margin + 10,
      y,
      size: 10,
      font: boldFont,
      color: darkGray,
    });

    page.drawText(value, {
      x: margin + 150,
      y,
      size: 10,
      font: font,
      color: black,
    });

    y -= 18;
  });

  y -= 10;
  drawSeparator();

  // Section détails du voyage
  drawSection("DETAILS DU VOYAGE", primaryColor, white);

  drawText(trip.titre, 14, "bold", secondaryColor);
  drawText(`Localisation: ${trip.localisation}`, 11, "italic", darkGray);
  y -= 5;

  // Informations voyage en colonnes
  const tripDetails = [
    [`Durée:`, `${trip.durée} jours`],
    [`Prix unitaire:`, `${trip.prix} €`],
    [`Prix total:`, `${trip.prix * personnes} €`],
  ];

  tripDetails.forEach(([label, value]) => {
    page.drawText(label, {
      x: margin + 10,
      y,
      size: 10,
      font: boldFont,
      color: darkGray,
    });

    page.drawText(value, {
      x: margin + 150,
      y,
      size: 10,
      font: font,
      color: black,
    });

    y -= 18;
  });

  y -= 10;
  drawSeparator();

  // Section programme
  drawSection("PROGRAMME DETAILLE", secondaryColor, white);

  for (const [jour, details] of Object.entries(trip.programme)) {
    checkNewPage(120);

    // Jour avec fond coloré
    page.drawRectangle({
      x: margin + 5,
      y: y - 20,
      width: contentWidth - 10,
      height: 20,
      color: lightGray,
    });

    drawText(
      `${jour}: ${details.titre}`,
      11,
      "bold",
      secondaryColor,
      margin + 10
    );
    drawText(details.description, 9, "italic", darkGray, margin + 10);

    y -= 5;

    // Activités
    if (details.activites.length > 0) {
      drawText("Activités:", 9, "bold", darkGray, margin + 10);
      details.activites.forEach((activite) => {
        drawText(`• ${activite}`, 9, "normal", black, margin + 10, 10);
      });
    }

    // Hébergement et repas
    if (details.hebergement) {
      drawText(
        `Hebergement: ${details.hebergement}`,
        9,
        "normal",
        darkGray,
        margin + 10
      );
    }

    if (details.repas.length > 0) {
      drawText(
        `Repas: ${details.repas.join(", ")}`,
        9,
        "normal",
        darkGray,
        margin + 10
      );
    }

    y -= 15;
  }

  checkNewPage(150);
  drawSeparator();

  // Section inclus/non inclus en deux colonnes
  drawSection("PRESTATIONS", primaryColor, white);

  const midPoint = pageWidth / 2;

  // Colonne gauche - Inclus
  page.drawRectangle({
    x: margin,
    y: y - 20,
    width: contentWidth / 2 - 5,
    height: 20,
    color: rgb(0.8, 0.95, 0.8), // Vert clair
  });

  page.drawText("INCLUS", {
    x: margin + 10,
    y: y - 13,
    size: 10,
    font: boldFont,
    color: rgb(0, 0.6, 0),
  });

  // Colonne droite - Non inclus
  page.drawRectangle({
    x: midPoint + 5,
    y: y - 20,
    width: contentWidth / 2 - 5,
    height: 20,
    color: rgb(0.95, 0.8, 0.8), // Rouge clair
  });

  page.drawText("NON INCLUS", {
    x: midPoint + 15,
    y: y - 13,
    size: 10,
    font: boldFont,
    color: rgb(0.8, 0, 0),
  });

  y -= 30;

  const maxItems = Math.max(trip.inclus.length, trip.nonInclus.length);

  for (let i = 0; i < maxItems; i++) {
    if (i < trip.inclus.length) {
      page.drawText(`• ${trip.inclus[i]}`, {
        x: margin + 10,
        y,
        size: 9,
        font: font,
        color: black,
      });
    }

    if (i < trip.nonInclus.length) {
      page.drawText(`• ${trip.nonInclus[i]}`, {
        x: midPoint + 15,
        y,
        size: 9,
        font: font,
        color: black,
      });
    }

    y -= 15;
  }

  // Pied de page
  y = 50;
  page.drawRectangle({
    x: 0,
    y: 0,
    width: pageWidth,
    height: 40,
    color: darkGray,
  });

  page.drawText(
    "Merci de votre confiance ! Pour toute question, contactez-nous.",
    {
      x: margin,
      y: 20,
      size: 10,
      font: font,
      color: white,
    }
  );

  const pdfBytes = await pdfDoc.save();

  // 3. Envoi de l'email avec le PDF en pièce jointe
  const transporter = createTransport({
    host: process.env.SMTP_HOST,
    port: 465,
    secure: true,
    auth: {
      user: process.env.SMTP_USER!,
      pass: process.env.SMTP_PASS!,
    },
  });

  await transporter.sendMail({
    from: '"Tsidika" <no-reply@tonsite.com>',
    to: email,
    subject: `Confirmation - ${trip.titre}`,
    text: `Bonjour ${nom},

Votre réservation pour le voyage "${trip.titre}" a bien été enregistrée.

Vous trouverez en pièce jointe la fiche complète de votre voyage avec tous les détails.

Nous avons hâte de vous accompagner dans cette belle aventure !

Cordialement,
L'équipe de Tsidika`,
    attachments: [
      {
        filename: `confirmation-voyage-${slug}.pdf`,
        content: Buffer.from(pdfBytes),
        contentType: "application/pdf",
      },
    ],
  });

  return NextResponse.json({ success: true });
}
