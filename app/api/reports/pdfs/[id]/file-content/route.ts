import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import connectDB from "@/app/lib/mongodb";
import Report, { IReport } from "@/app/models/Report";

export async function GET(
  request: Request,
  { params }: { params: { id: string } },
) {
  try {
    const { id } = params;

    await connectDB();

    // Buscar o conteúdo do arquivo
    const report = await Report.findOne(
      { _id: id, type: "pdf" },
      { fileContent: 1 },
    ).lean<IReport>();

    if (!report || !report.fileContent) {
      return NextResponse.json(
        { message: "Conteúdo não encontrado" },
        { status: 404 },
      );
    }

    return NextResponse.json({ fileContent: report.fileContent });
  } catch (error) {
    console.error("Erro ao buscar o conteúdo do arquivo:", error);
    return NextResponse.json(
      { message: "Erro ao buscar o conteúdo do arquivo", error },
      { status: 500 },
    );
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } },
) {
  try {
    const { id } = params;
    const { fileContent } = await request.json();

    // Verificar se o usuário está autenticado
    const { userId } = auth();
    if (!userId) {
      return NextResponse.json({ message: "Não autorizado" }, { status: 401 });
    }

    await connectDB();

    // Atualizar o conteúdo do arquivo
    const updatedReport = await Report.findByIdAndUpdate(
      id,
      {
        $set: {
          fileContent,
          updatedAt: new Date(),
        },
      },
      { new: true },
    ).lean<IReport>();

    if (!updatedReport) {
      return NextResponse.json(
        { message: "PDF não encontrado" },
        { status: 404 },
      );
    }

    return NextResponse.json({
      message: "Conteúdo do arquivo atualizado com sucesso",
    });
  } catch (error) {
    console.error("Erro ao atualizar o conteúdo do arquivo:", error);
    return NextResponse.json(
      { message: "Erro ao atualizar o conteúdo do arquivo", error },
      { status: 500 },
    );
  }
}
