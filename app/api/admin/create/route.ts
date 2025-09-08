import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongoose";
import Admin from "@/app/models/Admin";
import { getAuthPayload } from "@/lib/auth";

export async function POST(request: Request) {
  try {
    // Verifica o token do admin atual usando a nova função
    const payload = await getAuthPayload();

    if (!payload) {
      console.log("Erro de autenticação: Token não encontrado ou inválido");
      return NextResponse.json(
        {
          message:
            "Não autorizado. Por favor, faça login novamente ou use a página de Restaurar Autenticação.",
          code: "auth_failed",
        },
        { status: 401 },
      );
    }

    // Pega os dados do novo admin
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { message: "Email e senha são obrigatórios" },
        { status: 400 },
      );
    }

    await connectDB();

    // Verifica se já existe um admin com este email
    const existingAdmin = await Admin.findOne({ email: email.toLowerCase() });

    if (existingAdmin) {
      return NextResponse.json(
        { message: "Já existe um admin com este email" },
        { status: 400 },
      );
    }

    // Cria o novo admin
    const admin = new Admin({
      email: email.toLowerCase(),
      password,
    });

    await admin.save();

    return NextResponse.json(
      {
        message: "Admin criado com sucesso",
        adminEmail: admin.email,
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Erro ao criar admin:", error);
    return NextResponse.json(
      { message: "Erro ao criar admin" },
      { status: 500 },
    );
  }
}
