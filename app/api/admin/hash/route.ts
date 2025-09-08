import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";

export async function POST(request: Request) {
  try {
    const { password } = await request.json();

    if (!password) {
      return NextResponse.json(
        { message: "Senha é obrigatória" },
        { status: 400 },
      );
    }

    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);

    return NextResponse.json({ hash });
  } catch (error) {
    console.error("Erro ao gerar hash:", error);
    return NextResponse.json(
      { message: "Erro ao gerar hash" },
      { status: 500 },
    );
  }
}
