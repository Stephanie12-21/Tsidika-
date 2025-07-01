import jwt from "jsonwebtoken";
import { NextRequest } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest): Promise<Response> {
  try {
    const token = req.nextUrl.searchParams.get("token");

    if (!token) {
      return new Response("Token manquant", { status: 400 });
    }

    const secret = process.env.JWT_SECRET;
    if (!secret) {
      console.error("JWT_SECRET non défini");
      return new Response("Erreur de configuration", { status: 500 });
    }

    // Vérifie que le token est bien valide
    const decoded = jwt.verify(token, secret) as { email: string };

    // Ici on ne fait rien avec l'email puisque pas de DB
    console.log(`Désabonnement de l'email : ${decoded.email}`);

    // Redirige vers la page d'accueil
    return new Response(null, {
      status: 302,
      headers: { Location: "/" },
    });
  } catch (error) {
    console.error("Erreur de désabonnement :", error);

    return new Response(null, {
      status: 302,
      headers: { Location: "/" },
    });
  }
}
