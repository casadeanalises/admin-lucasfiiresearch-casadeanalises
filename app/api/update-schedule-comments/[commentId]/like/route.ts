import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { UpdateScheduleComment } from "@/app/models/UpdateScheduleComment";
import { auth } from "@clerk/nextjs";

export async function POST(
  request: Request,
  { params }: { params: { commentId: string } }
) {
  try {
    const { userId } = auth();
    if (!userId) {
      return NextResponse.json(
        { error: 'Não autorizado' },
        { status: 401 }
      );
    }

    await connectToDatabase();

    const comment = await UpdateScheduleComment.findById(params.commentId);
    if (!comment) {
      return NextResponse.json(
        { error: 'Comentário não encontrado' },
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
    console.error('Error liking comment:', error);
    return NextResponse.json(
      { error: 'Erro ao curtir comentário' },
      { status: 500 }
    );
  }
}
