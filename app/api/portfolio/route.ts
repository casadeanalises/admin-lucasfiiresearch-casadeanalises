import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import connectDB from "@/app/lib/mongodb";
import { Portfolio } from "@/app/_models/Portfolio";

// GET - Buscar portfólio do usuário
export async function GET() {
  try {
    const { userId } = auth();
    if (!userId) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    await connectDB();
    const portfolio = await Portfolio.findOne({ userId });

    return NextResponse.json({ portfolio: portfolio?.items || [] });
  } catch (error) {
    console.error("Erro ao buscar portfólio:", error);
    return NextResponse.json(
      { error: "Erro ao buscar portfólio" },
      { status: 500 },
    );
  }
}

// POST - Salvar/Atualizar portfólio do usuário
export async function POST(request: Request) {
  try {
    const { userId } = auth();
    if (!userId) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const { items } = await request.json();
    await connectDB();

    const portfolio = await Portfolio.findOneAndUpdate(
      { userId },
      { userId, items },
      { upsert: true, new: true },
    );

    return NextResponse.json({ portfolio });
  } catch (error) {
    console.error("Erro ao salvar portfólio:", error);
    return NextResponse.json(
      { error: "Erro ao salvar portfólio" },
      { status: 500 },
    );
  }
}

// DELETE - Remover item do portfólio
export async function DELETE(request: Request) {
  try {
    const { userId } = auth();
    if (!userId) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const { itemIndex } = await request.json();
    await connectDB();

    const portfolio = await Portfolio.findOne({ userId });
    if (!portfolio) {
      return NextResponse.json(
        { error: "Portfólio não encontrado" },
        { status: 404 },
      );
    }

    portfolio.items.splice(itemIndex, 1);
    await portfolio.save();

    return NextResponse.json({ portfolio });
  } catch (error) {
    console.error("Erro ao remover item do portfólio:", error);
    return NextResponse.json(
      { error: "Erro ao remover item do portfólio" },
      { status: 500 },
    );
  }
}

// PUT - Atualizar item específico do portfólio
export async function PUT(request: Request) {
  try {
    const { userId } = auth();
    if (!userId) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const { index, item } = await request.json();
    await connectDB();

    const portfolio = await Portfolio.findOne({ userId });
    if (!portfolio) {
      return NextResponse.json(
        { error: "Portfólio não encontrado" },
        { status: 404 },
      );
    }

    // Atualiza o item específico no array
    portfolio.items[index] = item;
    await portfolio.save();

    return NextResponse.json({ portfolio });
  } catch (error) {
    console.error("Erro ao atualizar item do portfólio:", error);
    return NextResponse.json(
      { error: "Erro ao atualizar item do portfólio" },
      { status: 500 },
    );
  }
}
