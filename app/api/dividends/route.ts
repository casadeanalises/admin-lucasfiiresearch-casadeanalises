import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { auth } from "@clerk/nextjs/server";
import { ObjectId } from "mongodb";

export async function GET() {
  try {
    const { userId } = auth();
    
    if (!userId) {
      return NextResponse.json(
        { error: "Usuário não autenticado" },
        { status: 401 }
      );
    }

    const { db } = await connectToDatabase();
    const dividends = await db.collection("dividends").find({ userId }).toArray();
    
    return NextResponse.json({ dividends });
  } catch (error) {
    console.error("Erro ao carregar dividendos:", error);
    return NextResponse.json(
      { error: "Erro ao carregar dividendos" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { userId } = auth();
    
    if (!userId) {
      return NextResponse.json(
        { error: "Usuário não autenticado" },
        { status: 401 }
      );
    }

    const { db } = await connectToDatabase();
    const body = await request.json();
    
    const { fii, amount, date } = body;
    
    if (!fii || !amount || !date) {
      return NextResponse.json(
        { error: "Dados incompletos" },
        { status: 400 }
      );
    }
    
    const newDividend = {
      userId,
      fii,
      amount: Number(amount),
      date,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    const result = await db.collection("dividends").insertOne(newDividend);
    
    return NextResponse.json({
      success: true,
      dividend: { ...newDividend, _id: result.insertedId }
    });
  } catch (error) {
    console.error("Erro ao criar dividendo:", error);
    return NextResponse.json(
      { error: "Erro ao criar dividendo" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { userId } = auth();
    
    if (!userId) {
      return NextResponse.json(
        { error: "Usuário não autenticado" },
        { status: 401 }
      );
    }

    const { db } = await connectToDatabase();
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    
    if (!id) {
      return NextResponse.json(
        { error: "ID do dividendo não fornecido" },
        { status: 400 }
      );
    }
    
    const result = await db.collection("dividends").deleteOne({ _id: new ObjectId(id), userId: userId });
    
    if (result.deletedCount === 0) {
      return NextResponse.json(
        { error: "Dividendo não encontrado" },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Erro ao deletar dividendo:", error);
    return NextResponse.json(
      { error: "Erro ao deletar dividendo" },
      { status: 500 }
    );
  }
}
