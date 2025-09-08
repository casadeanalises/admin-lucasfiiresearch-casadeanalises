import { NextResponse } from "next/server";
import { auth, clerkClient } from "@clerk/nextjs";
import { connectToDatabase } from "@/lib/mongodb";
import { ObjectId } from "mongodb";

// GET - Listar todos os comentários
export async function GET() {
  try {
    const { db } = await connectToDatabase();
    const comments = await db.collection("lowcost_comments").find({}).toArray();
    return NextResponse.json(comments);
  } catch (error) {
    console.error("Erro ao buscar comentários:", error);
    return NextResponse.json(
      { error: "Erro ao buscar comentários" },
      { status: 500 }
    );
  }
}

// POST - Criar novo comentário
export async function POST(request: Request) {
  try {
    const { userId } = auth();
    if (!userId) {
      return NextResponse.json(
        { error: "Não autorizado" },
        { status: 401 }
      );
    }

    const { content, parentId } = await request.json();

    if (!content || !content.trim()) {
      return NextResponse.json(
        { error: "Conteúdo é obrigatório" },
        { status: 400 }
      );
    }

    const { db } = await connectToDatabase();

    // Buscar informações do usuário Clerk
    const user = await clerkClient.users.getUser(userId);
    if (!user) {
      return NextResponse.json(
        { error: "Usuário não encontrado" },
        { status: 404 }
      );
    }

    const comment = {
      userId,
      userName: `${user?.firstName || ""} ${user?.lastName || ""}`.trim() || user?.username || "Usuário",
      userImage: user?.imageUrl || "/profile-image.jpg",
      content: content.trim(),
      likes: [],
      parentId: parentId || null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await db.collection("lowcost_comments").insertOne(comment);
    return NextResponse.json({ ...comment, _id: result.insertedId });
  } catch (error) {
    console.error("Erro ao criar comentário:", error);
    return NextResponse.json(
      { error: "Erro ao criar comentário" },
      { status: 500 }
    );
  }
} 