import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongoose";
import Admin from "@/app/models/Admin";

const ADMIN_EMAIL = process.env.ADMIN_EMAIL;
const ADMIN_INITIAL_PASSWORD = process.env.ADMIN_INITIAL_PASSWORD;
const ADMIN_SETUP_KEY = process.env.ADMIN_SETUP_KEY;

export async function POST(request: Request) {
  try {
    const { setupKey } = await request.json();

    // Verifica se as variáveis de ambiente estão configuradas
    if (!ADMIN_EMAIL || !ADMIN_INITIAL_PASSWORD || !ADMIN_SETUP_KEY) {
      return NextResponse.json(
        { message: "Configuração de admin não definida no servidor" },
        { status: 500 },
      );
    }

    // Verifica a chave de setup
    if (!setupKey || setupKey !== ADMIN_SETUP_KEY) {
      return NextResponse.json(
        { message: "Chave de setup inválida" },
        { status: 401 },
      );
    }

    await connectDB();

    // Verifica se já existe algum admin
    const existingAdmin = await Admin.findOne({ email: ADMIN_EMAIL });

    if (existingAdmin) {
      return NextResponse.json({ message: "Admin já existe" }, { status: 400 });
    }

    // Cria o primeiro admin
    const admin = new Admin({
      email: ADMIN_EMAIL,
      password: ADMIN_INITIAL_PASSWORD,
    });

    await admin.save();

    return NextResponse.json(
      {
        message:
          "Admin criado com sucesso. Por favor, altere a senha no primeiro acesso.",
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
