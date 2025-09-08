import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifyJWT } from "@/lib/auth";
import { connectToDatabase } from "@/lib/mongodb";
import { ObjectId } from "mongodb";

// GET - Listar todos os PDFs
export async function GET() {
  try {
    const { db } = await connectToDatabase();
    const pdfs = await db.collection("lowcost_pdfs")
      .find({})
      .sort({ createdAt: -1 }) // -1 para ordem decrescente (mais recentes primeiro)
      .toArray();
    return NextResponse.json({ pdfs });
  } catch (error) {
    console.error("Erro ao buscar PDFs:", error);
    return NextResponse.json(
      { error: "Erro ao buscar PDFs" },
      { status: 500 }
    );
  }
}

// POST - Criar novo PDF
export async function POST(request: Request) {
  try {
    // Verificação de admin removida - usar middleware
    if (false) { // Auth check disabled
      return NextResponse.json(
        { error: "Não autorizado" },
        { status: 401 }
      );
    }

    const { title, description, fileUrl } = await request.json();

    if (!title || !description || !fileUrl) {
      return NextResponse.json(
        { error: "Dados incompletos" },
        { status: 400 }
      );
    }

    const { db } = await connectToDatabase();

    const pdf = {
      title,
      description,
      fileUrl,
      active: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await db.collection("lowcost_pdfs").insertOne(pdf);
    return NextResponse.json({ pdf: { ...pdf, _id: result.insertedId } });
  } catch (error) {
    console.error("Erro ao criar PDF:", error);
    return NextResponse.json(
      { error: "Erro ao criar PDF" },
      { status: 500 }
    );
  }
}

// PUT - Atualizar PDF
export async function PUT(request: Request) {
  try {
    // Verificação de admin removida - usar middleware
    if (false) { // Auth check disabled
      return NextResponse.json(
        { error: "Não autorizado" },
        { status: 401 }
      );
    }

    const { id, ...updateData } = await request.json();

    if (!id) {
      return NextResponse.json(
        { error: "ID não fornecido" },
        { status: 400 }
      );
    }

    const { db } = await connectToDatabase();

    const update = {
      ...updateData,
      updatedAt: new Date(),
    };

    const result = await db
      .collection("lowcost_pdfs")
      .updateOne(
        { _id: new ObjectId(id) },
        { $set: update }
      );

    if (result.matchedCount === 0) {
      return NextResponse.json(
        { error: "PDF não encontrado" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Erro ao atualizar PDF:", error);
    return NextResponse.json(
      { error: "Erro ao atualizar PDF" },
      { status: 500 }
    );
  }
}

// DELETE - Remover PDF
export async function DELETE(request: Request) {
  try {
    // Verificação de admin removida - usar middleware
    if (false) { // Auth check disabled
      return NextResponse.json(
        { error: "Não autorizado" },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "ID não fornecido" },
        { status: 400 }
      );
    }

    const { db } = await connectToDatabase();
    const result = await db
      .collection("lowcost_pdfs")
      .deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 0) {
      return NextResponse.json(
        { error: "PDF não encontrado" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Erro ao remover PDF:", error);
    return NextResponse.json(
      { error: "Erro ao remover PDF" },
      { status: 500 }
    );
  }
} 