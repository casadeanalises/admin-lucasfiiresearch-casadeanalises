import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { ObjectId } from "mongodb";

export async function GET() {
  try {
    const { db } = await connectToDatabase();
    const pdfs = await db
      .collection("etf_pdfs")
      .find({})
      .sort({ createdAt: -1 })
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

export async function POST(request: Request) {
  try {
    const { db } = await connectToDatabase();
    const data = await request.json();

    const pdf = {
      ...data,
      createdAt: new Date(),
      updatedAt: new Date(),
      active: true,
    };

    const result = await db.collection("etf_pdfs").insertOne(pdf);

    return NextResponse.json({
      message: "PDF criado com sucesso",
      pdf: { ...pdf, _id: result.insertedId },
    });
  } catch (error) {
    console.error("Erro ao criar PDF:", error);
    return NextResponse.json(
      { error: "Erro ao criar PDF" },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const { db } = await connectToDatabase();
    const data = await request.json();
    const { _id, ...updateData } = data;

    const result = await db
      .collection("etf_pdfs")
      .updateOne(
        { _id: new ObjectId(_id) },
        {
          $set: {
            ...updateData,
            updatedAt: new Date(),
          },
        }
      );

    if (result.matchedCount === 0) {
      return NextResponse.json(
        { error: "PDF não encontrado" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      message: "PDF atualizado com sucesso",
    });
  } catch (error) {
    console.error("Erro ao atualizar PDF:", error);
    return NextResponse.json(
      { error: "Erro ao atualizar PDF" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const { db } = await connectToDatabase();
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "ID não fornecido" },
        { status: 400 }
      );
    }

    const result = await db
      .collection("etf_pdfs")
      .deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 0) {
      return NextResponse.json(
        { error: "PDF não encontrado" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      message: "PDF excluído com sucesso",
    });
  } catch (error) {
    console.error("Erro ao excluir PDF:", error);
    return NextResponse.json(
      { error: "Erro ao excluir PDF" },
      { status: 500 }
    );
  }
} 