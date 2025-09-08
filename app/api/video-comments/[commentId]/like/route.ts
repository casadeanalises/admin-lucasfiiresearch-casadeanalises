import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs";
import connectDB from "@/app/lib/mongodb";
import { VideoComment } from "@/app/_models/VideoComment";

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

    await connectDB();
    const comment = await VideoComment.findById(params.commentId);

    if (!comment) {
      return NextResponse.json(
        { error: "Comentário não encontrado" },
        { status: 404 }
      );
    }

    const userLikedIndex = comment.likes.indexOf(userId);
    
    if (userLikedIndex === -1) {
      comment.likes.push(userId);
    } else {
      comment.likes.splice(userLikedIndex, 1);
    }

    await comment.save();
    return NextResponse.json(comment);
  } catch (error) {
    return NextResponse.json(
      { error: "Erro ao processar like" },
      { status: 500 }
    );
  }
} 