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

  // 2. Création du PDF
  const pdfDoc = await PDFDocument.create();
  let page = pdfDoc.addPage([600, 800]);
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

  let y = 760;

  const drawLine = (
    text: string,
    size = 12,
    bold = false,
    color = rgb(0, 0, 0),
    x = 50
  ) => {
    const usedFont = bold ? boldFont : font;
    page.drawText(text, { x, y, size, font: usedFont, color });
    y -= size + 5;
  };

  // Fond orange + texte blanc centré
  const title = "Confirmation de Réservation";
  const titleSize = 16;
  const titleWidth = boldFont.widthOfTextAtSize(title, titleSize);
  const centerX = (600 - titleWidth) / 2;

  page.drawRectangle({
    x: 0,
    y: y - 10,
    width: 600,
    height: 30,
    color: rgb(0.953, 0.435, 0.059), // #f36f0f
  });

  drawLine(title, titleSize, true, rgb(1, 1, 1), centerX);
  y -= 10;

  drawLine(`Nom : ${nom}`);
  drawLine(`Email : ${email}`);
  drawLine(`Téléphone : +${phone}`);
  drawLine(`Voyage : ${trip.titre} (${trip.localisation})`);
  drawLine(`Durée : ${trip.durée} jours`);
  drawLine(`Nombre de personnes : ${personnes}`);
  drawLine(`Prix unitaire : ${trip.prix} €`);
  drawLine(`Total : ${trip.prix * personnes} €`);

  y -= 10;
  drawLine("Programme :", 14, true);

  for (const [jour, details] of Object.entries(trip.programme)) {
    drawLine(`${jour} : ${details.titre}`, 12, true);
    drawLine(details.description, 10);
    for (const act of details.activites) {
      drawLine(`• ${act}`, 10);
    }
    y -= 5;
    drawLine(`Hébergement : ${details.hebergement ?? "Non précisé"}`, 10);
    drawLine(`Repas : ${details.repas.join(", ")}`, 10);
    y -= 10;

    // Nouvelle page si trop bas
    if (y < 100) {
      page = pdfDoc.addPage([600, 800]);
      y = 760;
    }
  }

  y -= 10;
  drawLine("Inclus :", 14, true);
  trip.inclus.forEach((item: string) => drawLine(` ${item}`, 10));

  y -= 10;
  drawLine("Non inclus :", 14, true);
  trip.nonInclus.forEach((item: string) => drawLine(` ${item}`, 10));

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
    from: '"Voyage Madagascar" <no-reply@tonsite.com>',
    to: email,
    subject: `Confirmation - ${trip.titre}`,
    text: `Bonjour ${nom},

Votre réservation pour le voyage "${trip.titre}" a bien été enregistrée.

Vous trouverez en pièce jointe la fiche complète de votre voyage.

Merci de votre confiance !`,
    attachments: [
      {
        filename: `fiche-voyage-${slug}.pdf`,
        content: Buffer.from(pdfBytes),
        contentType: "application/pdf",
      },
    ],
  });

  return NextResponse.json({ success: true });
}
