import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongoose";
import Admin from "@/app/models/Admin";
import { cookies } from "next/headers";
import { verifyJWT } from "@/lib/auth";

export async function DELETE(
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

      // Não permite que um admin exclua a si mesmo
      if (payload.sub === params.id) {
        return NextResponse.json(
          { message: "Você não pode excluir sua própria conta" },
          { status: 400 },
        );
      }
    } catch (err) {
      return NextResponse.json({ message: "Token inválido" }, { status: 401 });
    }

    await connectDB();

    // Verifica se existe mais de um admin antes de excluir
    const adminCount = await Admin.countDocuments();
    if (adminCount <= 1) {
      return NextResponse.json(
        { message: "Não é possível excluir o último administrador" },
        { status: 400 },
      );
    }

    const deletedAdmin = await Admin.findByIdAndDelete(params.id);

    if (!deletedAdmin) {
      return NextResponse.json(
        { message: "Administrador não encontrado" },
        { status: 404 },
      );
    }

    return NextResponse.json({
      message: "Administrador excluído com sucesso",
    });
  } catch (error) {
    console.error("Erro ao excluir admin:", error);
    return NextResponse.json(
      { message: "Erro ao excluir administrador" },
      { status: 500 },
    );
  }
}
