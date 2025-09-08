import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { COOKIE_OPTIONS } from "@/lib/auth";

export async function POST() {
  try {
    // Limpa o cookie de autenticação
    const response = NextResponse.json(
      { success: true, message: "Logout realizado com sucesso" },
      { status: 200 },
    );

    // Remove o cookie de admin
    response.cookies.delete(COOKIE_OPTIONS.name);

    return response;
  } catch (error) {
    console.error("Erro ao fazer logout:", error);
    return NextResponse.json(
      { success: false, message: "Erro ao fazer logout" },
      { status: 500 },
    );
  }
}
