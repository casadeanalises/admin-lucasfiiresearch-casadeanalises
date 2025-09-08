import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { COOKIE_OPTIONS } from "@/lib/auth";

export async function POST() {
  try {
    console.log("API de logout chamada");
    
    // Limpa o cookie de autenticação
    const response = NextResponse.json(
      { success: true, message: "Logout realizado com sucesso" },
      { status: 200 },
    );

    // Remove o cookie de admin com todas as opções necessárias
    response.cookies.set(COOKIE_OPTIONS.name, "", {
      ...COOKIE_OPTIONS,
      expires: new Date(0), // Define data no passado para expirar
      maxAge: 0,
    });

    // Também tenta deletar o cookie
    response.cookies.delete(COOKIE_OPTIONS.name);

    console.log("Cookie de admin removido");
    return response;
  } catch (error) {
    console.error("Erro ao fazer logout:", error);
    return NextResponse.json(
      { success: false, message: "Erro ao fazer logout" },
      { status: 500 },
    );
  }
}
