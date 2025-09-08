import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongoose";
import Admin from "@/app/models/Admin";
import { cookies } from "next/headers";
import { verifyJWT } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    // Verifica autenticação
    const token = cookies().get("admin_token")?.value;
    if (!token) {
      return NextResponse.json({ message: "Não autorizado" }, { status: 401 });
    }

    try {
      const payload = await verifyJWT(token);
      if (!payload || payload.type !== "admin") {
        throw new Error("Token inválido");
      }
    } catch (err) {
      return NextResponse.json({ message: "Token inválido" }, { status: 401 });
    }

    await connectDB();

    // Busca todos os admins, excluindo o campo password
    const admins = await Admin.find({}, { password: 0 }).sort({
      createdAt: -1,
    });

    return NextResponse.json({ admins });
  } catch (error) {
    console.error("Erro ao listar admins:", error);
    return NextResponse.json(
      { message: "Erro ao listar administradores" },
      { status: 500 },
    );
  }
}
