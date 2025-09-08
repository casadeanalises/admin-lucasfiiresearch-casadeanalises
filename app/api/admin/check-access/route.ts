import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import Admin from "@/app/models/Admin";
import { verifyJWT, COOKIE_OPTIONS } from "@/lib/auth";
import { cookies } from "next/headers";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    // Verifica sistema personalizado
    const cookieStore = cookies();
    const token = cookieStore.get(COOKIE_OPTIONS.name)?.value;

    if (!token) {
      console.log("Token personalizado não encontrado");
      return NextResponse.json({ isAdmin: false });
    }

    // Verificar token
    const decoded = await verifyJWT(token);
    if (!decoded || decoded.type !== "admin") {
      console.log("Token inválido");
      return NextResponse.json({ isAdmin: false });
    }

    // Conectar ao MongoDB
    await connectToDatabase();

    // Buscar admin no MongoDB
    const admin = await Admin.findById(decoded.sub);
    console.log("Admin encontrado:", admin ? "Sim" : "Não");

    if (!admin) {
      console.log("Admin não encontrado no MongoDB");
      return NextResponse.json({ isAdmin: false });
    }

    return NextResponse.json({
      isAdmin: true,
      email: admin.email,
      admin: {
        email: admin.email
      }
    });

  } catch (error) {
    console.error("Erro ao verificar acesso administrativo:", error);
    return NextResponse.json({ isAdmin: false });
  }
}