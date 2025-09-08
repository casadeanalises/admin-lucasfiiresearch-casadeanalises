import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs";
import { connectToDatabase } from "@/lib/mongodb";
import { ObjectId } from "mongodb";

// POST - Dar/remover like em um comentário
export async function POST(
  request: Request,
  { params }: { params: { commentId: string } }
) {
  try {
    const { userId } = auth();
    if (!userId) {
      return NextResponse.json(
        { error: "Não autorizado" },
        { status: 401 }
      );
    }

    const { commentId } = params;

    if (!commentId) {
      return NextResponse.json(
        { error: "ID do comentário não fornecido" },
        { status: 400 }
      );
    }

    const { db } = await connectToDatabase();

    // Buscar o comentário
    const comment = await db.collection("lowcost_comments").findOne({
      _id: new ObjectId(commentId),
    });

    if (!comment) {
      return NextResponse.json(
        { error: "Comentário não encontrado" },
        { status: 404 }
      );
    }

    // Verificar se o usuário já deu like
    const hasLiked = comment.likes.includes(userId);

    // Atualizar o comentário
    if (hasLiked) {
      // Remover like
      const newLikes = comment.likes.filter((id: string) => id !== userId);
      await db.collection("lowcost_comments").updateOne(
        { _id: new ObjectId(commentId) },
        { $set: { likes: newLikes } }
      );
    } else {
      // Adicionar like
      const newLikes = [...comment.likes, userId];
      await db.collection("lowcost_comments").updateOne(
        { _id: new ObjectId(commentId) },
        { $set: { likes: newLikes } }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Erro ao processar like:", error);
    return NextResponse.json(
      { error: "Erro ao processar like" },
      { status: 500 }
    );
  }
} 