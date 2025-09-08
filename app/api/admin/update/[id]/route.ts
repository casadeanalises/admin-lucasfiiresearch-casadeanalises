import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongoose";
import Admin from "@/app/models/Admin";
import { cookies } from "next/headers";
import { verifyJWT } from "@/lib/auth";
import bcrypt from "bcryptjs";

export async function PUT(
  request: Request,
  { params }: { params: { id: string } },
) {
  try {
    // Verifica autenticação
    const token = cookies().get("admin_token")?.value;
    if (!token) {
      return NextResponse.json({ message: "Não autorizado" }, { status: 401 });
    }

    let payload;
    try {
      payload = await verifyJWT(token);
      if (!payload || payload.type !== "admin") {
        throw new Error("Token inválido");
      }
    } catch (err) {
      return NextResponse.json({ message: "Token inválido" }, { status: 401 });
    }

    const { email, password } = await request.json();

    if (!email) {
      return NextResponse.json(
        { message: "Email é obrigatório" },
        { status: 400 },
      );
    }

    await connectDB();

    // Verifica se o email já está em uso por outro admin
    const existingAdmin = await Admin.findOne({
      email: email.toLowerCase(),
      _id: { $ne: params.id },
    });

    if (existingAdmin) {
      return NextResponse.json(
        { message: "Este email já está em uso" },
        { status: 400 },
      );
    }

    // Prepara os dados para atualização
    const updateData: any = {
      email: email.toLowerCase(),
      updatedAt: new Date(),
    };

    // Se uma nova senha foi fornecida, criptografa e adiciona aos dados de atualização
    if (password) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
      updateData.password = hashedPassword;
    }

    const updatedAdmin = await Admin.findByIdAndUpdate(params.id, updateData, {
      new: true,
      select: "-password",
    });

    if (!updatedAdmin) {
      return NextResponse.json(
        { message: "Administrador não encontrado" },
        { status: 404 },
      );
    }

    return NextResponse.json({
      message: "Administrador atualizado com sucesso",
      admin: updatedAdmin,
    });
  } catch (error) {
    console.error("Erro ao atualizar admin:", error);
    return NextResponse.json(
      { message: "Erro ao atualizar administrador" },
      { status: 500 },
    );
  }
}
