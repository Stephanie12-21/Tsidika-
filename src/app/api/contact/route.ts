import nodemailer from "nodemailer";
import { NextResponse } from "next/server";

interface ContactFormData {
  nom: string;
  prenom: string;
  email: string;
  Phone: string;
  object: string;
  message: string;
}

async function sendMessageContact({
  nom,
  prenom,
  email,
  Phone,
  object,
  message,
}: ContactFormData): Promise<void> {
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT),
    secure: process.env.SMTP_PORT === "465",
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  const mailOptions = {
    from: email,
    to: process.env.SMTP_USER,
    subject: object,
    html: `
      <div style="font-family: Segoe UI, Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f0f4f8; border-radius: 10px;">
        <div style="background-color: #f36f0f; padding: 30px; border-radius: 8px 8px 0 0; text-align: center; margin-bottom: 20px;">
          <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: bold; text-shadow: 1px 1px 2px rgba(0,0,0,0.1);">
            Nouveau message depuis votre site Tsidika
          </h1>
        </div>
        <div style="padding: 30px; background-color: #ffffff; border-radius: 8px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); line-height: 1.6; color: #333333;">
          <p style="font-size: 24px; margin-bottom: 20px;">Bonjour cher administrateur,</p>
          <p style="font-size: 16px; margin-bottom: 20px;">
            Vous avez reçu un nouveau message de la part de 
            <strong style="color: #f36f0f;">${prenom} ${nom}</strong>
          </p>
          <div style="background-color: #f0f4f8; border-left: 4px solid #f36f0f; padding: 15px; margin-bottom: 20px; border-radius: 0 8px 8px 0;">
            <h2 style="font-size: 18px; font-weight: bold; color: #f36f0f; margin-bottom: 10px;">Message :</h2>
            <p style="font-size: 16px; margin-bottom: 0; white-space: pre-wrap;">${message}</p>
          </div>
          <hr style="border: 1px solid #e2e8f0; margin: 30px 0;" />
          <h2 style="font-size: 20px; font-weight: bold; color: #f36f0f; margin-bottom: 15px;">Informations de l'envoyeur :</h2>
          <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px; line-height: 1.5; font-size: 16px;">
            <tr>
              <td style="padding: 8px; border-bottom: 1px solid #e2e8f0; font-weight: bold; width: 30%;">Nom :</td>
              <td style="padding: 8px; border-bottom: 1px solid #e2e8f0;">${nom}</td>
            </tr>
            <tr>
              <td style="padding: 8px; border-bottom: 1px solid #e2e8f0; font-weight: bold;">Prénom :</td>
              <td style="padding: 8px; border-bottom: 1px solid #e2e8f0;">${prenom}</td>
            </tr>
            <tr>
              <td style="padding: 8px; border-bottom: 1px solid #e2e8f0; font-weight: bold;">Email :</td>
              <td style="padding: 8px; border-bottom: 1px solid #e2e8f0;">${email}</td>
            </tr>
            <tr>
              <td style="padding: 8px; font-weight: bold;">TéléPhone :</td>
              <td style="padding: 8px;">${Phone}</td>
            </tr>
          </table>
          <p style="font-size: 16px; margin-bottom: 20px;">
            Merci<br />
            L'équipe de Tsidika.
          </p>
        </div>
        <div style="text-align: center; padding-top: 20px; color: #666; font-size: 12px;">
          <p>© 2025 Tsidika, conçu par Stéphanie MAMINIAINA.</p>
        </div>
      </div>
    `,
  };

  await transporter.sendMail(mailOptions);
}

export async function POST(req: Request): Promise<Response> {
  try {
    const body = (await req.json()) as ContactFormData;

    const { nom, prenom, email, Phone, object, message } = body;

    if (!nom || !prenom || !email || !Phone || !object || !message) {
      return NextResponse.json(
        { error: "Tous les champs sont requis." },
        { status: 400 }
      );
    }

    await sendMessageContact(body);

    return NextResponse.json(
      { message: "Message envoyé à l'administrateur avec succès" },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Erreur lors de l'envoi de l'e-mail",
      },
      { status: 500 }
    );
  }
}
