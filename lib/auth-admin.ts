import { cookies } from "next/headers";
import { verifyJWT } from "./auth";
import { NextResponse } from "next/server";

export async function checkAdminAuth() {
  try {
    const cookieStore = cookies();
    const token = cookieStore.get("admin_token")?.value;

    if (!token) {
      return { isAdmin: false, error: "Token não encontrado" };
    }

    const decoded = await verifyJWT(token);
    if (!decoded || decoded.type !== "admin") {
      return { isAdmin: false, error: "Token inválido" };
    }

    return { isAdmin: true, adminId: decoded.sub, adminEmail: decoded.email };
  } catch (error) {
    console.error("Erro ao verificar autenticação:", error);
    return { isAdmin: false, error: "Erro ao verificar autenticação" };
  }
}

export function unauthorized(message = "Não autorizado") {
  return NextResponse.json({ error: message }, { status: 401 });
}
