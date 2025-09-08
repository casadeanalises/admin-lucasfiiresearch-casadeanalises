import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { RelevantFactComment } from "@/app/_models/RelevantFactComment";

export async function POST(
  request: Request,
  { params }: { params: { commentId: string } }
) {
  try {
    const { userId } = auth();
    if (!userId) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    await connectToDatabase();
    const comment = await RelevantFactComment.findById(params.commentId);

    if (!comment) {
      return NextResponse.json({ error: "Comentário não encontrado" }, { status: 404 });
    }

    const likeIndex = comment.likes.indexOf(userId);
    if (likeIndex > -1) {
      comment.likes.splice(likeIndex, 1);
    } else {
      comment.likes.push(userId);
    }

    await comment.save();
    return NextResponse.json(comment);
  } catch (error) {
    console.error("Erro ao dar like no comentário:", error);
    return NextResponse.json({ error: "Erro ao dar like no comentário" }, { status: 500 });
  }
} 
