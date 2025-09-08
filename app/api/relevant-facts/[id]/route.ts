import { NextResponse } from "next/server";
import connectDB from "@/app/lib/mongodb";
import RelevantFact from "@/app/_models/RelevantFact";
import { checkAdminAuth, unauthorized } from "@/lib/auth-admin";

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { isAdmin, error } = await checkAdminAuth();

    if (!isAdmin) {
      return unauthorized(error);
    }

    console.log("ID recebido na edição:", params.id);
    
    if (!params.id || params.id === "undefined") {
      console.error("ID inválido recebido:", params.id);
      return NextResponse.json(
        { error: "ID inválido" },
        { status: 400 }
      );
    }

    await connectDB();
    const deletedFact = await RelevantFact.findByIdAndDelete(params.id);
    
    if (!deletedFact) {
      return NextResponse.json(
        { error: "Fato relevante não encontrado" },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: "Fato relevante excluído com sucesso" });
  } catch (error) {
    console.error("Erro ao deletar fato relevante:", error);
    return NextResponse.json(
      { error: "Erro ao deletar fato relevante" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { isAdmin, error } = await checkAdminAuth();

    if (!isAdmin) {
      return unauthorized(error);
    }

    if (!params.id || params.id === "undefined") {
      return NextResponse.json(
        { error: "ID inválido" },
        { status: 400 }
      );
    }

    await connectDB();
    const data = await request.json();
    
    const updatedFact = await RelevantFact.findByIdAndUpdate(
      params.id,
      { 
        title: data.title,
        description: data.description,
        pdfUrl: data.pdfUrl,
        updatedAt: new Date() 
      },
      { new: true }
    );

    if (!updatedFact) {
      return NextResponse.json(
        { error: "Fato relevante não encontrado" },
        { status: 404 }
      );
    }

    const response = {
      ...updatedFact.toObject(),
      id: updatedFact._id.toString()
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error("Erro ao atualizar fato relevante:", error);
    return NextResponse.json(
      { error: "Erro ao atualizar fato relevante" },
      { status: 500 }
    );
  }
}