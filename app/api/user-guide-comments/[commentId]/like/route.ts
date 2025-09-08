import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs";
import connectDB from "@/app/lib/mongodb";
import { UserGuideComment } from "@/app/_models/UserGuideComment";

export async function POST(
  request: Request,
  { params }: { params: { commentId: string } }
) {
  try {
    const { userId } = auth();

    if (!userId) {
      return NextResponse.json(
        { error: "Usuário não autenticado" },
        { status: 401 }
      );
    }

    await connectDB();

    const comment = await UserGuideComment.findById(params.commentId);

    if (!comment) {
      return NextResponse.json(
        { error: "Comentário não encontrado" },
        { status: 404 }
      );
    }

    const hasLiked = comment.likes.includes(userId);

    if (hasLiked) {
      comment.likes = comment.likes.filter((id: string) => id !== userId);
    } else {
      comment.likes.push(userId);
    }

    await comment.save();

    return NextResponse.json(comment);
  } catch (error) {
    console.error("Erro ao dar like no comentário:", error);
    return NextResponse.json(
      { error: "Erro ao dar like no comentário" },
      { status: 500 }
    );
  }
} 