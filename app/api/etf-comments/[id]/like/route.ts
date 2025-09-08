import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { auth } from "@clerk/nextjs";
import { ObjectId } from "mongodb";

export async function POST(req: Request, { params }: { params: { id: string } }) {
  const { db } = await connectToDatabase();
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Não autenticado" }, { status: 401 });
  }
  const commentId = params.id;
  const comment = await db.collection("etf_comments").findOne({ _id: new ObjectId(commentId) });
  if (!comment) {
    return NextResponse.json({ error: "Comentário não encontrado" }, { status: 404 });
  }
  const hasLiked = comment.likes.includes(userId);
  await db.collection("etf_comments").updateOne(
    { _id: new ObjectId(commentId) },
    (hasLiked
      ? { $pull: { likes: userId } }
      : { $addToSet: { likes: userId } }) as any
  );
  return NextResponse.json({ success: true });
} 
