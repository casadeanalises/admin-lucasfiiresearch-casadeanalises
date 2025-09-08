import { NextResponse } from "next/server";
import connectDB from "@/app/lib/mongodb";
import Admin from "@/app/models/Admin";

export async function GET() {
  try {
    await connectDB();

    const adminCollection = await Admin.collection;

    // Atualiza o documento com datas corretas
    await adminCollection.updateOne(
      { email: "alanrochaarg2001@gmail.com" },
      {
        $set: {
          lastVerified: new Date(),
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      },
    );

    return NextResponse.json({
      message: "Datas atualizadas com sucesso",
    });
  } catch (error) {
    console.error("Erro ao atualizar datas:", error);
    return NextResponse.json(
      { error: "Erro ao atualizar datas" },
      { status: 500 },
    );
  }
}
