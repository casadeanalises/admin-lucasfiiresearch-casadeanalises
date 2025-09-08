import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongoose";
import Admin from "@/app/models/Admin";
import bcrypt from "bcryptjs";
import { signJWT, COOKIE_OPTIONS } from "@/lib/auth";

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { message: "Email e senha são obrigatórios" },
        { status: 400 },
      );
    }

    await connectDB();

    const admin = await Admin.findOne({ email: email.toLowerCase() });
    console.log("Admin encontrado:", admin ? "Sim" : "Não");

    if (!admin) {
      return NextResponse.json(
        { message: "Credenciais inválidas" },
        { status: 401 },
      );
    }

    const isValidPassword = await bcrypt.compare(password, admin.password);
    console.log("Senha válida:", isValidPassword);

    if (!isValidPassword) {
      return NextResponse.json(
        { message: "Credenciais inválidas" },
        { status: 401 },
      );
    }

    // Gera o token JWT com payload mínimo
    const tokenPayload = {
      sub: admin._id.toString(), // Identificador único do admin
      email: admin.email,
      type: "admin",
    };

    console.log("Gerando token com payload:", tokenPayload);
    const token = await signJWT(tokenPayload);

    // Cria a resposta com o cookie
    const response = NextResponse.json(
      {
        message: "Login realizado com sucesso",
        success: true,
      },
      { status: 200 },
    );

    // Define o cookie com o token
    const cookieOptions = {
      ...COOKIE_OPTIONS,
      value: token,
    };

    console.log("Configurando cookie:", {
      name: cookieOptions.name,
      maxAge: cookieOptions.maxAge,
      httpOnly: cookieOptions.httpOnly,
      secure: cookieOptions.secure,
      sameSite: cookieOptions.sameSite,
    });

    response.cookies.set(cookieOptions);

    return response;
  } catch (error) {
    console.error("Erro no login de admin:", error);
    return NextResponse.json(
      { message: "Erro ao fazer login" },
      { status: 500 },
    );
  }
}
