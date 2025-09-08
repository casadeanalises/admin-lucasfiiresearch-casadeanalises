import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import Admin from "@/app/models/Admin";
import { verifyJWT, COOKIE_OPTIONS } from "@/lib/auth";
import { cookies } from "next/headers";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    // Primeiro verifica se há autenticação via Clerk
    try {
      const { auth } = await import("@clerk/nextjs/server");
      const authResult = await auth();
      if (authResult.userId) {
        console.log("Usuário autenticado via Clerk:", authResult.userId);
        return NextResponse.json({
          isAdmin: true,
          email: "admin@clerk.com", // Você pode buscar o email real do Clerk se necessário
          type: "clerk",
          admin: {
            email: "admin@clerk.com"
          }
        });
      }
    } catch (clerkError) {
      console.log("Clerk não disponível, verificando sistema personalizado");
    }

    // Se não for Clerk, verifica sistema personalizado
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
      type: "custom",
      admin: {
        email: admin.email
      }
    });

  } catch (error) {
    console.error("Erro ao verificar acesso administrativo:", error);
    return NextResponse.json({ isAdmin: false });
  }
}