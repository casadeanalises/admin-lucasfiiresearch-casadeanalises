import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/app/lib/mongodb";
import Educational from "@/app/models/Educational";
import { auth } from "@clerk/nextjs";

// GET - Listar todos os artigos
export async function GET(request: NextRequest) {
  try {
    await connectDB();
    const slug = request.nextUrl.searchParams.get("slug");

    if (slug) {
      const article = await Educational.findOne({ slug });
      if (!article) {
        return NextResponse.json({ error: "Artigo não encontrado" }, { status: 404 });
      }
      return NextResponse.json(article);
    }

    const articles = await Educational.find({}).sort({ publishedAt: -1 });
    return NextResponse.json(articles);
  } catch (error) {
    console.error("Erro ao buscar artigos educacionais:", error);
    return NextResponse.json(
      { error: "Erro ao buscar artigos educacionais" },
      { status: 500 }
    );
  }
}

// POST - Criar novo artigo
export async function POST(request: NextRequest) {
  try {
    const { userId } = auth();
    if (!userId) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    await connectDB();
    const data = await request.json();
    
    // Verifica se já existe um artigo com o mesmo slug
    const existingArticle = await Educational.findOne({ slug: data.slug });
    if (existingArticle) {
      return NextResponse.json(
        { error: "Já existe um artigo com este slug" },
        { status: 400 }
      );
    }

    const article = await Educational.create({
      ...data,
      publishedAt: new Date(),
    });

    return NextResponse.json(article, { status: 201 });
  } catch (error) {
    console.error("Erro ao criar artigo:", error);
    return NextResponse.json({ error: "Erro ao criar artigo" }, { status: 500 });
  }
}

// PUT - Atualizar artigo
export async function PUT(request: NextRequest) {
  try {
    const { userId } = auth();
    if (!userId) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    await connectDB();
    const slug = request.nextUrl.searchParams.get("slug");
    if (!slug) {
      return NextResponse.json({ error: "Slug não fornecido" }, { status: 400 });
    }

    const data = await request.json();
    
    // Verifica se já existe outro artigo com o novo slug
    if (data.slug !== slug) {
      const existingArticle = await Educational.findOne({ slug: data.slug });
      if (existingArticle) {
        return NextResponse.json(
          { error: "Já existe um artigo com este slug" },
          { status: 400 }
        );
      }
    }

    const article = await Educational.findOneAndUpdate(
      { slug },
      { ...data, updatedAt: new Date() },
      { new: true }
    );

    if (!article) {
      return NextResponse.json({ error: "Artigo não encontrado" }, { status: 404 });
    }

    return NextResponse.json(article);
  } catch (error) {
    console.error("Erro ao atualizar artigo:", error);
    return NextResponse.json({ error: "Erro ao atualizar artigo" }, { status: 500 });
  }
}

// DELETE - Excluir artigo
export async function DELETE(request: NextRequest) {
  try {
    const { userId } = auth();
    if (!userId) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    await connectDB();
    const slug = request.nextUrl.searchParams.get("slug");
    if (!slug) {
      return NextResponse.json({ error: "Slug não fornecido" }, { status: 400 });
    }

    const article = await Educational.findOneAndDelete({ slug });
    if (!article) {
      return NextResponse.json({ error: "Artigo não encontrado" }, { status: 404 });
    }

    return NextResponse.json({ message: "Artigo excluído com sucesso" });
  } catch (error) {
    console.error("Erro ao excluir artigo:", error);
    return NextResponse.json({ error: "Erro ao excluir artigo" }, { status: 500 });
  }
} 